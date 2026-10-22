/**
 * Сборщик сайта MPU GROUP
 *  1. Генерирует SVG карты логистики из src/data/map.js (единый источник данных)
 *  2. Подставляет SVG и JSON-данные в шаблон src/index.html
 *  3. Собирает CSS через Tailwind CLI
 *  4. Копирует статику (шрифты/картинки) в docs/
 *
 * Запуск: npm run build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import crypto from 'crypto';

import { points, routes, MAP_VIEWBOX } from './src/data/map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'docs');

/* ------------------------------------------------------------------ конфиг */
const siteConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/site.json'), 'utf8'));
const SITE_URL = 'https://' + siteConfig.domain;
const origins = [
  'https://' + siteConfig.domain,
  'https://' + siteConfig.wwwDomain,
  ...(siteConfig.extraOrigins || [])
];

const HUBS = ['moscow', 'ekaterinburg', 'novosibirsk', 'vladivostok'];
const isRegion = p => p.kind !== 'hub';

/* ---------------------------------------------- 1. генерация SVG карты */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const routeMarkup = routes.map(r => {
  const stroke = r.red ? '#E31E24' : 'currentColor';
  const dash = r.red ? '6 3' : '4 4';
  const width = r.red ? 1.8 : 2;
  const marker = r.arrow ? ' marker-end="url(#mpu-arrow)"' : '';
  const region = r.id === 'main-route' ? '' : ' is-region';
  return `      <path d="${r.d}" stroke="${stroke}" stroke-dasharray="${dash}" stroke-width="${width}" opacity="0.35"${marker} data-route="${r.id}" id="${r.id}" class="hub-route${region}"></path>`;
}).join('\n');

const pointMarkup = points.map(p => {
  const active = p.id === 'moscow' ? ' active' : '';
  const region = isRegion(p) ? ' is-region' : '';
  const halo = p.fontSize <= 9 ? ' stroke="#2E3132" stroke-width="2.4" paint-order="stroke"' : '';
  const anchor = p.id === 'vladivostok' ? ' hub-label--end' : '';
  return `      <g class="hub-point${active}${region}" data-hub="${p.id}" style="cursor: pointer;">
        <circle class="hub-pulse" cx="${p.x}" cy="${p.y}" r="${p.r + 7}" fill="none" stroke="#E31E24" stroke-width="1.2" opacity="0" style="display:none"></circle>
        <circle cx="${p.x}" cy="${p.y}" fill="${p.fill}" r="${p.r}" class="hub-circle"></circle>
        <text fill="${p.fill}" font-family="Montserrat" font-size="${p.fontSize}" font-weight="700" text-anchor="middle" x="${p.labelX}" y="${p.labelY}" class="hub-label${anchor}"${halo}>${esc(p.label)}</text>
      </g>`;
}).join('\n');

const svg = `<svg class="w-full h-full text-surface-dim/40" fill="none" viewBox="${MAP_VIEWBOX.full}" id="hub-map" role="img" aria-label="Карта распределительной сети: четыре хаба (Москва, Екатеринбург, Новосибирск, Владивосток), 26 маршрутов, поставки из Китая">
      <defs>
        <marker id="mpu-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#E31E24"></path>
        </marker>
      </defs>
      <!-- Маршруты: магистраль, региональные ветки, импорт из Китая -->
${routeMarkup}
      <!-- Точки: хабы, регионы, города -->
${pointMarkup}
    </svg>`;

/* ------------------------------------------- 2. данные для клиентских JS */
const hubData = {};
points.forEach(p => { hubData[p.id] = {name: p.name, address: p.address, routes: p.routes}; });

/* --------------------------------------------------- 3. сборка шаблона */
let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');

// домен и канонический URL берём из config/site.json
html = html.replace(/https:\/\/mpu-group\.ru\//g, SITE_URL + '/');
html = html.replace(/<meta content="noindex, follow" name="robots"\/>/, siteConfig.allowIndexing ? '' : '<meta content="noindex, follow" name="robots"/>');

if (!html.includes('<!--MAP_SVG-->')) throw new Error('в шаблоне нет плейсхолдера <!--MAP_SVG-->');
html = html.replace('<!--MAP_SVG-->', svg);
html = html.replace(/<!--SCRIPT_PLACEHOLDER-->\s*/g, '');

const dataScript = `<script type="application/json" id="hub-data">${JSON.stringify({viewbox: MAP_VIEWBOX, hubs: hubData})}</script>`;
html = html.replace('</body>', `${dataScript}\n</body>`);

fs.mkdirSync(path.join(OUT, 'assets/css'), {recursive: true});
console.log(`✓ собран HTML — ${(html.length / 1024).toFixed(1)} КБ, точек карты: ${points.length}, маршрутов: ${routes.length}`);

/* --------------------------------------------- 4. копирование статики */
const copy = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.cpSync(from, to, {recursive: true});
};
copy(path.join(SRC, 'assets/fonts'), path.join(OUT, 'assets/fonts'));
copy(path.join(SRC, 'assets/img'), path.join(OUT, 'assets/img'));
copy(path.join(SRC, 'assets/js'), path.join(OUT, 'assets/js'));
console.log('✓ статика (шрифты, картинки, скрипты) на месте');

/* ------------------------------- 4a. cache-busting: версия ассетов в URL */
/* CDN GitHub Pages кэширует файлы надолго — без смены query параметра
   браузер продолжит отдавать старый CSS/JS. Добавляем хеш содержимого. */
function versionOf(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
}
const cssFile = path.join(OUT, 'assets/css/site.css');
const jsFile = path.join(OUT, 'assets/js/site.js');
const cssV = fs.existsSync(cssFile) ? versionOf(cssFile) : 'dev';
const jsV = fs.existsSync(jsFile) ? versionOf(jsFile) : 'dev';

/* ------------------------------------------- 4a. PHP-обработчик формы */
const phpTpl = fs.readFileSync(path.join(SRC, 'api/send-request.php'), 'utf8');
const phpOut = phpTpl
  .replace('{{RECIPIENT}}', siteConfig.recipientEmail)
  .replace('{{SITE_URL}}', SITE_URL)
  .replace('{{DOMAIN}}', siteConfig.domain)
  .replace('{{MAIL_FROM}}', siteConfig.mailFrom)
  .replace('{{ALLOWED_ORIGINS}}', JSON.stringify(origins).replace(/"/g, "'"));
fs.mkdirSync(path.join(__dirname, 'api'), {recursive: true});
fs.writeFileSync(path.join(__dirname, 'api/send-request.php'), phpOut, 'utf8');
console.log('✓ api/send-request.php — домен', siteConfig.domain, '| получатель', siteConfig.recipientEmail);

/* --------------------------------------------- 4b. robots.txt (временный хостинг) */
// На GitHub Pages сайт не должен индексироваться (основной домен — mpu-group.ru).
// При переносе на свой хостинг удалите этот файл или замените на Allow.
if (siteConfig.allowIndexing) {
  fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + '/sitemap.xml\n', 'utf8');
  console.log('✓ docs/robots.txt — индексация разрешена');
} else {
  fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n', 'utf8');
  console.log('✓ docs/robots.txt — закрыт от индексации (временный хостинг)');
}

/* --------------------------------------------------------- 4c. sitemap.xml */
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  '  <url>\n    <loc>' + SITE_URL + '/</loc>\n' +
  '    <changefreq>weekly</changefreq>\n' +
  '    <priority>1.0</priority>\n' +
  '  </url>\n' +
  '</urlset>\n';
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap, 'utf8');
console.log('✓ docs/sitemap.xml');

/* ------------------------------------------------------ 5. сборка CSS */
try {
  const bin = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
  execSync(`"${bin}" -i src/styles.css -o docs/assets/css/site.css --minify`, {cwd: __dirname, stdio: 'inherit'});
  const size = fs.statSync(path.join(OUT, 'assets/css/site.css')).size;
  console.log(`✓ docs/assets/css/site.css — ${(size / 1024).toFixed(1)} КБ`);
} catch (e) {
  console.error('✗ не удалось собрать CSS (запустите npm install)', e.message);
  process.exitCode = 1;
}

/* --------------------- 6. cache-busting: проставляем версии и записываем HTML */
try {
  const cssFile = path.join(OUT, 'assets/css/site.css');
  const jsFile = path.join(OUT, 'assets/js/site.js');
  const hash = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
  const cssV = fs.existsSync(cssFile) ? hash(cssFile) : 'dev';
  const jsV = fs.existsSync(jsFile) ? hash(jsFile) : 'dev';
  html = html.replace(/href="assets\/css\/site\.css(\?v=[a-z0-9]+)?"/, 'href="assets/css/site.css?v=' + cssV + '"');
  html = html.replace(/src="assets\/js\/site\.js(\?v=[a-z0-9]+)?"/, 'src="assets/js/site.js?v=' + jsV + '"');
  fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
  console.log('✓ docs/index.html записан — версии: css?v=' + cssV + ' js?v=' + jsV);
} catch (e) {
  console.error('✗ не удалось записать docs/index.html:', e.message);
  process.exitCode = 1;
}
