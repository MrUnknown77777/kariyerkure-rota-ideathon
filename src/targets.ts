import type { Field, Profile } from "./model";

export const departments: {
  id: string;
  name: string;
  fields: Field[];
  exam: string;
  preparation: string;
}[] = [
  {
    id: "bilgisayar",
    name: "Bilgisayar / Yazılım Mühendisliği",
    fields: ["teknoloji"],
    exam: "SAY",
    preparation: "AYT Matematik ve Fen; TYT temel hazırlığı",
  },
  {
    id: "elektrik",
    name: "Elektrik-Elektronik Mühendisliği",
    fields: ["teknoloji", "doga"],
    exam: "SAY",
    preparation: "AYT Matematik ve Fen; fizik odaklı deneyimler",
  },
  {
    id: "makine",
    name: "Makine / Mekatronik Mühendisliği",
    fields: ["teknoloji", "tasarim"],
    exam: "SAY",
    preparation: "AYT Matematik ve Fen; mekanik ve tasarım deneyimleri",
  },
  {
    id: "tip",
    name: "Tıp / Sağlık Bilimleri",
    fields: ["saglik", "doga"],
    exam: "SAY",
    preparation:
      "Hedef programın puan türünü doğrula; SAY için Matematik ve Fen",
  },
  {
    id: "biyoloji",
    name: "Moleküler Biyoloji ve Genetik",
    fields: ["doga", "saglik"],
    exam: "SAY",
    preparation: "AYT Matematik ve Fen; biyoloji araştırmaları",
  },
  {
    id: "cevre",
    name: "Çevre Mühendisliği",
    fields: ["doga", "teknoloji"],
    exam: "SAY",
    preparation: "AYT Matematik ve Fen; çevre ve veri araştırmaları",
  },
  {
    id: "mimarlik",
    name: "Mimarlık",
    fields: ["tasarim", "teknoloji"],
    exam: "SAY",
    preparation: "AYT Matematik ve Fen; mekânsal düşünme ve tasarım",
  },
  {
    id: "endustriyel-tasarim",
    name: "Endüstriyel Tasarım",
    fields: ["tasarim", "teknoloji"],
    exam: "Programa göre",
    preparation:
      "Programın puan türü ve varsa özel koşullarını resmî kaynaktan doğrula",
  },
  {
    id: "psikoloji",
    name: "Psikoloji",
    fields: ["sosyal", "saglik"],
    exam: "EA",
    preparation: "AYT Matematik ve TDE–Sosyal 1; yöntem ve etik farkındalığı",
  },
  {
    id: "hukuk",
    name: "Hukuk",
    fields: ["sosyal"],
    exam: "EA",
    preparation: "AYT Matematik ve TDE–Sosyal 1; kaynaklı tartışma ve yazı",
  },
  {
    id: "isletme",
    name: "İşletme / Ekonomi",
    fields: ["isletme", "sosyal"],
    exam: "EA",
    preparation:
      "AYT Matematik ve TDE–Sosyal 1; problem ve kullanıcı araştırması",
  },
  {
    id: "iletisim",
    name: "İletişim / Medya",
    fields: ["sosyal", "tasarim"],
    exam: "SÖZ / programa göre",
    preparation: "Hedef programı doğrula; yazı, araştırma ve medya üretimi",
  },
  {
    id: "diller",
    name: "Yabancı Diller",
    fields: ["sosyal"],
    exam: "DİL",
    preparation: "YDT ve TYT; ilgili dilde okuma, dinleme ve yazma",
  },
  {
    id: "kararsiz",
    name: "Bölümümü henüz bilmiyorum",
    fields: ["kesif"],
    exam: "Keşif",
    preparation: "Önce farklı alanları dene; bölüm seçmek zorunda değilsin",
  },
];
export const universities = [
  {
    id: "odtu",
    short: "ODTÜ",
    name: "Orta Doğu Teknik Üniversitesi",
    city: "Ankara",
    logo: "odtu.ico",
    url: "https://www.metu.edu.tr/",
  },
  {
    id: "itu",
    short: "İTÜ",
    name: "İstanbul Teknik Üniversitesi",
    city: "İstanbul",
    logo: "itu.ico",
    url: "https://www.itu.edu.tr/",
  },
  {
    id: "bogazici",
    short: "Boğaziçi",
    name: "Boğaziçi Üniversitesi",
    city: "İstanbul",
    logo: "bogazici.ico",
    url: "https://www.bogazici.edu.tr/",
  },
  {
    id: "hacettepe",
    short: "Hacettepe",
    name: "Hacettepe Üniversitesi",
    city: "Ankara",
    logo: "hacettepe.png",
    url: "https://www.hacettepe.edu.tr/",
  },
  {
    id: "bilkent",
    short: "Bilkent",
    name: "Bilkent Üniversitesi",
    city: "Ankara",
    logo: "bilkent.ico",
    url: "https://w3.bilkent.edu.tr/",
  },
  {
    id: "sabanci",
    short: "Sabancı",
    name: "Sabancı Üniversitesi",
    city: "İstanbul",
    logo: "sabanci.ico",
    url: "https://www.sabanciuniv.edu/",
  },
  {
    id: "yildiz",
    short: "Yıldız Teknik",
    name: "Yıldız Teknik Üniversitesi",
    city: "İstanbul",
    logo: "yildiz.ico",
    url: "https://www.yildiz.edu.tr/",
  },
];
export const organizations: Record<
  string,
  { name: string; logo: string; dark?: boolean }
> = {
  kanguru: { name: "Kanguru Matematik", logo: "kanguru.png" },
  johnlocke: { name: "John Locke Institute", logo: "johnlocke.png" },
  tubitak: { name: "TÜBİTAK", logo: "tubitak.svg" },
  teknofest: { name: "TEKNOFEST", logo: "teknofest.png" },
  diamond: { name: "Diamond Challenge", logo: "diamond.png" },
  technovation: { name: "Technovation", logo: "technovation.png" },
  conrad: { name: "Conrad Challenge", logo: "conrad.png", dark: true },
};
export const selectedDepartments = (profile: Profile) =>
  departments.filter((item) => profile.departments?.includes(item.id));
export const selectedUniversities = (profile: Profile) =>
  universities.filter((item) => profile.universities?.includes(item.id));
export function targetFields(profile: Profile) {
  return [
    ...new Set(
      selectedDepartments(profile)
        .flatMap((item) => item.fields)
        .filter((item) => item !== "kesif"),
    ),
  ];
}
