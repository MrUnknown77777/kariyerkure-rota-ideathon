export type Grade = "Hazırlık" | "9" | "10" | "11" | "12";
export type Field =
  "teknoloji" | "tasarim" | "saglik" | "sosyal" | "isletme" | "doga" | "kesif";
export type Kind =
  "deneyim" | "kulup" | "proje" | "yarisma" | "arastirma" | "sinav";
export type Page =
  | "rotam"
  | "firsatlar"
  | "takvim"
  | "deneyimlerim"
  | "ogretmen"
  | "demo"
  | "baslangic"
  | "hedefim";

export interface Profile {
  name: string;
  grade: Grade;
  goal: "kesfet" | "uret" | "alan" | "hazirlan";
  interests: Field[];
  experience: "yeni" | "kulup" | "proje";
  first: "dene" | "ekip" | "yarisma" | "sinav";
  hours: number;
  access: "her" | "ev" | "okul";
  freeOnly: boolean;
  target: string;
  departments?: string[];
  universities?: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  provider: string;
  kind: Kind;
  fields: Field[];
  minGrade: number;
  maxGrade: number;
  hours: number;
  cost: number;
  access: "ev" | "okul" | "her";
  experienceRequired: boolean;
  demo: boolean;
  deadline?: string;
  eventDate?: string;
  source?: { label: string; url: string };
  outcome: string;
  steps: string[];
  roles: string[];
  accent: string;
  organization?: string;
  verifiedAt?: string;
  deadlineNote?: string;
  deadlineSource?: string;
  competitionStatus?: "open" | "watch";
  eligibilityNote?: string;
  feeStatus?: "free" | "paid" | "unknown";
  feeNote?: string;
  deadlineTime?: string;
  eventLabel?: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  date: string;
  time: string;
  minutes?: number;
}
export interface Track {
  opportunityId: string;
  role: string;
  addedAt: string;
  paused: boolean;
  tasks: Task[];
  participation?: "arastiriyorum" | "hazirlaniyorum" | "basvurdum" | "katildim";
  updates?: { id: string; date: string; text: string }[];
}
export interface Reflection {
  opportunityId: string;
  liked: string;
  blocker: string;
  next: "devam" | "rol" | "baska" | "ara";
  note: string;
  date: string;
}
export interface TeacherRequest {
  id: string;
  opportunityId?: string;
  type: "ekip" | "gorusme";
  summary: string;
  availability: string;
  createdAt: string;
  reply?: string;
}
export interface ExamRecord {
  id: string;
  date: string;
  type: "TYT" | "AYT";
  source: string;
  math: number;
  language: number;
  science: number;
  social: number;
}
export interface State {
  version: 1;
  profile: Profile | null;
  saved: string[];
  tracks: Track[];
  reflections: Reflection[];
  requests: TeacherRequest[];
  exams: ExamRecord[];
  reminders?: { opportunityId: string; date: string; done: boolean }[];
}
export const DEMO_TODAY = "2026-10-24";
export const STORAGE_KEY = "kariyerkure-rota:demo:v1";
export const fieldLabels: Record<Field, string> = {
  teknoloji: "Teknoloji",
  tasarim: "Tasarım",
  saglik: "Sağlık",
  sosyal: "İnsan & toplum",
  isletme: "Girişimcilik",
  doga: "Doğa & bilim",
  kesif: "Henüz keşfediyorum",
};
export const kindLabels: Record<Kind, string> = {
  deneyim: "Küçük deneme",
  kulup: "Kulüp & ekip",
  proje: "Proje",
  yarisma: "Yarışma",
  arastirma: "Araştırma",
  sinav: "Sınav & kaynak",
};
export const goalLabels: Record<Profile["goal"], string> = {
  kesfet: "Kendimi keşfetmek",
  uret: "İlk projemi üretmek",
  alan: "Yönümü seçmek",
  hazirlan: "Hedefime hazırlanmak",
};
export const defaultProfile: Profile = {
  name: "Defne",
  grade: "9",
  goal: "kesfet",
  interests: [],
  experience: "yeni",
  first: "dene",
  hours: 2,
  access: "her",
  freeOnly: true,
  target: "",
  departments: [],
  universities: [],
};
export const personas: Record<string, Profile> = {
  defne: {
    ...defaultProfile,
    goal: "uret",
    interests: ["teknoloji", "tasarim"],
    target: "İlk ekip projemi yapmak",
    departments: ["bilgisayar", "endustriyel-tasarim"],
    universities: ["itu", "odtu"],
  },
  deniz: {
    ...defaultProfile,
    name: "Deniz",
    grade: "Hazırlık",
    interests: ["sosyal", "doga"],
    access: "ev",
    hours: 1,
    target: "Neyi sevdiğimi keşfetmek",
  },
  ege: {
    ...defaultProfile,
    name: "Ege",
    grade: "11",
    goal: "hazirlan",
    interests: ["teknoloji"],
    experience: "proje",
    first: "sinav",
    hours: 4,
    target: "Bilgisayar mühendisliğini araştırmak",
    departments: ["bilgisayar"],
    universities: ["odtu", "bogazici"],
  },
};
export const freshState = (): State => ({
  version: 1,
  profile: null,
  saved: [],
  tracks: [],
  reflections: [],
  requests: [],
  exams: [],
});
export const gradeNumber = (grade: Grade) =>
  grade === "Hazırlık" ? 8 : Number(grade);
export const isSenior = (profile: Profile) => gradeNumber(profile.grade) >= 11;
export const stage = (profile: Profile) =>
  isSenior(profile)
    ? "Daralt"
    : profile.grade === "10" || profile.goal === "alan"
      ? "Seç"
      : "Dene";
export function datePlus(date: string, days: number) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + days);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}
export function formatDate(date: string, full = false) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: full ? "long" : "short",
  }).format(new Date(`${date}T12:00:00`));
}
