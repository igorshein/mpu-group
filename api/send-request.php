<?php
/**
 * Обработчик заявки «Экспресс-запрос / Расчёт заявки за 15 минут».
 * Принимает POST (multipart/form-data или JSON), валидирует данные и отправляет письмо
 * на info@mpugroup.ru с вложением (файл ТЗ/спецификации), если он приложен.
 *
 * Требования: PHP 5.6+ (проверено на 5.6 и 8.x), расширение mail() в настройках
 * почты хостинга. Внешние зависимости не нужны.
 *
 * НАСТРОЙКА ПЕРЕД РАЗМЕЩЕНИЕМ:
 *  1) MAIL_FROM       — адрес отправителя на вашем домене (обязателен, иначе SPF/DMARC
 *                       отклонят письмо). Должен совпадать с доменом хостинга.
 *  2) ALLOWED_ORIGINS — список доменов, с которых разрешён кросс-доменный POST.
 *                       Для временного размещения на GitHub Pages оставьте как есть,
 *                       для основного хостинга добавьте свой домен.
 *  3) SITE_URL        — адрес сайта, который попадёт в письмо.
 */

const RECIPIENT_EMAIL   = 'info@mpugroup.ru';
const SITE_NAME         = 'MPU GROUP';
const SITE_URL          = 'https://mpugroup.ru';
const ALLOWED_ORIGINS   = ['https://mpugroup.ru','https://www.mpugroup.ru','https://igorshein.github.io'];
const MAIL_FROM         = 'no-reply@mpugroup.ru'; // адрес отправителя на вашем домене (SPF/DMARC)
const MAX_UPLOAD_BYTES  = 10485760; // 10 МБ
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'dwg', 'dxf', 'zip', 'rar', 'jpg', 'jpeg', 'png'];
const MAX_FIELDS_LENGTH  = 500;
const SUBJECT_PREFIX     = 'Заявка на КП с сайта MPU GROUP';

/* ------------------------------------------------------------------ helpers */

function respond($payload, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function is_post()
{
    return isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'POST';
}

function host_name()
{
    $host = isset($_SERVER['HTTP_HOST']) ? (string) $_SERVER['HTTP_HOST'] : '';
    $host = preg_replace('/[^A-Za-z0-9.\-]/', '', $host);
    if ($host === '' || stripos($host, 'localhost') !== false) {
        return 'mpugroup.ru';
    }
    return $host;
}

function sender_address()
{
    $from = trim(MAIL_FROM);
    if ($from !== '') {
        return $from;
    }
    $host = host_name();
    $parts = explode('.', $host);
    $root = count($parts) >= 2 ? $parts[count($parts) - 2] . '.' . $parts[count($parts) - 1] : $host;
    return 'no-reply@' . $root;
}

function clean_text($value, $max = MAX_FIELDS_LENGTH)
{
    if (!is_scalar($value)) {
        return '';
    }
    $value = str_replace(["\r\n", "\r", "\n"], ' ', (string) $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $value);
    $value = trim(strip_tags($value));
    if (function_exists('mb_strlen')) {
        if (mb_strlen($value, 'UTF-8') > $max) {
            $value = mb_substr($value, 0, $max, 'UTF-8');
        }
    } elseif (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function esc_html($value)
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function mime_subject($subject)
{
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function secure_random($length)
{
    // random_bytes() появился в PHP 7.0 — нужен запасной вариант
    if (function_exists('random_bytes')) {
        return random_bytes($length);
    }
    if (function_exists('openssl_random_pseudo_bytes')) {
        return openssl_random_pseudo_bytes($length);
    }
    $out = '';
    for ($i = 0; $i < $length; $i++) {
        $out .= chr(mt_rand(0, 255));
    }
    return $out;
}

function client_ip()
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    return preg_replace('/[^0-9a-fA-F:.]/', '', $ip) ?: 'unknown';
}

/* ------------------------------------------------------------------- CORS */

$origin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Accept, Content-Type');
    header('Access-Control-Max-Age: 600');
    header('Vary: Origin');
}
if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ------------------------------------------- проверка Origin (CSRF-защита) */
// Заявку может отправить только наш сайт: иначе любой сторонний домен
// мог бы слать письма через наш сервер (использование как relay).
$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
if ($requestOrigin !== '' && !in_array($requestOrigin, ALLOWED_ORIGINS, true)) {
    respond(array('ok' => false, 'error' => 'Запрос отклонён: недопустимый источник.'), 403);
}

/* ------------------------------------------------------------------ input */

if (!is_post()) {
    respond(['ok' => false, 'error' => 'Метод не поддерживается'], 405);
}

$contentType = isset($_SERVER['CONTENT_TYPE']) ? (string) $_SERVER['CONTENT_TYPE'] : '';
$raw         = file_get_contents('php://input');
$raw         = $raw === false ? '' : $raw;

if (strpos($contentType, 'multipart/form-data') !== false || !empty($_POST)) {
    $data  = $_POST;
    $files = $_FILES;
} else {
    $decoded = json_decode($raw, true);
    $data    = is_array($decoded) ? $decoded : [];
    $files  = [];
}

// rate limit: не чаще одной заявки в 15 секунд с одного IP
$rlFile = sys_get_temp_dir() . '/mpu_rl_' . md5(client_ip());
$rlLast = @file_get_contents($rlFile);
if ($rlLast !== false && (time() - (int) $rlLast) < 15) {
    respond(array('ok' => false, 'error' => 'Слишком часто. Подождите 15 секунд и попробуйте снова.'), 429);
}
@file_put_contents($rlFile, (string) time());

// Honeypot: поле скрыто от пользователя, но заполняется ботами.
$honeypot = clean_text(isset($data['website']) ? $data['website'] : '', 100);
if ($honeypot !== '') {
    respond(['ok' => true, 'message' => 'Заявка принята']); // тихо игнорируем спам
}

$company  = clean_text(isset($data['company']) ? $data['company'] : '');
$contact  = clean_text(isset($data['contact']) ? $data['contact'] : '');
$category = clean_text(isset($data['category']) ? $data['category'] : '', 200);
$comment  = clean_text(isset($data['comment']) ? $data['comment'] : '', 1000);
$pageUrl  = clean_text(isset($data['page']) ? $data['page'] : '', 300);

$errors = [];
if (mb_strlen($company, 'UTF-8') < 2) {
    $errors[] = 'Укажите компанию или контактное лицо.';
}
if (mb_strlen($contact, 'UTF-8') < 3) {
    $errors[] = 'Укажите телефон или e-mail для обратной связи.';
}
if ($errors) {
    respond(['ok' => false, 'error' => implode(' ', $errors)], 422);
}

// Файл ТЗ / спецификации
$attachment = null;
if (!empty($files['spec']) && is_array($files['spec']) && isset($files['spec']['error'])) {
    $file = $files['spec'];
    if ((int) $file['error'] === UPLOAD_ERR_OK && (int) $file['size'] > 0) {
        if ((int) $file['size'] > MAX_UPLOAD_BYTES) {
            respond(['ok' => false, 'error' => 'Файл слишком большой. Максимум 10 МБ.'], 422);
        }
        $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXTENSIONS, true)) {
            respond(['ok' => false, 'error' => 'Недопустимый тип файла. Разрешены: ' . implode(', ', ALLOWED_EXTENSIONS)], 422);
        }
        $content = @file_get_contents((string) $file['tmp_name']);
        if ($content === false) {
            error_log('MPU form: cannot read uploaded file');
            respond(['ok' => false, 'error' => 'Не удалось прочитать файл. Отправьте его на info@mpugroup.ru.'], 500);
        }
        $originalName = (string) $file['name'];
        $safeName = preg_replace('/[^\p{L}\p{N}._\- ]+/u', '_', $originalName);
        if (!is_string($safeName) || $safeName === '') {
            $safeName = preg_replace('/[^A-Za-z0-9._\- ]+/', '_', $originalName);
        }
        $safeName = trim((string) $safeName);
        if ($safeName === '') {
            $safeName = 'specification.' . $ext;
        }
        $asciiName = preg_replace('/[^A-Za-z0-9._\- ]+/', '_', $originalName);
        $asciiName = trim((string) $asciiName);
        if ($asciiName === '') {
            $asciiName = 'specification.' . $ext;
        }
        $mime = 'application/octet-stream';
        $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : false;
        if ($finfo) {
            $detected = finfo_file($finfo, (string) $file['tmp_name']);
            finfo_close($finfo);
            if (is_string($detected) && $detected !== '') {
                $mime = $detected;
            }
        }
        $attachment = [
            'name' => $safeName,
            'ascii' => $asciiName,
            'type' => $mime,
            'data' => $content,
        ];
    } elseif ((int) $file['error'] !== UPLOAD_ERR_NO_FILE) {
        respond(['ok' => false, 'error' => 'Ошибка загрузки файла (код ' . (int) $file['error'] . ').'], 422);
    }
}

/* ------------------------------------------------------------------- mail */

// Ответ на письмо всегда идёт на корпоративный ящик (no-reply@ — несуществующий адрес)
$replyTo = RECIPIENT_EMAIL;

$rows = [
    'Компания / контактное лицо' => $company,
    'Телефон / корпоративный e-mail' => $contact,
    'Категория продукции' => $category !== '' ? $category : '—',
    'Спецификация или ТЗ' => $attachment ? $attachment['name'] : 'не приложен',
];
if ($comment !== '') {
    $rows['Комментарий'] = $comment;
}
$rows['Страница отправки'] = $pageUrl !== '' ? $pageUrl : SITE_URL;
$rows['Дата и время'] = date('d.m.Y H:i:s');

$tableRows = '';
foreach ($rows as $label => $value) {
    $tableRows .= '<tr>'
        . '<td style="padding:6px 16px 6px 0;color:#5d5e63;font-size:14px;white-space:nowrap;vertical-align:top;">' . esc_html((string) $label) . '</td>'
        . '<td style="padding:6px 0;color:#191c1d;font-size:14px;font-weight:600;">' . esc_html((string) $value) . '</td>'
        . '</tr>';
}

$html = '<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"></head>'
    . '<body style="margin:0;padding:24px;background:#f3f4f5;font-family:Arial,Helvetica,sans-serif;">'
    . '<div style="max-width:640px;margin:0 auto;background:#ffffff;border-left:4px solid #e31e24;padding:24px;">'
    . '<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#e31e24;font-weight:700;">Новая заявка с сайта</div>'
    . '<h1 style="margin:8px 0 20px;font-size:22px;color:#191c1d;">' . esc_html(SITE_NAME) . ' — расчёт заявки</h1>'
    . '<table style="width:100%;border-collapse:collapse;">' . $tableRows . '</table>'
    . '<div style="margin-top:24px;font-size:13px;color:#5d5e63;">Ответ клиенту: ' . esc_html($contact) . '<br>'
    . 'Сайт: <a href="' . esc_html(SITE_URL) . '" style="color:#e31e24;">' . esc_html(SITE_URL) . '</a></div>'
    . ($attachment ? '<div style="margin-top:12px;font-size:13px;color:#5d5e63;">Файл во вложении: ' . esc_html($attachment['name']) . '</div>' : '')
    . '</div></body></html>';

$textBody = SITE_NAME . " — новая заявка\n\n";
foreach ($rows as $label => $value) {
    $textBody .= $label . ': ' . $value . "\n";
}
$textBody .= "\nПисьмо сформировано автоматически, отвечать можно прямо на " . $contact . "\n";

$subject = SUBJECT_PREFIX . ($category !== '' ? ' — ' . $category : '');
$from    = sender_address();

$headers = [
    'MIME-Version: 1.0',
    'From: ' . SITE_NAME . ' <' . $from . '>',
    'X-Mailer: MPU-GROUP-Form/1.0',
];
if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . $replyTo;
}
if (!empty($_SERVER['SERVER_NAME'])) {
    $headers[] = 'X-Mailer-Origin: ' . preg_replace('/[^A-Za-z0-9.\-]/', '', (string) $_SERVER['SERVER_NAME']);
}

$body = $textBody;
if ($attachment === null) {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
} else {
    $boundary = 'mpu_' . bin2hex(secure_random(12));
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
    $body = "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $textBody . "\r\n"
        . "--{$boundary}\r\n"
        . 'Content-Type: ' . $attachment['type'] . '; name="' . $attachment['ascii'] . '"' . "\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . 'Content-Disposition: attachment; filename="' . $attachment['ascii'] . '"; filename*=UTF-8\'\'' . rawurlencode($attachment['name']) . "\r\n\r\n"
        . chunk_split(base64_encode($attachment['data']), 76, "\r\n")
        . "\r\n--{$boundary}--";
}

$sent = @mail(RECIPIENT_EMAIL, mime_subject($subject), $body, implode("\r\n", $headers));
if (!$sent) {
    error_log('MPU form: mail() failed for ' . RECIPIENT_EMAIL . ' from ip ' . client_ip());
    respond(['ok' => false, 'error' => 'Не удалось отправить письмо. Напишите нам на ' . RECIPIENT_EMAIL . '.'], 500);
}

respond(['ok' => true, 'message' => 'Заявка отправлена на ' . RECIPIENT_EMAIL]);
