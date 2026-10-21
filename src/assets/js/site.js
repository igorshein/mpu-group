/* MPU GROUP — клиентские скрипты
   Собирается в docs/assets/js/site.js
   1. Бургер-меню (шапка)
   2. Интерактивная карта логистики
   3. Форма экспресс-запроса
*/
(function(){
  // Данные карты генерируются из src/data/map.js сборщиком (см. build.mjs)
  const hubPayload = JSON.parse(document.getElementById('hub-data').textContent);
  const hubData = hubPayload.hubs;
  const mapViewbox = hubPayload.viewbox;

  const map = document.getElementById('hub-map');
  const isMobileMap = () => window.matchMedia('(max-width: 639px)').matches;
  function applyMapViewbox() {
    if (!map) return;
    map.setAttribute('viewBox', isMobileMap() ? mapViewbox.mobile : mapViewbox.full);
  }
  applyMapViewbox();
  window.addEventListener('resize', applyMapViewbox);

  const hubItems = document.querySelectorAll('.hub-item');
  const hubPoints = document.querySelectorAll('.hub-point');
  const routePaths = Array.prototype.slice.call(document.querySelectorAll('#hub-map path[data-route]'));
  const activeName = document.getElementById('hub-active-name');
  const activeDesc = document.getElementById('hub-active-desc');

  const defaultFill = {};
  const defaultLabelFill = {};
  hubPoints.forEach(point => {
    const circle = point.querySelector('.hub-circle');
    const label = point.querySelector('.hub-label');
    if (circle) defaultFill[point.dataset.hub] = circle.getAttribute('fill');
    if (label) defaultLabelFill[point.dataset.hub] = label.getAttribute('fill');
  });

  function setActiveHub(hubId) {
    const data = hubData[hubId] || null;

    hubItems.forEach(item => {
      const isActive = item.dataset.hub === hubId;
      item.classList.toggle('active', isActive);
      item.classList.toggle('border-primary-container', isActive);
      item.classList.toggle('border-surface-container', !isActive);
      item.classList.toggle('bg-surface/10', isActive);
      item.classList.toggle('bg-surface/5', !isActive);
      const marker = item.querySelector('.hub-marker');
      if (marker) {
        marker.classList.toggle('bg-primary-container', isActive);
        marker.classList.toggle('text-on-primary-container', isActive);
        marker.classList.toggle('bg-surface-container', !isActive);
        marker.classList.toggle('text-on-surface', !isActive);
      }
      const arrow = item.querySelector('.material-symbols-outlined:last-child');
      if (arrow) {
        arrow.classList.toggle('text-primary-container', isActive);
        arrow.classList.toggle('text-surface-dim', !isActive);
      }
    });

    hubPoints.forEach(point => {
      const isActive = point.dataset.hub === hubId;
      point.classList.toggle('active', isActive);
      const circle = point.querySelector('.hub-circle');
      const pulse = point.querySelector('.hub-pulse');
      const label = point.querySelector('.hub-label');
      if (circle) circle.setAttribute('fill', isActive ? '#E31E24' : (defaultFill[point.dataset.hub] || '#FFF'));
      if (pulse) pulse.style.display = isActive ? 'block' : 'none';
      if (label) label.setAttribute('fill', isActive ? '#FFF' : (defaultLabelFill[point.dataset.hub] || '#FFF'));
    });

    const activeRoutes = (data && data.routes) || [];
    routePaths.forEach(route => {
      const isActive = activeRoutes.indexOf(route.id) !== -1;
      route.classList.toggle('active-route', isActive);
      route.style.opacity = isActive ? '1' : '0.2';
      route.style.strokeWidth = isActive ? '3' : (route.getAttribute('data-route').indexOf('main') === 0 ? '2' : '1.6');
    });

    if (activeName) activeName.textContent = data ? data.name : 'Регион';
    if (activeDesc) activeDesc.textContent = data ? data.address : '';
  }

  // в порядке табуляции оставляем только хабы (4 шт.) — 28 городов перегружали бы клавиатуру
  const focusableHubs = {};
  hubItems.forEach(function (item) { focusableHubs[item.dataset.hub] = true; });

  function bind(el, isHub) {
    el.addEventListener('click', function () { setActiveHub(el.dataset.hub); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveHub(el.dataset.hub); }
    });
    el.setAttribute('tabindex', isHub ? '0' : '-1');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', el.classList.contains('active'));
    // у карточек списка имя = видимый текст, у точек SVG подставляем подпись
    if (!el.classList.contains('hub-item')) {
      el.setAttribute('aria-label', (hubData[el.dataset.hub] || {}).name || el.dataset.hub);
    }
  }

  Array.prototype.forEach.call(hubItems, function (el) { bind(el, true); });
  Array.prototype.forEach.call(hubPoints, function (el) { bind(el, !!focusableHubs[el.dataset.hub]); });

  setActiveHub('moscow');
})();

/* ------------------------------------------- */

(function () {
  var b = document.querySelector('header button[aria-label="Меню"]');
  var m = document.getElementById('mobile-menu');
  if (!b || !m) return;

  function setMenu(open) {
    if (open) { m.removeAttribute('hidden'); } else { m.setAttribute('hidden', ''); }
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    var icon = b.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = open ? 'close' : 'menu';
  }

  b.addEventListener('click', function () { setMenu(m.hasAttribute('hidden')); });

  // закрытие по клику по ссылке
  m.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !m.hasAttribute('hidden')) { setMenu(false); b.focus(); }
  });

  // закрытие по клику вне меню
  document.addEventListener('click', function (e) {
    if (m.hasAttribute('hidden')) return;
    if (m.contains(e.target) || b.contains(e.target)) return;
    setMenu(false);
  });

  // при переходе на большой экран меню закрывается
  var wide = window.matchMedia('(min-width: 1536px)');
  var onWide = function (e) { if (e.matches) setMenu(false); };
  if (wide.addEventListener) { wide.addEventListener('change', onWide); }
  else if (wide.addListener) { wide.addListener(onWide); }
})();

/* ------------------------------------------- */

(function(){
  var EMAIL = 'info@mpugroup.ru';
  var PHP_ENDPOINT = 'api/send-request.php';
  var form = document.getElementById('rfq-form');
  if(!form) return;
  var agree = document.getElementById('nda-agree');
  var submit = document.getElementById('rfq-submit');
  var feedback = document.getElementById('hero-feedback');
  var feedbackText = document.getElementById('hero-feedback-text');
  var specInput = document.getElementById('rfq-spec');
  var specName = document.getElementById('rfq-spec-name');
  var val = function(name){ var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; };
  function syncSubmit(){ if(submit) submit.disabled = !agree.checked; }
  function showFeedback(text){ if(feedback) feedback.classList.remove('hidden'); if(feedbackText) feedbackText.textContent = text; }
  function mailtoFallback(data){
    var subject = 'Заявка на КП с сайта MPU GROUP — ' + (data.category || 'без категории');
    var body = 'Компания / контактное лицо: ' + data.company + '\n' +
               'Телефон / корпоративный e-mail: ' + data.contact + '\n' +
               'Категория продукции: ' + (data.category || '—') + '\n' +
               'Спецификация или ТЗ: ' + data.spec + '\n\n' +
               'Заявка отправлена с сайта mpu-group.ru';
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  agree.addEventListener('change', syncSubmit);
  syncSubmit();
  if(specInput && specName){
    specInput.addEventListener('change', function(){
      var f = specInput.files && specInput.files[0];
      specName.textContent = f ? f.name : 'Прикрепить файл (PDF, XLS, DWG)';
    });
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!agree.checked){ if(submit) submit.focus(); return; }
    var file = (specInput && specInput.files && specInput.files[0]) ? specInput.files[0] : null;
    var data = {
      company: val('company'),
      contact: val('contact'),
      category: val('category'),
      spec: file ? file.name : 'не приложен'
    };
    if(submit) submit.disabled = true;
    var fd = new FormData();
    fd.append('company', data.company);
    fd.append('contact', data.contact);
    fd.append('category', data.category);
    fd.append('page', window.location.href);
    fd.append('website', '');
    if(file) fd.append('spec', file);
    fetch(PHP_ENDPOINT, {method:'POST', body: fd, headers:{'Accept':'application/json'}, credentials:'same-origin'})
      .then(function(r){ if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(json){
        syncSubmit();
        if(json && json.ok){
          showFeedback('Заявка отправлена на ' + EMAIL + '. Ответим в течение 15 минут.');
        } else {
          showFeedback('Заявка сформирована. Открываем почтовый клиент для отправки на ' + EMAIL + '.');
          mailtoFallback(data);
        }
      })
      .catch(function(){
        syncSubmit();
        showFeedback('Заявка сформирована. Открываем почтовый клиент для отправки на ' + EMAIL + '.');
        mailtoFallback(data);
      });
  });
})();
