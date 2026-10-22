# MPU GROUP — сайт промышленного снабжения

Статический лендинг + обработчик формы на PHP. Сборка через Tailwind CLI, без фреймворков.

---

## Структура репозитория

```
/src                     исходники (единственный источник правок)
  index.html             шаблон страницы ({{MAP_SVG}} подставляется сборщиком)
  styles.css             Tailwind + свои стили, @font-face, keyframes
  data/map.mjs           точки/маршруты/хабы карты логистики (единый источник)
  assets/js/site.js      бургер-меню, карта, форма
  assets/img, fonts      (сюда кладутся новые картинки/шрифты)
/docs                    собранный сайт → публикуется на GitHub Pages
/api/send-request.php    обработчик заявки (PHP, отправляет на info@mpugroup.ru) — генерируется из src/api/ по config/site.json
/config/site.json        домен, e-mail получателя, MAIL_FROM, разрешённые origins, индексация
/build.mjs               сборщик
/tailwind.config.js      конфигурация Tailwind (цвета, размеры, шрифты)
/scripts/dev-server.mjs  локальный предпросмотр
/scripts/package.mjs     сборка zip-архива для загрузки на хостинг
```

## Команды

```bash
npm install            # один раз: ставит tailwindcss
npm run build          # сборка: src → docs (CSS + HTML + копирование ассетов)
npm run dev            # сборка + локальный сервер http://127.0.0.1:8099
npm run css            # только пересборка CSS (быстро, в watch-режиме: npm run watch:css)
npm run package        # собрать zip-архив для загрузки на хостинг (mpu-group-site.zip)
npm run deploy         # сборка + commit + push в master (Pages пересоберётся сам)
```

## Как править

1. Правим **только** `src/`. Файлы в `docs/` — сборка, их не трогаем руками.
2. Карта логистики: точки, маршруты и подписи — в `src/data/map.mjs`. Сборщик сам
   генерирует SVG и JSON для скриптов, дублировать ничего не нужно.
3. После правок: `npm run build` → проверить `npm run dev` → `npm run deploy`.

---

## Размещение на GitHub Pages

- Источник: ветка `master`, путь `/docs`.
- Сборка запускается вручную (`npm run deploy`) — Pages просто раздаёт готовые файлы.
- `docs/robots.txt` закрывает сайт от индексации: пока сайт живёт на `igorshein.github.io`,
  основной домен — `mpu-group.ru`. **При переносе на свой хостинг файл `docs/robots.txt`
  нужно удалить** (или заменить на `Allow: /`), иначе поисковики не проиндексируют сайт.

## Перенос на свой хостинг (с PHP)

### Что загрузить на сервер

```
docs/            → корень сайта (index.html, assets/, favicon.svg)
api/             → в корень сайта (обработчик формы)
```

### Требования к хостингу

- PHP 7.4+ (проверено на 8.3), расширение `mail()` должно быть доступно (уточните у хостера,
  либо замените `mail()` на SMTP-отправку через PHPMailer).
- Для отправки писем хостеру нужен рабочий почтовый сервер (вход SMTP/IMAP).

### Настройки обработчика `api/send-request.php`

| Константа | Значение | Комментарий |
|---|---|---|
| `RECIPIENT_EMAIL` | `info@mpugroup.ru` | куда уходит заявка |
| `MAIL_FROM` | `no-reply@<ваш-домен>` | **обязательно задать**: адрес должен совпадать с доменом, иначе письма уйдут в спам (SPF/DMARC) |
| `SITE_URL` | `https://<ваш-домен>` | используется в письме и в `canonical` |
| `ALLOWED_ORIGINS` | `['https://<ваш-домен>', ...]` | список доменов, с которых разрешён кросс-доменный POST |
| `MAX_UPLOAD_BYTES` | 10 МБ | максимум для файла ТЗ |

### nginx

```nginx
server {
    listen 443 ssl http2;
    server_name mpu-group.ru;
    root /var/www/mpu-group;
    index index.html;

    # PHP-обработчик формы
    location ^~ /api/ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        client_max_body_size 12M;   # чуть больше лимита скрипта
    }

    # отдаём PHP как текст, а не как исполняемый файл (безопасность)
    location ~ \.php$ { return 404; }

    # кэш статики
    location ~* \.(css|js|woff2|webp|png|jpg|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

### Apache (.htaccess в корне сайта)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  # примерно: /api/send-request.php → обработчик
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^api/ index.php [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

<FilesMatch "\.(css|js|woff2|webp|png|jpg|svg)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# закрыть php-файлы от прямого доступа (кроме /api/)
<Files "send-request.php">
  Require all granted
</Files>
```

### Безопасность формы (рекомендации)

- Ограничьте частоту запросов (rate limit) на уровне nginx/Apache или в самом скрипте.
- Скрипт уже проверяет: honeypot-поле, белый список расширений, лимит размера, тип MIME,
  санитизацию всех полей, CORS по списку доменов.
- Если скрипт лежит вне webroot — поправьте путь в `SCRIPT_FILENAME` и в JS (`api/send-request.php`).

---

## Проверка качества (Lighthouse)

```bash
npm run dev                       # в отдельном терминале
# затем в Chrome: http://127.0.0.1:8099 → DevTools → Lighthouse
```

Текущие показатели (мобильная версия): Accessibility 100, Best Practices 100,
SEO 100 (после удаления `docs/robots.txt`), LCP ~170 мс, CLS 0.

---

## GitHub Pages: переключение источника

Источник уже настроен на `master:/docs`. Если нужно поменять:

```bash
gh api -X PUT repos/igorshein/mpu-group/pages -f "source[branch]=master" -f "source[path]=/docs"
```

---

# Перенос на Beget (ispmanager)

## Что нужно от владельца

1. **Домен** (например `mpu-group.ru`) — уже есть.
2. **Доступ в панель Beget** — https://panel.beget.com (логин + пароль) либо FTP-доступ
   (хост `ftp.beget.com`, логин = пользователь Beget, пароль = пароль панели).
3. **IP-адрес сервера Beget** для домена — показывается в панели («Сайты» → «Управление DNS»
   или в разделе «Домены и зоны»). Нужен, чтобы прописать A-запись.
4. **Подтверждение, что почта на домене работает** (нужен ящик вида `no-reply@<домен>` или
   `info@<домен>` — именно с домена, иначе письма уйдут в спам).

## Порядок переноса

### 1. Настроить домен (DNS)

В панели Beget: «Домены и зоны» → ваш домен → NS-записи. Обычно нужно делегировать домен
на серверы Beget (`ns1.beget.com`, `ns2.beget.com`, `ns3.beget.com`) либо поставить A-запись
на IP Beget (если NS делегировать не хотите). Полное обновление DNS — от 1 часа до 24 часов.

### 2. Создать сайт и выбрать версию PHP

«Сайты» → «Добавить сайт» → указать домен → в свойствах сайта выбрать **PHP 7.4 или 8.x**
и «Версия сайта: статическая» не нужна — index.html подхватится автоматически.

### 3. Загрузить файлы

```bash
npm run build && npm run package
```

Дальше один из двух вариантов:

**Вариант A — через панель (проще):**
1. «Файлы» → «Менеджер файлов» → перейти в каталог домена (`~/<домен>/`).
2. Загрузить `mpu-group-site.zip` → распаковать прямо в этом каталоге.
3. Убедиться, что `index.html` лежит в корне каталога сайта, а `api/send-request.php` — рядом с ним.

**Вариант B — по FTP/SFTP:**
```bash
# архив уже собран: mpu-group-site.zip
# содержимое распаковывается в ~/<домен>/
```

### 4. Проверить PHP-обработчик

В панели: «Сайты» → «Управление PHP» → убедиться, что PHP включён (иначе .php отдаётся как текст).
Проверка: `https://<домен>/api/send-request.php` должен вернуть JSON `{"ok":false,"error":"Метод не поддерживается"}`
(значит PHP исполняется). Если вернулся исходный код — PHP не включён или не тот каталог.

Тест отправки: `curl -X POST https://<домен>/api/send-request.php -H 'Content-Type: application/json' -d '{"company":"Тест","contact":"test@example.ru","category":"Металлопрокат"}'`
В норме: `{"ok":true,"message":"Заявка отправлена на info@mpugroup.ru"}`.

### 5. Включить HTTPS

В панели Beget: «Сайты» → ваш сайт → «SSL-сертификаты» → выпустить бесплатный
Let's Encrypt (для домена и www). После выпуска включите принудительный редирект на HTTPS.

### 6. Прописать домен в конфиг и пересобрать

`config/site.json`:
```json
{
  "domain": "ваш-домен.ru",
  "wwwDomain": "www.ваш-домен.ru",
  "recipientEmail": "info@mpugroup.ru",
  "mailFrom": "no-reply@ваш-домен.ru",
  "extraOrigins": ["https://igorshein.github.io"],
  "allowIndexing": true
}
```
Затем `npm run build && npm run package` и перезалить архив. Сборщик сам подставит домен
в `canonical`, `og:url`, в обработчик PHP (SITE_URL, ALLOWED_ORIGINS, MAIL_FROM) и снимет
`robots.txt` с запретом индексации, когда `allowIndexing: true`.

### 7. Если `mail()` не отправляет

Beget обычно разрешает `mail()`, но письма уходят через локальный MTA. Если письма не доходят —
переходите на SMTP: положите рядом с обработчиком PHPMailer и замените вызов `mail()` на
`$mailer->send()`. Параметры SMTP (хост, порт, логин, пароль) берутся в панели
«Почтовая программа» → «Аккаунты». Заготовка:

```php
// вместо mail(...)
// require __DIR__ . '/PHPMailer/src/Exception.php'; ...
// $mail = new PHPMailer(true);
// $mail->isSMTP(); $mail->Host = 'smtp.beget.com'; $mail->SMTPAuth = true;
// $mail->Username = 'no-reply@ваш-домен.ru'; $mail->Password = 'пароль';
// $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; $mail->Port = 587;
// $mail->setFrom('no-reply@ваш-домен.ru', 'MPU GROUP');
// $mail->addAddress(RECIPIENT_EMAIL); $mail->Subject = $subject; $mail->Body = $textBody;
// $mail->send();
```

### 8. Чек-лист после переноса

- [ ] `https://<домен>/` открывается (не http)
- [ ] `http://<домен>/` редиректит на https
- [ ] `/api/send-request.php` отдаёт JSON, а не исходный код
- [ ] тестовый POST возвращает `ok:true` и письмо приходит на info@mpugroup.ru
- [ ] на мобильном (390px) нет горизонтальной прокрутки, карта показывает 4 хаба
- [ ] в консоли браузера нет ошибок 404 (F12 → Network)
- [ ] `robots.txt` на основном домене разрешает индексацию
- [ ] в `canonical` и `og:url` — ваш домен (после пересборки с новым config)

---
