// ЕДИНЫЙ ИСТОЧНИК ДАННЫХ КАРТЫ ЛОГИСТИКИ
// Генератор SVG и JSON для скриптов читает этот файл. Правьте только его.

export const MAP_VIEWBOX = { full: '0 0 760 340', mobile: '96 128 572 128' };

export const points = [
  {
    "id": "moscow",
    "kind": "hub",
    "label": "МОСКВА",
    "name": "Москва (Центральный хаб)",
    "address": "1-й Красногвардейский пр-д | 25 000 м² крытых площадей",
    "x": 120,
    "y": 190,
    "r": 7,
    "fill": "#E31E24",
    "labelX": 120,
    "labelY": 220,
    "fontSize": 12,
    "routes": [
      "main-route",
      "murmansk-route",
      "arkhangelsk-route",
      "naryanmar-route",
      "usinsk-route",
      "rostov-route",
      "volgograd-route"
    ]
  },
  {
    "id": "ekaterinburg",
    "kind": "hub",
    "label": "ЕКАТЕРИНБУРГ",
    "name": "Екатеринбург (Уральский хаб)",
    "address": "ул. Мамина-Сибиряка | Прямой доступ к заводам Урала",
    "x": 300,
    "y": 170,
    "r": 6,
    "fill": "#FFF",
    "labelX": 300,
    "labelY": 200,
    "fontSize": 12,
    "routes": [
      "main-route",
      "tyumen-route",
      "northern-route-1"
    ]
  },
  {
    "id": "novosibirsk",
    "kind": "hub",
    "label": "НОВОСИБИРСК",
    "name": "Новосибирск (Сибирский хаб)",
    "address": "ул. Станционная | Транзитный узел поставок в СФО | ВЭД-поставки из Китая",
    "x": 450,
    "y": 180,
    "r": 6,
    "fill": "#FFF",
    "labelX": 450,
    "labelY": 210,
    "fontSize": 12,
    "routes": [
      "main-route",
      "krasnoyarsk-route",
      "irkutsk-route",
      "northern-route-2",
      "china-novosibirsk-route"
    ]
  },
  {
    "id": "vladivostok",
    "kind": "hub",
    "label": "ВЛАДИВОСТОК",
    "name": "Владивосток (Дальневосточный хаб)",
    "address": "ул. Посьетская | Портовая перевалка и таможенный терминал | ВЭД-поставки из Китая",
    "x": 640,
    "y": 200,
    "r": 6,
    "fill": "#FFF",
    "labelX": 640,
    "labelY": 230,
    "fontSize": 12,
    "routes": [
      "main-route",
      "habarovsk-route",
      "magadan-route",
      "sakhalin-route",
      "china-vladivostok-route"
    ]
  },
  {
    "id": "yamal",
    "kind": "city",
    "label": "ЯМАЛ / САБЕТТА",
    "name": "ЯМАЛ / САБЕТТА",
    "address": "Северный морской путь | Автозимники",
    "x": 440,
    "y": 75,
    "r": 5,
    "fill": "#E31E24",
    "labelX": 440,
    "labelY": 60,
    "fontSize": 11,
    "routes": [
      "northern-route-1"
    ]
  },
  {
    "id": "yakutia",
    "kind": "city",
    "label": "ЯКУТИЯ / ЛЕНСК",
    "name": "ЯКУТИЯ / ЛЕНСК",
    "address": "Речная навигация Лены | Авиарейсы",
    "x": 590,
    "y": 85,
    "r": 5,
    "fill": "#E31E24",
    "labelX": 590,
    "labelY": 70,
    "fontSize": 11,
    "routes": [
      "northern-route-2",
      "neryungri-route"
    ]
  },
  {
    "id": "murmansk",
    "kind": "city",
    "label": "МУРМАНСК",
    "name": "МУРМАНСК",
    "address": "Мурманский порт | Автозимники | Круглогод",
    "x": 35,
    "y": 60,
    "r": 4,
    "fill": "#FFF",
    "labelX": 35,
    "labelY": 48,
    "fontSize": 9,
    "routes": [
      "murmansk-route"
    ]
  },
  {
    "id": "arkhangelsk",
    "kind": "city",
    "label": "АРХАНГЕЛЬСК",
    "name": "АРХАНГЕЛЬСК",
    "address": "Речной порт | Сплавные поставки | Лес и металл",
    "x": 100,
    "y": 88,
    "r": 4,
    "fill": "#FFF",
    "labelX": 100,
    "labelY": 103,
    "fontSize": 9,
    "routes": [
      "arkhangelsk-route"
    ]
  },
  {
    "id": "naryanmar",
    "kind": "city",
    "label": "НАРЬЯН-МАР",
    "name": "НАРЬЯН-МАР",
    "address": "Речной порт | Сезонная навигация по Печоре",
    "x": 155,
    "y": 58,
    "r": 4,
    "fill": "#FFF",
    "labelX": 155,
    "labelY": 46,
    "fontSize": 9,
    "routes": [
      "naryanmar-route"
    ]
  },
  {
    "id": "usinsk",
    "kind": "city",
    "label": "УСИНСК",
    "name": "УСИНСК",
    "address": "Нефтегазовый регион | Зимник | Трубы и арматура",
    "x": 210,
    "y": 50,
    "r": 4,
    "fill": "#FFF",
    "labelX": 210,
    "labelY": 38,
    "fontSize": 9,
    "routes": [
      "usinsk-route",
      "vorkuta-route"
    ]
  },
  {
    "id": "vorkuta",
    "kind": "city",
    "label": "ВОРКУТА",
    "name": "ВОРКУТА",
    "address": "Автозимник | Угольный регион | Вахта",
    "x": 268,
    "y": 40,
    "r": 4,
    "fill": "#FFF",
    "labelX": 268,
    "labelY": 55,
    "fontSize": 9,
    "routes": [
      "vorkuta-route",
      "norilsk-route"
    ]
  },
  {
    "id": "norilsk",
    "kind": "city",
    "label": "НОРИЛЬСК",
    "name": "НОРИЛЬСК",
    "address": "Транспортный узел | Мурманский порт | Металлургия",
    "x": 352,
    "y": 26,
    "r": 4,
    "fill": "#FFF",
    "labelX": 352,
    "labelY": 41,
    "fontSize": 9,
    "routes": [
      "norilsk-route"
    ]
  },
  {
    "id": "tyumen",
    "kind": "city",
    "label": "ТЮМЕНЬ",
    "name": "ТЮМЕНЬ",
    "address": "Нефтегазовый регион | Транзит в СФО и на Север",
    "x": 250,
    "y": 122,
    "r": 4,
    "fill": "#FFF",
    "labelX": 250,
    "labelY": 110,
    "fontSize": 9,
    "routes": [
      "tyumen-route",
      "surgut-route"
    ]
  },
  {
    "id": "surgut",
    "kind": "city",
    "label": "СУРГУТ",
    "name": "СУРГУТ",
    "address": "Южный Ямал | Зимник | Трубопроводные проекты",
    "x": 302,
    "y": 100,
    "r": 4,
    "fill": "#FFF",
    "labelX": 302,
    "labelY": 88,
    "fontSize": 9,
    "routes": [
      "surgut-route"
    ]
  },
  {
    "id": "krasnoyarsk",
    "kind": "city",
    "label": "КРАСНОЯРСК",
    "name": "КРАСНОЯРСК",
    "address": "Енисейский узел | Речная навигация | Финматериалы",
    "x": 530,
    "y": 148,
    "r": 4,
    "fill": "#FFF",
    "labelX": 530,
    "labelY": 163,
    "fontSize": 9,
    "routes": [
      "krasnoyarsk-route"
    ]
  },
  {
    "id": "irkutsk",
    "kind": "city",
    "label": "ИРКУТСК",
    "name": "ИРКУТСК",
    "address": "Байкальский узел | Ж/д спецрейсы | Энергетика",
    "x": 500,
    "y": 100,
    "r": 4,
    "fill": "#FFF",
    "labelX": 500,
    "labelY": 88,
    "fontSize": 9,
    "routes": [
      "irkutsk-route"
    ]
  },
  {
    "id": "neryungri",
    "kind": "city",
    "label": "НЕРЮНГРИ",
    "name": "НЕРЮНГРИ",
    "address": "Южная Якутия | Авиарейсы | Уголь и золото",
    "x": 570,
    "y": 118,
    "r": 4,
    "fill": "#FFF",
    "labelX": 570,
    "labelY": 133,
    "fontSize": 9,
    "routes": [
      "neryungri-route"
    ]
  },
  {
    "id": "habarovsk",
    "kind": "city",
    "label": "ХАБАРОВСК",
    "name": "ХАБАРОВСК",
    "address": "Приамурский узел | Транзит в ДФО и КНР",
    "x": 625,
    "y": 130,
    "r": 4,
    "fill": "#FFF",
    "labelX": 625,
    "labelY": 118,
    "fontSize": 9,
    "routes": [
      "habarovsk-route"
    ]
  },
  {
    "id": "magadan",
    "kind": "city",
    "label": "МАГАДАН",
    "name": "МАГАДАН",
    "address": "Колыма | Авиа и автозимник | Прииск",
    "x": 700,
    "y": 92,
    "r": 4,
    "fill": "#FFF",
    "labelX": 700,
    "labelY": 80,
    "fontSize": 9,
    "routes": [
      "magadan-route",
      "kamchatka-route"
    ]
  },
  {
    "id": "kamchatka",
    "kind": "city",
    "label": "КАМЧАТКА",
    "name": "КАМЧАТКА",
    "address": "Петропавловск-Камчатский | Авто и море",
    "x": 722,
    "y": 142,
    "r": 4,
    "fill": "#FFF",
    "labelX": 722,
    "labelY": 157,
    "fontSize": 9,
    "routes": [
      "kamchatka-route"
    ]
  },
  {
    "id": "sakhalin",
    "kind": "city",
    "label": "САХАЛИН",
    "name": "САХАЛИН",
    "address": "Южно-Сахалинск | Морские перевозки | Газодобыча",
    "x": 690,
    "y": 182,
    "r": 4,
    "fill": "#FFF",
    "labelX": 690,
    "labelY": 197,
    "fontSize": 9,
    "routes": [
      "sakhalin-route"
    ]
  },
  {
    "id": "rostov",
    "kind": "city",
    "label": "РОСТОВ-НА-ДОНУ",
    "name": "РОСТОВ-НА-ДОНУ",
    "address": "Южный хаб | Авто и ж/д | Агропром",
    "x": 95,
    "y": 240,
    "r": 4,
    "fill": "#FFF",
    "labelX": 95,
    "labelY": 255,
    "fontSize": 9,
    "routes": [
      "rostov-route"
    ]
  },
  {
    "id": "volgograd",
    "kind": "city",
    "label": "ВОЛГОГРАД",
    "name": "ВОЛГОГРАД",
    "address": "Волга | Зимник и авто | Нефтехимия",
    "x": 175,
    "y": 225,
    "r": 4,
    "fill": "#FFF",
    "labelX": 175,
    "labelY": 240,
    "fontSize": 9,
    "routes": [
      "volgograd-route",
      "makhachkala-route"
    ]
  },
  {
    "id": "makhachkala",
    "kind": "city",
    "label": "МАХАЧКАЛА",
    "name": "МАХАЧКАЛА",
    "address": "Кавказ | Авто и море | Стройматериалы",
    "x": 250,
    "y": 285,
    "r": 4,
    "fill": "#FFF",
    "labelX": 250,
    "labelY": 300,
    "fontSize": 9,
    "routes": [
      "makhachkala-route"
    ]
  },
  {
    "id": "melitopol",
    "kind": "city",
    "label": "МЕЛИТОПОЛЬ",
    "name": "МЕЛИТОПОЛЬ",
    "address": "Новые территории | Строительство и АПК",
    "x": 115,
    "y": 292,
    "r": 4,
    "fill": "#FFF",
    "labelX": 115,
    "labelY": 280,
    "fontSize": 9,
    "routes": [
      "melitopol-route"
    ]
  },
  {
    "id": "crimea",
    "kind": "city",
    "label": "КРЫМ / СИМФЕРОПОЛЬ",
    "name": "КРЫМ / СИМФЕРОПОЛЬ",
    "address": "Новые территории | Стройка и курорт",
    "x": 55,
    "y": 285,
    "r": 4,
    "fill": "#FFF",
    "labelX": 55,
    "labelY": 300,
    "fontSize": 9,
    "routes": [
      "crimea-route"
    ]
  },
  {
    "id": "mariupol",
    "kind": "city",
    "label": "МАРИУПОЛЬ",
    "name": "МАРИУПОЛЬ",
    "address": "Новые территории | Металлоконструкции и стройка",
    "x": 185,
    "y": 300,
    "r": 4,
    "fill": "#FFF",
    "labelX": 185,
    "labelY": 315,
    "fontSize": 9,
    "routes": [
      "mariupol-route"
    ]
  },
  {
    "id": "china",
    "kind": "import",
    "label": "КИТАЙ / ВЭД",
    "name": "КИТАЙ (ВЭД)",
    "address": "Импорт из Китая | Ж/д и море | ВЭД-поставки",
    "x": 650,
    "y": 300,
    "r": 6,
    "fill": "#E31E24",
    "labelX": 650,
    "labelY": 286,
    "fontSize": 10,
    "routes": [
      "china-vladivostok-route",
      "china-novosibirsk-route"
    ]
  }
];

export const routes = [
  {
    "id": "main-route",
    "d": "M 120 190 Q 240 135 300 170 T 450 180 T 640 200",
    "red": false,
    "arrow": false
  },
  {
    "id": "murmansk-route",
    "d": "M 120 190 Q 55 135 35 60",
    "red": true,
    "arrow": false
  },
  {
    "id": "arkhangelsk-route",
    "d": "M 120 190 Q 78 152 100 88",
    "red": true,
    "arrow": false
  },
  {
    "id": "naryanmar-route",
    "d": "M 120 190 Q 125 112 155 58",
    "red": true,
    "arrow": false
  },
  {
    "id": "usinsk-route",
    "d": "M 120 190 Q 155 102 210 50",
    "red": true,
    "arrow": false
  },
  {
    "id": "vorkuta-route",
    "d": "M 210 50 Q 235 38 268 40",
    "red": true,
    "arrow": false
  },
  {
    "id": "norilsk-route",
    "d": "M 268 40 Q 308 22 352 26",
    "red": true,
    "arrow": false
  },
  {
    "id": "tyumen-route",
    "d": "M 300 170 Q 270 145 250 122",
    "red": true,
    "arrow": false
  },
  {
    "id": "surgut-route",
    "d": "M 250 122 Q 276 105 302 100",
    "red": true,
    "arrow": false
  },
  {
    "id": "krasnoyarsk-route",
    "d": "M 450 180 Q 495 158 530 148",
    "red": true,
    "arrow": false
  },
  {
    "id": "irkutsk-route",
    "d": "M 450 180 Q 468 130 500 100",
    "red": true,
    "arrow": false
  },
  {
    "id": "northern-route-1",
    "d": "M 300 170 Q 360 90 440 75",
    "red": true,
    "arrow": false
  },
  {
    "id": "northern-route-2",
    "d": "M 450 180 Q 510 120 590 85",
    "red": true,
    "arrow": false
  },
  {
    "id": "neryungri-route",
    "d": "M 590 85 Q 585 100 570 118",
    "red": true,
    "arrow": false
  },
  {
    "id": "habarovsk-route",
    "d": "M 640 200 Q 622 160 625 130",
    "red": true,
    "arrow": false
  },
  {
    "id": "magadan-route",
    "d": "M 640 200 Q 675 145 700 92",
    "red": true,
    "arrow": false
  },
  {
    "id": "kamchatka-route",
    "d": "M 700 92 Q 724 112 722 142",
    "red": true,
    "arrow": false
  },
  {
    "id": "sakhalin-route",
    "d": "M 640 200 Q 668 188 690 182",
    "red": true,
    "arrow": false
  },
  {
    "id": "rostov-route",
    "d": "M 120 190 Q 95 210 95 240",
    "red": true,
    "arrow": false
  },
  {
    "id": "volgograd-route",
    "d": "M 120 190 Q 145 205 175 225",
    "red": true,
    "arrow": false
  },
  {
    "id": "makhachkala-route",
    "d": "M 175 225 Q 235 250 250 285",
    "red": true,
    "arrow": false
  },
  {
    "id": "melitopol-route",
    "d": "M 95 240 Q 100 265 115 292",
    "red": true,
    "arrow": false
  },
  {
    "id": "crimea-route",
    "d": "M 95 240 Q 60 258 55 285",
    "red": true,
    "arrow": false
  },
  {
    "id": "mariupol-route",
    "d": "M 115 292 Q 150 300 185 300",
    "red": true,
    "arrow": false
  },
  {
    "id": "china-vladivostok-route",
    "d": "M 650 292 Q 636 245 640 206",
    "red": true,
    "arrow": false
  },
  {
    "id": "china-novosibirsk-route",
    "d": "M 650 292 Q 545 270 458 190",
    "red": true,
    "arrow": false
  }
];
