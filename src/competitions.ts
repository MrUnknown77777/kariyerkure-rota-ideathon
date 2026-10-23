import type { Opportunity } from "./model";

const base = {
  kind: "yarisma",
  minGrade: 8,
  maxGrade: 12,
  hours: 1,
  cost: 0,
  access: "her",
  experienceRequired: false,
  demo: false,
  verifiedAt: "2026-10-22",
  accent: "purple",
} as const;
export const competitions: Opportunity[] = [
  {
    ...base,
    id: "technovation",
    title: "Technovation Challenge",
    provider: "Technovation",
    organization: "technovation",
    fields: ["teknoloji", "tasarim", "isletme"],
    competitionStatus: "open",
    feeStatus: "free",
    description:
      "Toplumundaki bir sorun için dijital çözüm geliştir. İlk adım, güncel yaş/ekip kategorisini incelemek ve çözmek istediğin problemi seçmek.",
    deadline: "2027-03-12",
    deadlineTime: "02:59",
    deadlineNote:
      "Kayıt: 11 Mart 2027 23:59 UTC → Türkiye 12 Mart 02:59. Teslim tarihi ayrıdır.",
    eventDate: "2027-05-06",
    eventLabel: "Proje teslimi",
    deadlineSource: "https://technovationchallenge.org/submission-guidelines/",
    source: {
      label: "Resmî 2026–27 yarışma takvimi",
      url: "https://technovationchallenge.org/competition/",
    },
    eligibilityNote:
      "8–18 yaş; ekip, yaş bölümü, veli onayı ve track koşulları resmî kaynaktan kontrol edilmeli. Türkiye’den katılım, uygun koşullarla mümkündür.",
    feeNote:
      "Program, müfredat ve yarışmaya gönderim ücretsiz. Cihaz, internet ve olası seyahat giderleri ayrıca değerlendirilir.",
    outcome:
      "Bir problem tanımı, uygun ekip kategorisi ve ilk çözüm fikri. Bunlar yarışmanın tamamlanması değildir.",
    steps: [
      "2027 yaş, ekip ve veli onayı koşullarını kontrol et.",
      "Gerçek bir kullanıcı problemi için iki görüşme sorusu yaz.",
      "Çözüm fikrini ve ekipte ihtiyaç duyduğun rolleri belirle.",
    ],
    roles: ["Kodlama", "Tasarım", "Araştırma", "Sunum"],
  },
  {
    ...base,
    id: "diamond-challenge",
    title: "Diamond Challenge",
    provider: "University of Delaware · Horn Entrepreneurship",
    organization: "diamond",
    fields: ["isletme", "sosyal", "teknoloji"],
    competitionStatus: "open",
    feeStatus: "unknown",
    description:
      "Bir iş fikrini veya sosyal girişimi araştır, gerekçelendir ve sun. Fikir, ekip ve danışman koşullarını inceleyerek başla.",
    deadline: "2027-01-15",
    deadlineTime: "01:00",
    deadlineNote:
      "Resmî teslim: 14 Ocak 2027 17.00 EST → Türkiye 15 Ocak 01.00.",
    deadlineSource: "https://horn.udel.edu/participant-toolkit-2627",
    source: {
      label: "Resmî yarışma kuralları",
      url: "https://diamondchallenge.org/competition/",
    },
    eligibilityNote:
      "14–18 yaş arası 2–4 lise öğrencisi ve 21+ yetişkin danışman; son tarihte yaş ve katılım koşullarını doğrula.",
    feeNote:
      "Ücretsiz eğitim kaynakları var. Güncel başvuru, etkinlik ve seyahat giderlerini ayrıca doğrula; bu kayıtta ücret uygunluğu kesinleştirilmedi.",
    outcome:
      "İş/sosyal girişim alanı seçilmiş bir problem özeti ve ekip ihtiyaçları.",
    steps: [
      "Güncel yarışma kurallarını ve 2026–27 teslim takvimini oku.",
      "Bir problem, hedef kitle ve çözüm varsayımı yaz.",
      "Ekip ve yetişkin danışman gereksinimini kontrol et.",
    ],
    roles: ["Araştırma", "İş modeli", "Sunum"],
  },
  {
    ...base,
    id: "conrad-challenge",
    title: "Conrad Challenge",
    provider: "Space Center Houston",
    organization: "conrad",
    fields: ["teknoloji", "doga", "saglik", "isletme"],
    competitionStatus: "open",
    feeStatus: "paid",
    cost: 499,
    description:
      "Bilim ve teknolojiyi bir ihtiyaca yönelik yenilik fikrine dönüştür. İlk aşama ile ücretli Innovation Stage’in koşullarını ayrı incele.",
    deadline: "2026-10-30",
    deadlineTime: "07:59",
    deadlineNote:
      "Activation sonu: 29 Ekim 2026 23:59 CT → Türkiye 30 Ekim 07:59. Innovation teslimi 7 Ocak 2027 CT.",
    deadlineSource: "https://conrad.spacecenter.org/the-challenge/",
    source: {
      label: "Resmî yarışma aşamaları ve takvimi",
      url: "https://conrad.spacecenter.org/the-challenge/",
    },
    eligibilityNote:
      "13–18 yaş, 2–5 kişilik ekip ve koç; ülke, yaş ve güncel aşama koşullarını kontrol et.",
    feeNote:
      "Innovation Stage: takım başına 499 USD; mali destek seçeneği var. Seyahat ayrı olabilir. Ücretsiz tercihiyle otomatik eşleşmez.",
    outcome:
      "Uygun kategori, aşama koşulları ve bir yenilik fikri için Lean Canvas taslağı.",
    steps: [
      "Yaş, ekip ve aşama takvimini resmî öğrenci rehberinden doğrula.",
      "Ücret ve mali destek kararını öğretmenin/velinle değerlendir.",
      "Sorun, çözüm ve hedef kullanıcıyı bir sayfada özetle.",
    ],
    roles: ["Araştırma", "Tasarım", "İş modeli"],
  },
  {
    ...base,
    id: "teknofest-insanlik",
    title: "TEKNOFEST · İnsanlık Yararına Teknolojiler",
    provider: "TEKNOFEST · Lise seviyesi",
    organization: "teknofest",
    fields: ["teknoloji", "tasarim", "saglik", "sosyal"],
    competitionStatus: "watch",
    feeStatus: "unknown",
    description:
      "Akıllı sistemler, sağlık veya eğitim için teknoloji fikrini geliştir. Görünen 2026 başvurusu bitmiştir; yeni çağrı için hazırlık ve takip yapabilirsin.",
    source: {
      label: "Resmî lise yarışması ve dönem bilgisi",
      url: "https://www.teknofest.org/tr/yarismalar/insanlik-yararina-teknolojiler-yarismasi-lise-seviyesi/",
    },
    eligibilityNote:
      "Lise seviyesi ve takım koşulları yeni şartnameden doğrulanmalı. 2027 başvurusu açık olarak işaretlenmedi.",
    outcome:
      "Bir problem ve proje fikri; yeni çağrı için kontrol hatırlatması.",
    steps: [
      "Geçmiş şartnameyi incele; yeni dönemin yayımlanıp yayımlanmadığını kontrol et.",
      "Bir problem ve teknik çözüm fikri belirle.",
      "Danışmanına ve ekip arkadaşlarına soracağın üç soruyu yaz.",
    ],
    roles: ["Kodlama", "Tasarım", "Sunum"],
  },
  {
    ...base,
    id: "teknofest-biyoteknoloji",
    title: "TEKNOFEST · Biyoteknoloji İnovasyon",
    provider: "TEKNOFEST",
    organization: "teknofest",
    fields: ["saglik", "doga", "teknoloji"],
    competitionStatus: "watch",
    feeStatus: "unknown",
    description:
      "Biyolojik sistemlere dayalı bir yenilik fikrini araştır. Yeni dönem tarihini uydurmadan, lise kategorisi ve danışman gereksinimiyle başla.",
    source: {
      label: "Resmî biyoteknoloji yarışması",
      url: "https://www.teknofest.org/tr/yarismalar/biyoteknoloji-inovasyon-yarismasi/",
    },
    eligibilityNote:
      "Resmî sayfada yaş ve eğitim kategorileri var. Yeni dönem lise kategorisi, güvenlik ve danışman koşullarını doğrula; deney güvenlik onayı olmadan uygulama yapma.",
    outcome:
      "Güvenli bir literatür sorusu ve danışmanla değerlendirilecek fikir.",
    steps: [
      "Lise kategorisini ve yeni dönem durumunu incele.",
      "Deney yapmadan, güvenilir kaynaklardan bir biyoteknoloji problemi araştır.",
      "Güvenlik ve uygulanabilirliği danışman öğretmeninle görüş.",
    ],
    roles: ["Araştırma", "Veri", "Sunum"],
  },
  {
    ...base,
    id: "tubitak-kutup",
    title: "TÜBİTAK 2204-C · Kutup Araştırmaları",
    provider: "TÜBİTAK · TEKNOFEST",
    organization: "tubitak",
    fields: ["doga", "teknoloji", "sosyal"],
    competitionStatus: "watch",
    feeStatus: "unknown",
    description:
      "Kutup bilimleriyle ilgili canlı, fizik, yer veya sosyal bilimler sorusunu araştır. Güncel çağrıyı resmî kaynaktan izlemeye al.",
    source: {
      label: "Resmî 2204-C programı",
      url: "https://tubitak.gov.tr/tr/yarismalar/2204-c-lise-ogrencileri-kutup-arastirma-projeleri-yarismasi",
    },
    eligibilityNote:
      "Lise öğrencilerine yönelik; fikir aşamasının başvuru için yeterli olduğunu varsayma. Güncel şartname ve bitmiş proje gereksinimini kontrol et.",
    outcome: "Kaynaklı bir araştırma sorusu ve proje kapsamı taslağı.",
    steps: [
      "Güncel çağrı ve alanları resmî program sayfasında kontrol et.",
      "Bir kutup araştırması sorusu ve iki güvenilir kaynak belirle.",
      "Projenin veri, yöntem ve danışman gereksinimini yaz.",
    ],
    roles: ["Araştırma", "Veri", "Yazı"],
  },
  {
    ...base,
    id: "tubitak-iklim",
    title: "TÜBİTAK 2204-D · İklim Değişikliği",
    provider: "TÜBİTAK · TEKNOFEST",
    organization: "tubitak",
    fields: ["doga", "teknoloji", "sosyal"],
    competitionStatus: "watch",
    feeStatus: "unknown",
    description:
      "İklimle ilgili bir araştırma sorusunu veri ve yöntemle ele al. Yeni çağrı doğrulanmadan son tarih veya açık başvuru iddiası gösterilmez.",
    source: {
      label: "Resmî iklim yarışması bilgisi",
      url: "https://www.teknofest.org/tr/yarismalar/insanlik-yararina-teknolojiler-yarismasi-lise-seviyesi/",
    },
    eligibilityNote:
      "Kaynak, iklim projeleri için 2204-D’ye yönlendirir. Güncel 2204-D şartnamesini ayrıca doğrula.",
    outcome:
      "Bir iklim sorusu, veri kaynağı ve öğretmenle değerlendirilecek yöntem fikri.",
    steps: [
      "2204-D güncel çağrısını TÜBİTAK/TEKNOFEST üzerinden kontrol et.",
      "Yerel bir iklim sorusu için açık veri kaynağı bul.",
      "İddia, yöntem ve sınırlılıkları bir sayfada yaz.",
    ],
    roles: ["Araştırma", "Veri", "Sunum"],
  },
  {
    ...base,
    id: "kanguru-matematik",
    organization: "kanguru",
    title: "Kanguru Matematik Türkiye",
    provider: "Kanguru Matematik Türkiye",
    fields: ["teknoloji", "doga"],
    competitionStatus: "open",
    feeStatus: "unknown",
    description:
      "Yaratıcı problem çözmeyi yarışma sorularıyla dene. Okul veya bireysel katılım yolunu ve ücretini doğrula.",
    deadline: "2026-12-31",
    eventDate: "2027-03-27",
    deadlineNote:
      "2026–27 sezonu: kayıt sonu 31 Aralık 2026; sınav 27 Mart 2027. Güncel merkez ve koşulları kontrol et.",
    deadlineSource: "https://www.kanguru-tr.com/",
    source: {
      label: "Resmî Türkiye temsilcisi ve takvim",
      url: "https://www.kanguru-tr.com/",
    },
    feeNote:
      "Güncel kayıt ücreti bu kayıtta doğrulanmadı. Ücretsiz seçenek filtresinde otomatik eşleşmez.",
    outcome: "Bir problem çözümü, hata notu ve katılım koşulları kontrolü.",
    steps: [
      "Sınıf kategorini, kayıt yolunu ve güncel ücreti doğrula.",
      "Bir örnek problem çöz; nasıl düşündüğünü not al.",
      "Yanlışını değerlendir ve sonraki çalışma oturumunu belirle.",
    ],
    roles: ["Bireysel hazırlık"],
  },
  {
    ...base,
    id: "john-locke-essay",
    organization: "johnlocke",
    title: "John Locke · Global Essay Prize",
    provider: "John Locke Institute",
    fields: ["sosyal", "isletme", "saglik"],
    competitionStatus: "watch",
    feeStatus: "unknown",
    description:
      "Felsefe, psikoloji, hukuk veya ekonomi üzerinden kaynaklı bir argüman kurmayı dene. 2026 kayıtları kapalı; yeni çağrıyı izleyebilirsin.",
    source: {
      label: "Resmî essay yarışması ve kurallar",
      url: "https://www.johnlockeinstitute.com/essay-competition",
    },
    eligibilityNote:
      "2027 çağrısı ve yaş koşulları bu kayıtta doğrulanmadı. Geçmiş dönemin tarihleri yeni tarih olarak kullanılmaz.",
    outcome:
      "Kaynaklı bir argüman taslağı. Yarışma kurallarını ihlal edecek AI yazımı veya otomatik teslim yapılmaz.",
    steps: [
      "Güncel dönemi ve yarışmanın özgün yazarlık/AI kurallarını oku.",
      "Bir konu için sav, karşı sav ve iki kaynak belirle.",
      "Kendi cümlelerinle bir paragraf yaz ve öğretmeninden geri bildirim iste.",
    ],
    roles: ["Araştırma", "Yazı"],
  },
];
