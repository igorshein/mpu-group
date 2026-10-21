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
/api/send-request.php    обработчик заявки (PHP, отправляет на info@mpugroup.ru)
/build.mjs               сборщик
/tailwind.config.js      конфигурация Tailwind (цвета, размеры, шрифты)
/scripts/dev-server.mjs  локальный предпросмотр
```

## Команды

```bash
npm install            # один раз: ставит tailwindcss
npm run build          # сборка: src → docs (CSS + HTML + копирование ассетов)
npm run dev            # сборка + локальный сервер http://127.0.0.1:8099
npm run css            # только пересборка CSS (быстро, в watch-режиме: npm run watch:css)
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
