/**
 * Подготовка архива для загрузки на хостинг (Beget и др.):
 *   mpu-group-site.zip
 *     ├── index.html, assets/, favicon.svg ...   (содержимое docs/)
 *     └── api/send-request.php
 *
 * Запуск: npm run package
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
const ZIP = path.join(ROOT, 'mpu-group-site.zip');

if (!fs.existsSync(path.join(ROOT, 'docs/index.html'))) {
  console.error('Сначала соберите сайт: npm run build');
  process.exit(1);
}

// чистим staging
fs.rmSync(OUT, {recursive: true, force: true});
fs.mkdirSync(OUT, {recursive: true});

// 1. содержимое docs/ → корень сайта
fs.cpSync(path.join(ROOT, 'docs'), OUT, {recursive: true});
// robots.txt на основном хостинге не нужен (в нём Disallow) — убираем, он генерируется под GitHub Pages
const robots = path.join(OUT, 'robots.txt');
if (fs.existsSync(robots)) fs.rmSync(robots);

// 1b. .htaccess (редиректы, кэш, заголовки безопасности)
const htaccess = path.join(ROOT, '.htaccess');
if (fs.existsSync(htaccess)) {
  fs.copyFileSync(htaccess, path.join(OUT, '.htaccess'));
  console.log('✓ .htaccess добавлен в корень сайта');
}

// 2. api/ рядом
fs.cpSync(path.join(ROOT, 'api'), path.join(OUT, 'api'), {recursive: true});

console.log('staging:');
const walk = (dir, prefix = '') => {
  fs.readdirSync(dir, {withFileTypes: true}).forEach(e => {
    if (e.isDirectory()) walk(path.join(dir, e.name), prefix + e.name + '/');
    else console.log('  ' + prefix + e.name);
  });
};
walk(OUT);

// 3. zip (PowerShell Compress-Archive — на Windows без внешних зависимостей)
fs.rmSync(ZIP, {force: true});
execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${OUT}\\*' -DestinationPath '${ZIP}' -Force"`, {stdio: 'inherit'});

const size = fs.statSync(ZIP).size;
console.log(`\n✓ ${path.basename(ZIP)} — ${(size / 1024 / 1024).toFixed(2)} МБ`);
console.log('Загрузите архив в панели Beget: Файлы → Менеджер файлов → загрузить в ~/mpu-group.ru/ (или корень сайта) и распаковать.');
console.log('Папка api/ должна оказаться рядом с index.html — тогда обработчик будет доступен по /api/send-request.php');
