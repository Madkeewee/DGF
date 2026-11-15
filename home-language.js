"use strict";

const keys = [
  "language", "welcome", "season", "seasonNote", "tips", "tipsNote",
  "calculators", "calculatorsNote", "planner", "plannerNote", "footer", "top", "skip"
];

const translations = {
  en: ["Language", "Season updates, game tips, and battle planning for DGF members.", "Season", "Season 8: Dinosaur Era", "Tips", "Alliance and gameplay tips", "Calculators", "Plan resources and upgrades", "Planner", "Black Gold Battlefield roster and map", "Unofficial Dark War: Survival community guide", "Back to top", "Skip to content"],
  es: ["Idioma", "Novedades de temporada, consejos y planificación de batallas para DGF.", "Temporada", "Temporada 8: Era de los dinosaurios", "Consejos", "Consejos para la alianza y el juego", "Calculadoras", "Planifica recursos y mejoras", "Planificador", "Lista de jugadores y mapa de Black Gold Battlefield", "Guía comunitaria no oficial de Dark War: Survival", "Volver arriba", "Ir al contenido"],
  pt: ["Idioma", "Novidades da temporada, dicas e planejamento de batalhas para a DGF.", "Temporada", "Temporada 8: Era dos dinossauros", "Dicas", "Dicas para a aliança e para o jogo", "Calculadoras", "Planeje recursos e melhorias", "Planejador", "Lista de jogadores e mapa de Black Gold Battlefield", "Guia comunitário não oficial de Dark War: Survival", "Voltar ao topo", "Ir para o conteúdo"],
  fr: ["Langue", "Infos de saison, astuces et préparation des combats pour les membres de DGF.", "Saison", "Saison 8 : Ère des dinosaures", "Astuces", "Conseils pour l’alliance et le jeu", "Calculateurs", "Planifiez vos ressources et améliorations", "Planificateur", "Liste des joueurs et carte de Black Gold Battlefield", "Guide communautaire non officiel de Dark War: Survival", "Retour en haut", "Aller au contenu"],
  de: ["Sprache", "Saisoninfos, Spieltipps und Schlachtplanung für DGF-Mitglieder.", "Saison", "Saison 8: Zeitalter der Dinosaurier", "Tipps", "Tipps für Allianz und Spiel", "Rechner", "Ressourcen und Upgrades planen", "Planer", "Spielerliste und Karte für Black Gold Battlefield", "Inoffizieller Community-Guide zu Dark War: Survival", "Nach oben", "Zum Inhalt"],
  ru: ["Язык", "Новости сезона, игровые советы и планы сражений для участников DGF.", "Сезон", "Сезон 8: Эра динозавров", "Советы", "Советы по игре и альянсу", "Калькуляторы", "Расчёт ресурсов и улучшений", "Планировщик", "Состав команды и карта Black Gold Battlefield", "Неофициальный гайд сообщества Dark War: Survival", "Наверх", "К содержанию"],
  ar: ["اللغة", "أخبار الموسم ونصائح اللعب وخطط المعارك لأعضاء DGF.", "الموسم", "الموسم الثامن: عصر الديناصورات", "نصائح", "نصائح للتحالف واللعب", "الحاسبات", "خطط للموارد والترقيات", "المخطط", "قائمة اللاعبين وخريطة Black Gold Battlefield", "دليل غير رسمي من مجتمع Dark War: Survival", "العودة إلى الأعلى", "انتقل إلى المحتوى"],
  id: ["Bahasa", "Kabar musim, tips bermain, dan rencana pertempuran untuk anggota DGF.", "Musim", "Musim 8: Era Dinosaurus", "Tips", "Tips aliansi dan permainan", "Kalkulator", "Rencanakan sumber daya dan peningkatan", "Perencana", "Daftar pemain dan peta Black Gold Battlefield", "Panduan komunitas tidak resmi Dark War: Survival", "Kembali ke atas", "Langsung ke konten"],
  ko: ["언어", "DGF 멤버를 위한 시즌 소식, 게임 팁, 전투 계획입니다.", "시즌", "시즌 8: 공룡 시대", "팁", "연맹 및 게임 플레이 팁", "계산기", "자원과 업그레이드 계획", "플래너", "Black Gold Battlefield 참가 명단 및 지도", "Dark War: Survival 비공식 커뮤니티 가이드", "맨 위로", "본문으로 건너뛰기"],
  ja: ["言語", "DGFメンバー向けのシーズン情報、攻略のヒント、作戦計画。", "シーズン", "シーズン8：恐竜時代", "ヒント", "同盟とゲーム攻略のヒント", "計算ツール", "資源とアップグレードを計画", "作戦プランナー", "Black Gold Battlefieldの参加者とマップ", "Dark War: Survival 非公式コミュニティガイド", "ページの先頭へ", "本文へ移動"],
  "zh-Hans": ["语言", "为 DGF 成员提供赛季资讯、游戏技巧和作战计划。", "赛季", "第 8 赛季：恐龙时代", "技巧", "联盟与游戏技巧", "计算器", "规划资源和升级", "作战计划", "Black Gold Battlefield 阵容与地图", "Dark War: Survival 非官方社区指南", "返回顶部", "跳转到正文"],
  th: ["ภาษา", "ข่าวประจำฤดูกาล เคล็ดลับ และแผนการรบสำหรับสมาชิก DGF", "ฤดูกาล", "ฤดูกาล 8: ยุคไดโนเสาร์", "เคล็ดลับ", "เคล็ดลับสำหรับพันธมิตรและการเล่น", "เครื่องคำนวณ", "วางแผนทรัพยากรและการอัปเกรด", "วางแผนการรบ", "รายชื่อผู้เล่นและแผนที่ Black Gold Battlefield", "คู่มือชุมชน Dark War: Survival ฉบับไม่เป็นทางการ", "กลับด้านบน", "ข้ามไปยังเนื้อหา"],
  vi: ["Ngôn ngữ", "Tin mùa giải, mẹo chơi và kế hoạch chiến đấu cho thành viên DGF.", "Mùa giải", "Mùa 8: Kỷ nguyên khủng long", "Mẹo chơi", "Mẹo cho liên minh và cách chơi", "Công cụ tính", "Lên kế hoạch tài nguyên và nâng cấp", "Kế hoạch", "Danh sách người chơi và bản đồ Black Gold Battlefield", "Hướng dẫn cộng đồng không chính thức cho Dark War: Survival", "Về đầu trang", "Chuyển đến nội dung"],
  tr: ["Dil", "DGF üyeleri için sezon haberleri, oyun ipuçları ve savaş planları.", "Sezon", "8. Sezon: Dinozor Çağı", "İpuçları", "İttifak ve oyun ipuçları", "Hesaplayıcılar", "Kaynakları ve yükseltmeleri planla", "Planlayıcı", "Black Gold Battlefield oyuncu listesi ve haritası", "Resmî olmayan Dark War: Survival topluluk rehberi", "Başa dön", "İçeriğe geç"]
};

const select = document.querySelector("#home-language");
const copy = document.querySelectorAll("[data-copy]");
const storageKey = "dgf-home-language";

function showLanguage(language) {
  const strings = Object.fromEntries(keys.map((key, i) => [key, translations[language][i]]));
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  select.value = language;
  copy.forEach(node => { node.textContent = strings[node.dataset.copy]; });
}

function browserLanguage() {
  for (const locale of navigator.languages ?? [navigator.language]) {
    const base = locale?.split("-")[0].toLowerCase();
    const supported = base === "zh" ? "zh-Hans" : base;
    if (Object.hasOwn(translations, supported)) return supported;
  }
  return "en";
}

let initialLanguage = browserLanguage();
try {
  const saved = localStorage.getItem(storageKey);
  if (Object.hasOwn(translations, saved)) initialLanguage = saved;
} catch {
  // The selector works without browser storage.
}
showLanguage(initialLanguage);
select.addEventListener("change", () => {
  showLanguage(select.value);
  try { localStorage.setItem(storageKey, select.value); } catch {}
});
