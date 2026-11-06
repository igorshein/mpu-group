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
import { categories } from './src/data/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');

/* ------------------------------------------------------------------ конфиг */
/* Опционально: node build.mjs --config=site.regru.json --out=docs-regru --api=api-regru
   (вторая версия сайта — для другого домена/хостинга; по умолчанию всё как раньше) */
const cliArgs = process.argv.slice(2);
const cliVal = name => {
  const hit = cliArgs.find(a => a === '--' + name || a.startsWith('--' + name + '='));
  if (!hit) return null;
  return hit.startsWith('--' + name + '=') ? hit.slice(name.length + 3) : true;
};
const cfgName = (cliVal('config') && cliVal('config') !== true) ? String(cliVal('config')) : 'site.json';
const OUT_NAME = (cliVal('out') && cliVal('out') !== true) ? String(cliVal('out')) : 'docs';
const API_DIR  = (cliVal('api') && cliVal('api') !== true) ? String(cliVal('api')) : 'api';
const OUT = path.join(__dirname, OUT_NAME);

const siteConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', cfgName), 'utf8'));
const SITE_URL = 'https://' + siteConfig.domain;
// публичный e-mail для шапки/футера/формы (может отличаться от адреса получателя заявок)
const contactEmail = siteConfig.contactEmail || siteConfig.recipientEmail;
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
        <text fill="${p.fill}" font-family="Montserrat" font-size="${p.fontSize}" font-weight="700" text-anchor="middle" x="${p.labelX}" y="${p.labelY}" class="hub-label${anchor}" data-kind="${p.kind}"${halo}>${esc(p.label)}</text>
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
html = html.replaceAll('{{CONTACT_EMAIL}}', contactEmail);
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
// favicon.svg пользователя — в корень сайта
copy(path.join(SRC, 'assets/favicon.svg'), path.join(OUT, 'favicon.svg'));
// в site.js подставляем контактный e-mail из конфига (плейсхолдер {{CONTACT_EMAIL}})
{
  const jsFrom = path.join(SRC, 'assets/js/site.js');
  if (fs.existsSync(jsFrom)) {
    const js = fs.readFileSync(jsFrom, 'utf8').replaceAll('{{CONTACT_EMAIL}}', contactEmail);
    fs.writeFileSync(path.join(OUT, 'assets/js/site.js'), js, 'utf8');
  }
}
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

/* ---------------------------------------------- 3b. страницы каталога */
/* Хаб /katalog/ + 8 страниц категорий /katalog/<slug>/. Шаблоны в src/pages/,
   данные — src/data/catalog.mjs (порядок 01–08 из «Позиции в карточках.docx»). */
const shellHtml = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8')
  .replaceAll('{{CONTACT_EMAIL}}', contactEmail);
const rawHeader = shellHtml.match(/<header[\s\S]*?<\/header>/)[0];
const rawFooter = shellHtml.match(/<footer[\s\S]*?<\/footer>/)[0];

// Общие маршруты шапки/футера для всех страниц, кроме лендинга.
// Пункты без собственных якорей на лендинге ведут в согласованное место.
const SHELL_ROUTES = {
  'glavnaya': '/',
  'katalog-produktsii': '/#katalog-produktsii',
  'skachat-prays-list': '/#katalog-produktsii',
  'zayavka-na-kp': '/#express-request',
  'politika-konfidentsialnosti': '/#kontakty',
  'kachestvo-i-sertifikaty': '/#o-kompanii'
};
function normalizeShell(fragment) {
  let s = fragment.replaceAll('assets/', '/assets/');
  s = s.replace(/data-path="([^"]*)"\s+href="#"/g, (m, dp) =>
    'data-path="' + dp + '" href="' + (SHELL_ROUTES[dp] || '/#' + dp) + '"');
  // прочие якоря → на лендинг
  s = s.replace(/href="#([a-z0-9-]+)"/g, 'href="/#$1"');
  return s;
}
const pageHeader = normalizeShell(rawHeader);
const pageFooter = normalizeShell(rawFooter);

const pageTpl = fs.readFileSync(path.join(SRC, 'pages/catalog-page.html'), 'utf8');

const pageRobots = siteConfig.allowIndexing ? '' : '<meta content="noindex, follow" name="robots"/>';
const jsonldEsc = s => esc(String(s));

function jsonldTag(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj) + '</script>';
}

function breadcrumbItems(items) {
  return items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    ...(it.url ? {item: it.url} : {})
  }));
}

const dom = (inner, p, k) => inner.split('{{' + p + '}}').join(k);

function fillPage(tpl, map) {
  // никакие вхождения не должны остаться неразрешёнными
  let h = tpl;
  for (const [k, v] of Object.entries(map)) h = dom(h, k, v == null ? '' : String(v));
  const left = h.match(/\{\{[A-Z_]+\}\}/g);
  if (left) console.warn('⚠ не заполнены плейсхолдеры:', left.join(', '));
  return h;
}

// карточки предыдущая/следующая категория
function angleLink(href, name, dir, align) {
  const icon = dir === 'back' ? 'arrow_back' : 'arrow_forward';
  const rel = dir === 'back' ? 'rel="prev"' : 'rel="next"';
  return `<a class="group bg-surface-container-low p-5 flex ${align === 'end' ? 'flex-col items-end text-right' : 'flex-col'} gap-2 hover:bg-surface-container transition-colors" href="${href}" ${rel}>

<span class="font-label-caps text-label-caps uppercase tracking-wider text-secondary ${align === 'end' ? 'flex-row-reverse' : ''} flex items-center gap-2"><span class="material-symbols-outlined text-base">${icon}</span><span>${dir === 'back' ? 'Назад' : 'Вперёд'}</span></span>
<span class="font-headline-sm text-headline-sm uppercase text-on-surface group-hover:text-primary-container break-words">${jsonldEsc(name)}</span>
</a>`;
}

const emptySlot = '<span class="block" aria-hidden="true"></span>';

const pageOutputs = [];

// --- 8 страниц категорий ---
categories.forEach((c, i) => {
  const catUrl = SITE_URL + '/katalog/' + c.slug + '/';
  const prev = i > 0 ? categories[i - 1] : null;
  const next = i < categories.length - 1 ? categories[i + 1] : null;
  const jsonld = jsonldTag({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: c.name,
    description: c.metaDescription,
    url: catUrl,
    isPartOf: SITE_URL + '/',
    primaryImageOfPage: {'@type': 'ImageObject', url: SITE_URL + '/' + c.imgSrc}
  }) + jsonldTag({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems([
      {name: 'Главная', url: SITE_URL + '/'},
      {name: c.name}
    ])
  });
  pageOutputs.push({
    relPath: 'katalog/' + c.slug + '/index.html',
    html: fillPage(pageTpl, {
      TITLE: c.metaTitle,
      DESCRIPTION: c.metaDescription,
      OG_TITLE: c.metaTitle,
      OG_DESCRIPTION: c.metaDescription,
      CANONICAL: catUrl,
      ROBOTS: pageRobots,
      JSONLD: jsonld,
      HEADER: pageHeader,
      FOOTER: pageFooter,
      NAME: jsonldEsc(c.shortName),
      NUM: c.num,
      IMG_ALT: jsonldEsc(c.imgAlt),
      IMG_SRC_ROOT: '/' + c.imgSrc,
      IMG_SRCSET_ROOT: c.imgSrcset.replaceAll('assets/', '/assets/'),
      EYEBROW: jsonldEsc(c.eyebrow),
      BADGE: jsonldEsc(c.badge),
      H1: jsonldEsc(c.name),
      INTRO: jsonldEsc(c.intro),
      BODY: c.body,
      CTA: jsonldEsc(c.ctaText),
      PREV_LINK: prev ? angleLink('/katalog/' + prev.slug + '/', prev.name, 'back', 'start') : emptySlot,
      NEXT_LINK: next ? angleLink('/katalog/' + next.slug + '/', next.name, 'fwd', 'end') : emptySlot
    }),
    loc: catUrl,
    priority: '0.8'
  });
});
console.log('✓ страницы каталога: ' + categories.length + ' категорий');

/* ------------------------------------------- 4a. PHP-обработчик формы */
const phpTpl = fs.readFileSync(path.join(SRC, 'api/send-request.php'), 'utf8');
const phpOut = phpTpl
  .replace('{{RECIPIENT}}', siteConfig.recipientEmail)
  .replace('{{SITE_URL}}', SITE_URL)
  .replace('{{DOMAIN}}', siteConfig.domain)
  .replace('{{MAIL_FROM}}', siteConfig.mailFrom)
  .replace('{{ALLOWED_ORIGINS}}', JSON.stringify(origins).replace(/"/g, "'"));
fs.mkdirSync(path.join(__dirname, API_DIR), {recursive: true});
fs.writeFileSync(path.join(__dirname, API_DIR, 'send-request.php'), phpOut, 'utf8');
console.log('✓ ' + API_DIR + '/send-request.php — домен', siteConfig.domain, '| получатель', siteConfig.recipientEmail);

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
let sitemap;
if (siteConfig.allowIndexing) {
  sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <url>\n    <loc>' + SITE_URL + '/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n' +
    pageOutputs.map(p =>
      '  <url>\n    <loc>' + p.loc + '</loc>\n    <changefreq>weekly</changefreq>\n    <priority>' + p.priority + '</priority>\n  </url>\n'
    ).join('') +
    '</urlset>\n';
} else {
  sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    '  <url>\n    <loc>' + SITE_URL + '/</loc>\n' +
    '  </url>\n' +
    '</urlset>\n';
}
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap, 'utf8');
console.log('✓ docs/sitemap.xml — URL: ' + (sitemap.match(/<loc>/g) || []).length);

/* ------------------------------------------------------ 5. сборка CSS */
try {
  const bin = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
  const cssOut = path.join(OUT, 'assets/css/site.css');
  execSync(`"${bin}" -i src/styles.css -o "${cssOut}" --minify`, {cwd: __dirname, stdio: 'inherit'});
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
  html = html.replace(/href="\/?assets\/css\/site\.css(\?v=[a-z0-9]+)?"/, 'href="assets/css/site.css?v=' + cssV + '"');
  html = html.replace(/src="\/?assets\/js\/site\.js(\?v=[a-z0-9]+)?"/, 'src="assets/js/site.js?v=' + jsV + '"');
  fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
  console.log('✓ docs/index.html записан — версии: css?v=' + cssV + ' js?v=' + jsV);

  // страницы каталога: те же версии + запись в /katalog/**/index.html
  pageOutputs.forEach(p => {
    let each = p.html
      .replace(/href="\/?assets\/css\/site\.css(\?v=[a-z0-9]+)?"/, 'href="/assets/css/site.css?v=' + cssV + '"')
      .replace(/src="\/?assets\/js\/site\.js(\?v=[a-z0-9]+)?"/, 'src="/assets/js/site.js?v=' + jsV + '"');
    const outPath = path.join(OUT, p.relPath);
    fs.mkdirSync(path.dirname(outPath), {recursive: true});
    fs.writeFileSync(outPath, each, 'utf8');
    console.log('✓ docs/' + p.relPath);
  });
} catch (e) {
  console.error('✗ не удалось записать docs/index.html:', e.message);
  process.exitCode = 1;
}
