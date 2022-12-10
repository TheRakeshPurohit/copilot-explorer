Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.contextualFilterCharacterMap =
  exports.contextualFilterLanguageMap =
  exports.contextualFilterWeights =
  exports.contextualFilterIntercept =
  exports.contextualFilterAcceptThreshold =
    undefined;
exports.contextualFilterAcceptThreshold = 15;
exports.contextualFilterIntercept = -0.3043572714994554;
exports.contextualFilterWeights = [
  0.9978708359643611, 0.7001905605239328, -0.1736749244124868,
  -0.22994157947320112, 0.13406692641682572, -0.007751370662011853,
  0.0057783222035240715, 0.41910878254476003, -0.1621657125711092,
  0.13770814958908187, -0.06036011308184006, -0.07351180985800129, 0,
  -0.05584878151248109, 0.30618794079412015, -0.1282197982598485,
  0.10951859303997555, 0.1700461782788777, -0.3346057842644757,
  0.22497985923128136, 0, -0.44038101825774356, -0.6540115939236782,
  0.16595600081341702, 0.20733910722385135, -0.1337033766105696,
  -0.06923072125290894, -0.05806684191976292, 0.3583334671633344,
  -0.47357732824944315, 0.17810871365594377, 0.42268219963946685, 0, 0,
  -0.16379620467004602, -0.43893868831061167, 0, 0.11570094006709251,
  0.9326431262654882, -0.9990110509203912, -0.44125275652726503,
  -0.15840786997162004, -0.4600396256644451, -0.018814811994044403,
  0.09230944537175266, 0.025814790934742798, -1.0940162204190154,
  -0.9407503631235489, -0.9854303778694269, -1.1045822488262245,
  -1.1417299456573262, -1.5623704405345513, -0.4157473855795939,
  -1.0244257735561713, -0.7477401944601753, -1.1275109699068402,
  -0.0714715633552533, -1.1408628006786907, -1.0409898655074672,
  -0.2288889836518878, -0.5469549893760344, -0.181946611106845,
  0.1264329316374918, 0, 0, 0.312206968554707, -0.3656436392517924,
  0.23655650686038968, 0.1014912419901576, 0, 0.06287549221765308, 0, 0,
  0.19027065218932154, -0.8519502045974378, 0, 0.23753599905971923,
  0.2488809322489166, 0.019969251907983224, 0, 0.06916505526229488,
  0.29053356359188204, -0.14484456555431657, 0.014768129429370188,
  -0.15051464926341374, 0.07614835502776021, -0.3317489901313935, 0, 0,
  0.04921938684669103, -0.28248576768353445, -0.9708816204525345,
  -1.3560464522265527, 0.014165375212383239, -0.23924166472544983,
  0.10006595730248855, 0.09867233147279562, 0.32330430333220644,
  -0.058625706114180595, 0.17149853105783947, 0.4436484054395367,
  0.047189049576707255, 0.16832520944790552, 0.1117259900942179,
  -0.35469010329927253, 0, -0.1528189124465582, -0.3804848349564939,
  0.07278077320753953, 0.13263786480064088, 0.22920682659292527,
  1.1512955314336537, 0, 0.016939862282340023, 0.4242994650403408,
  0.12759835577444986, -0.5577261135825583, -0.19764560943067672,
  -0.4042102444736004, 0.12063461617733708, -0.2933966817484834,
  0.2715683893968593, 0, -0.7138548251238751, 0, -0.023066228703035277, 0,
  -0.06383043976746139, 0.09683723720709651, -0.7337151424080791, 0,
  -0.27191370124625525, 0.2819781269656171, -0.08711496549050252,
  0.11048604909969338, -0.0934849550450534, 0.0721001250772912,
  0.2589126797890794, 0.6729582659532254, -0.21921032738244908,
  -0.21535277468651456, -0.45474006124091354, -0.05861820126419139,
  -0.007875306207720204, -0.056661261678809284, 0.17727881404222662,
  0.23603713348534658, 0.17485861412377932, -0.5737483768696752,
  -0.38220029570342745, -0.5202722985519168, -0.37187947527657256,
  0.47155277792990113, -0.12077912346691123, 0.47825628981545326,
  0.4736704404000214, -0.1615218651546898, 0.18362447973513005, 0, 0,
  -0.18183417425866824, 0, 0, -0.2538532305733833, -0.1303692690676528,
  -0.4073577969188216, 0.04172985870928789, -0.1704527388573901, 0, 0,
  0.7536858953385828, -0.44703159588787644, 0, -0.7246484085580873,
  -0.21378128540782063, 0, 0.037461090552656146, -0.16205852364367032,
  -0.10973952064404884, 0.017468043407647377, -0.1288980387397392, 0, 0, 0,
  -1.218692715379445, 0.05536949662193305, -0.3763799844799116,
  -0.1845001725624579, -0.1615576298149558, 0, -0.15373262203249874,
  -0.04603412604270418, 0, -0.3068149681460828, 0.09412352468269412, 0,
  0.09116543650609721, 0.06065865264082559, 0.05688267379386188,
  -0.05873945477722306, 0, 0.14532465133322153, 0.1870857769705463,
  0.36304258043185555, 0.1411392422180405, 0.0630388629716367, 0,
  -1.1170522012450395, 0.16133697772771127, 0.15908534390781448,
  -0.23485453704002232, -0.1419980841417892, 0.21909510179526218,
  0.39948420260153766, 0.40802294284289187, 0.15403767653746853, 0,
  0.19764784115096676, 0.584914157527457, 0, -0.4573883817015294,
];
exports.contextualFilterLanguageMap = {
  javascript: 1,
  typescript: 2,
  typescriptreact: 3,
  python: 4,
  vue: 5,
  php: 6,
  dart: 7,
  javascriptreact: 8,
  go: 9,
  css: 10,
  cpp: 11,
  html: 12,
  scss: 13,
  markdown: 14,
  csharp: 15,
  java: 16,
  json: 17,
  rust: 18,
  ruby: 19,
  c: 20,
};
exports.contextualFilterCharacterMap = {
  " ": 1,
  "!": 2,
  '"': 3,
  "#": 4,
  $: 5,
  "%": 6,
  "&": 7,
  "'": 8,
  "(": 9,
  ")": 10,
  "*": 11,
  "+": 12,
  ",": 13,
  "-": 14,
  ".": 15,
  "/": 16,
  0: 17,
  1: 18,
  2: 19,
  3: 20,
  4: 21,
  5: 22,
  6: 23,
  7: 24,
  8: 25,
  9: 26,
  ":": 27,
  ";": 28,
  "<": 29,
  "=": 30,
  ">": 31,
  "?": 32,
  "@": 33,
  A: 34,
  B: 35,
  C: 36,
  D: 37,
  E: 38,
  F: 39,
  G: 40,
  H: 41,
  I: 42,
  J: 43,
  K: 44,
  L: 45,
  M: 46,
  N: 47,
  O: 48,
  P: 49,
  Q: 50,
  R: 51,
  S: 52,
  T: 53,
  U: 54,
  V: 55,
  W: 56,
  X: 57,
  Y: 58,
  Z: 59,
  "[": 60,
  "\\": 61,
  "]": 62,
  "^": 63,
  _: 64,
  "`": 65,
  a: 66,
  b: 67,
  c: 68,
  d: 69,
  e: 70,
  f: 71,
  g: 72,
  h: 73,
  i: 74,
  j: 75,
  k: 76,
  l: 77,
  m: 78,
  n: 79,
  o: 80,
  p: 81,
  q: 82,
  r: 83,
  s: 84,
  t: 85,
  u: 86,
  v: 87,
  w: 88,
  x: 89,
  y: 90,
  z: 91,
  "{": 92,
  "|": 93,
  "}": 94,
  "~": 95,
};