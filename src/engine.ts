import { catalog, opportunityById } from "./catalog";
import {
  DEMO_TODAY,
  STORAGE_KEY,
  datePlus,
  fieldLabels,
  freshState,
  gradeNumber,
  isSenior,
} from "./model";
import type { Opportunity, Profile, Reflection, State, Track } from "./model";
import {
  departments,
  universities,
  selectedDepartments,
  targetFields,
} from "./targets";

export function eligibility(item: Opportunity, profile: Profile): string[] {
  const reasons: string[] = [];
  const grade = gradeNumber(profile.grade);
  if (grade < item.minGrade || grade > item.maxGrade)
    reasons.push("Bu seçenek farklı bir sınıf düzeyine yönelik.");
  if (item.hours > profile.hours)
    reasons.push("Seçtiğin haftalık süreden daha fazla zaman istiyor.");
  if (
    profile.freeOnly &&
    (item.cost > 0 || item.feeStatus === "paid" || item.feeStatus === "unknown")
  )
    reasons.push(
      item.feeStatus === "unknown"
        ? "Ücreti doğrulanmadığı için yalnızca ücretsiz seçenekler tercihine alınmadı."
        : "Ücretsiz seçenek tercihine uymuyor.",
    );
  if (
    profile.access !== "her" &&
    item.access !== "her" &&
    profile.access !== item.access
  )
    reasons.push("Katılım yeri tercihine uymuyor.");
  if (item.experienceRequired && profile.experience === "yeni")
    reasons.push("Önce bir proje deneyimi gerekiyor.");
  if (item.deadline && item.deadline < DEMO_TODAY)
    reasons.push("Başvuru tarihi geçmiş.");
  if (
    item.onlyCities?.length &&
    profile.city &&
    !item.onlyCities.includes(profile.city)
  )
    reasons.push(
      `Yalnızca ${item.onlyCities.join(", ")} ilindeki öğrencilere açık.`,
    );
  return reasons;
}

const kindPurpose: Record<Opportunity["kind"], string> = {
  deneyim: "kısa bir denemeyle tanıman için",
  kulup: "okulunda bir ekiple denemen için",
  proje: "kendi küçük projene dönüştürmen için",
  yarisma: "gerçek bir yarışmada sınaman için",
  arastirma: "bir araştırma sorusuyla derinleştirmen için",
  sinav: "hedefine giden hazırlığa bağlaman için",
};

/** Listede her karta, üstteki kartlarda henüz kullanılmamış ilk doğru gerekçeyi seçer. */
export function distinctReasons(
  results: { item: Opportunity; reasons: string[] }[],
) {
  const used = new Set<string>();
  const chosen = new Map<string, string>();
  for (const { item, reasons } of results) {
    const pick = reasons.find((reason) => !used.has(reason)) ?? reasons[0];
    if (pick) {
      used.add(pick);
      chosen.set(item.id, pick);
    }
  }
  return chosen;
}

export function recommendations(state: State) {
  const profile = state.profile;
  if (!profile) return [];
  const completed = new Set(
    state.reflections.map((item) => item.opportunityId),
  );
  const added = new Set(state.tracks.map((item) => item.opportunityId));
  const latest = state.reflections.at(-1);
  const previous = latest ? opportunityById(latest.opportunityId) : undefined;
  return catalog
    .filter(
      (item) =>
        !eligibility(item, profile).length &&
        !completed.has(item.id) &&
        !added.has(item.id),
    )
    .map((item) => {
      const overlap = item.fields.filter((field) =>
        profile.interests.includes(field),
      );
      let score = overlap.length * 12;
      // Gerekçe sırası (KARARLAR.md, A2): deneyim tercihi → ilgi + tür → hedef bölüm → pratik uygunluk
      const preference: string[] = [];
      const interest: string[] = [];
      const target: string[] = [];
      const practical: string[] = [];
      const relevantTargets = selectedDepartments(profile).filter((target) =>
        target.fields.some((field) => item.fields.includes(field)),
      );
      if (targetFields(profile).some((field) => item.fields.includes(field)))
        score += 26;
      if (item.competitionStatus === "open") score += 4;
      if (overlap.length)
        interest.push(
          `${overlap.map((field) => fieldLabels[field]).join(" ve ")} ilgini ${kindPurpose[item.kind]}.`,
        );
      else interest.push(`Farklı bir alanı ${kindPurpose[item.kind]}.`);
      if (relevantTargets.length)
        target.push(
          `${relevantTargets[0].name} hedefindeki alanı deneyerek tanıman için.`,
        );
      if (profile.first === "dene" && item.kind === "deneyim") score += 22;
      if (profile.first === "ekip" && item.kind === "kulup") score += 22;
      if (profile.first === "yarisma" && item.kind === "yarisma") score += 22;
      if (profile.first === "sinav" && item.kind === "sinav") score += 22;
      if (profile.experience === "yeni" && item.kind === "deneyim") score += 8;
      if (profile.goal === "uret" && item.kind === "proje") score += 14;
      if (profile.goal === "alan" && item.id === "bolum-atlas") score += 22;
      if (isSenior(profile) && item.kind === "sinav") {
        score += 32;
        target.push("11–12. sınıf hazırlığını hedefinle ilişkilendirir.");
      }
      if (item.mode === "cevrimici")
        practical.push("Çevrim içi; bulunduğun yerden katılabilirsin.");
      else if (item.city && item.city === profile.city)
        practical.push("Senin ilinde yapılıyor.");
      if (item.hours <= 1)
        practical.push(
          "İlk araştırma ve hazırlık için haftada en fazla bir saat.",
        );
      if (previous && latest) {
        const related = item.fields.some((field) =>
          previous.fields.includes(field),
        );
        if (latest.next === "devam" && related && item.kind !== "deneyim") {
          score += 30;
          preference.push(
            "Son deneyiminden sonra aynı alanda devam etmek istedin.",
          );
        }
        if (
          latest.next === "rol" &&
          related &&
          item.roles.some(
            (role) =>
              role !==
              state.tracks.find((track) => track.opportunityId === previous.id)
                ?.role,
          )
        ) {
          score += 24;
          preference.push("Aynı alanda başka bir rol denemek istedin.");
        }
        if (latest.next === "baska" && !related) {
          score += 50;
          preference.push("Başka bir alanı keşfetmek istediğin için.");
        }
        if (latest.next === "ara")
          practical.push(
            "Ara verme tercihin korunuyor; bu yalnızca bir seçenek.",
          );
      }
      const reasons = [...preference, ...interest, ...target, ...practical];
      return { item, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
}

export function toggleSaved(state: State, id: string): State {
  if (!opportunityById(id)) return state;
  return {
    ...state,
    reminders:
      state.saved.includes(id) &&
      !state.tracks.some((track) => track.opportunityId === id)
        ? state.reminders?.filter((item) => item.opportunityId !== id)
        : state.reminders,
    saved: state.saved.includes(id)
      ? state.saved.filter((value) => value !== id)
      : [...state.saved, id],
  };
}

export function createTrack(
  state: State,
  id: string,
  role: string,
  taskIndexes: number[] = [0, 1, 2],
): State {
  const item = opportunityById(id);
  if (
    !state.profile ||
    !item ||
    eligibility(item, state.profile).length ||
    !item.roles.includes(role)
  )
    return state;
  if (
    state.tracks.some((track) => track.opportunityId === id) ||
    state.reflections.some((reflection) => reflection.opportunityId === id)
  )
    return state;
  const selected = [...new Set(taskIndexes)].filter(
    (index) => Number.isInteger(index) && item.steps[index],
  );
  if (!selected.length) return state;
  const minutes = Math.max(
    5,
    Math.min(30, Math.floor((item.hours * 60) / selected.length)),
  );
  const shortSession = item.kind === "deneyim";
  const track: Track = {
    opportunityId: id,
    role,
    addedAt: DEMO_TODAY,
    paused: false,
    tasks: selected.map((index, order) => ({
      id: `${id}:task:${index}`,
      title: item.steps[index],
      done: false,
      date:
        item.deadline &&
        datePlus(DEMO_TODAY, shortSession ? 1 : order + 1) > item.deadline
          ? item.deadline
          : datePlus(DEMO_TODAY, shortSession ? 1 : order + 1),
      time: shortSession
        ? `${String(17 + Math.floor((order * minutes) / 60)).padStart(2, "0")}:${String((order * minutes) % 60).padStart(2, "0")}`
        : "17:00",
      minutes,
    })),
  };
  return {
    ...state,
    saved: state.saved.includes(id) ? state.saved : [...state.saved, id],
    tracks: [...state.tracks, track],
  };
}

export function setTask(
  state: State,
  trackId: string,
  taskId: string,
  updates: Partial<{ done: boolean; date: string; time: string }>,
): State {
  // Completed experience is a receipt. Its preparation cannot silently be reopened
  // from another view while the experience continues to count as completed.
  if (state.reflections.some((item) => item.opportunityId === trackId))
    return state;
  if (updates.date !== undefined && !validDate(updates.date)) return state;
  if (
    updates.time !== undefined &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(updates.time)
  )
    return state;
  return {
    ...state,
    tracks: state.tracks.map((track) =>
      track.opportunityId !== trackId
        ? track
        : {
            ...track,
            tasks: track.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task,
            ),
          },
    ),
  };
}

export function addReflection(state: State, reflection: Reflection): State {
  const track = state.tracks.find(
    (item) => item.opportunityId === reflection.opportunityId,
  );
  if (
    !track ||
    !track.tasks.every((task) => task.done) ||
    !reflection.liked.trim() ||
    !reflection.blocker.trim()
  )
    return state;
  return {
    ...state,
    reflections: [
      ...state.reflections.filter(
        (item) => item.opportunityId !== reflection.opportunityId,
      ),
      reflection,
    ],
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  minutes?: number;
  opportunityId: string;
  kind: "deadline" | "event" | "task" | "review";
  label?: string;
  done: boolean;
  paused: boolean;
  demo: boolean;
}
export function calendarEvents(state: State): CalendarEvent[] {
  const ids = new Set([
    ...state.saved,
    ...state.tracks.map((track) => track.opportunityId),
  ]);
  const events: CalendarEvent[] = [];
  for (const id of ids) {
    const item = opportunityById(id);
    if (!item) continue;
    if (item.deadline)
      events.push({
        id: `${id}:deadline`,
        title: item.title,
        date: item.deadline,
        time: item.deadlineTime,
        minutes: item.deadlineTime ? 1 : undefined,
        opportunityId: id,
        kind: "deadline",
        done: false,
        paused: false,
        demo: item.demo,
      });
    if (item.eventDate)
      events.push({
        id: `${id}:event`,
        title: item.title,
        date: item.eventDate,
        label: item.eventLabel,
        opportunityId: id,
        kind: "event",
        done: false,
        paused: false,
        demo: item.demo,
      });
  }
  for (const track of state.tracks) {
    const item = opportunityById(track.opportunityId);
    if (!item) continue;
    for (const task of track.tasks)
      events.push({
        id: task.id,
        title: task.title,
        date: task.date,
        time: task.time,
        opportunityId: item.id,
        kind: "task",
        minutes:
          task.minutes ??
          Math.max(
            5,
            Math.min(30, Math.floor((item.hours * 60) / track.tasks.length)),
          ),
        done: task.done,
        paused: track.paused,
        demo: true,
      });
  }
  for (const reminder of state.reminders ?? []) {
    const item = opportunityById(reminder.opportunityId);
    if (item)
      events.push({
        id: `${item.id}:review`,
        title: item.title,
        date: reminder.date,
        opportunityId: item.id,
        kind: "review",
        label: "Yeni çağrıyı kontrol et",
        done: reminder.done,
        paused: false,
        demo: true,
      });
  }
  return events.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      (a.time ?? "").localeCompare(b.time ?? ""),
  );
}

function escapeICS(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
export function exportCalendar(state: State) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kariyerkure Ideathon//Rota Demo//TR",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Kariyer Küre - Demo rotam",
  ];
  for (const event of calendarEvents(state).filter(
    (event) => !event.paused && !event.done,
  )) {
    const date = event.date.replaceAll("-", "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@kariyerkure-demo.local`,
      "DTSTAMP:20261024T090000Z",
    );
    if (event.time) {
      // Demo is explicitly Turkey-local; UTC export avoids reliance on a missing VTIMEZONE.
      const utc = new Date(`${event.date}T${event.time}:00+03:00`);
      const stamp = utc.toISOString().replace(/[-:]/g, "").replace(".000", "");
      const end = new Date(utc.getTime() + (event.minutes ?? 30) * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(".000", "");
      lines.push(`DTSTART:${stamp}`, `DTEND:${end}`);
    } else
      lines.push(
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${datePlus(event.date, 1).replaceAll("-", "")}`,
      );
    lines.push(
      `SUMMARY:${escapeICS(`[DEMO] ${event.title}`)}`,
      `DESCRIPTION:${escapeICS("İdeathon örnek takvimi. Gerçek başvuru veya etkinlik kaydı değildir.")}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown) => typeof v === "string" && v.length <= 3000;
export function validProfile(value: unknown): value is Profile {
  if (!record(value)) return false;
  return (
    text(value.name) &&
    ["Hazırlık", "9", "10", "11", "12"].includes(String(value.grade)) &&
    ["kesfet", "uret", "alan", "hazirlan"].includes(String(value.goal)) &&
    Array.isArray(value.interests) &&
    value.interests.length > 0 &&
    value.interests.every(
      (field) => typeof field === "string" && field in fieldLabels,
    ) &&
    ["yeni", "kulup", "proje"].includes(String(value.experience)) &&
    ["dene", "ekip", "yarisma", "sinav"].includes(String(value.first)) &&
    [1, 2, 4].includes(Number(value.hours)) &&
    typeof value.hours === "number" &&
    ["her", "ev", "okul"].includes(String(value.access)) &&
    typeof value.freeOnly === "boolean" &&
    text(value.target) &&
    (value.city === undefined ||
      (typeof value.city === "string" && value.city.length <= 40)) &&
    (value.departments === undefined ||
      (Array.isArray(value.departments) &&
        value.departments.length <= 3 &&
        value.departments.every((id) =>
          departments.some((item) => item.id === id),
        ))) &&
    (value.universities === undefined ||
      (Array.isArray(value.universities) &&
        value.universities.length <= 5 &&
        value.universities.every((id) =>
          universities.some((item) => item.id === id),
        )))
  );
}
export function validState(value: unknown): value is State {
  if (
    !record(value) ||
    value.version !== 1 ||
    (value.profile !== null && !validProfile(value.profile))
  )
    return false;
  if (
    !Array.isArray(value.saved) ||
    !value.saved.every((id) => typeof id === "string" && opportunityById(id))
  )
    return false;
  if (
    !Array.isArray(value.tracks) ||
    !value.tracks.every(
      (track) =>
        record(track) &&
        typeof track.opportunityId === "string" &&
        opportunityById(track.opportunityId) &&
        text(track.role) &&
        typeof track.paused === "boolean" &&
        validDate(track.addedAt) &&
        (track.participation === undefined ||
          ["arastiriyorum", "hazirlaniyorum", "basvurdum", "katildim"].includes(
            String(track.participation),
          )) &&
        (track.updates === undefined ||
          (Array.isArray(track.updates) &&
            track.updates.every(
              (update) =>
                record(update) &&
                text(update.id) &&
                text(update.text) &&
                validDate(update.date),
            ))) &&
        Array.isArray(track.tasks) &&
        track.tasks.length > 0 &&
        track.tasks.every(
          (task) =>
            record(task) &&
            text(task.id) &&
            text(task.title) &&
            typeof task.done === "boolean" &&
            validDate(task.date) &&
            typeof task.time === "string" &&
            (task.minutes === undefined ||
              (typeof task.minutes === "number" &&
                Number.isInteger(task.minutes) &&
                task.minutes >= 5 &&
                task.minutes <= 120)) &&
            /^([01]\d|2[0-3]):[0-5]\d$/.test(task.time),
        ),
    )
  )
    return false;
  if (
    !Array.isArray(value.reflections) ||
    !value.reflections.every(
      (item) =>
        record(item) &&
        typeof item.opportunityId === "string" &&
        opportunityById(item.opportunityId) &&
        text(item.liked) &&
        text(item.blocker) &&
        text(item.note) &&
        ["devam", "rol", "baska", "ara"].includes(String(item.next)) &&
        validDate(item.date),
    )
  )
    return false;
  if (
    !Array.isArray(value.requests) ||
    !value.requests.every(
      (item) =>
        record(item) &&
        text(item.id) &&
        ["ekip", "gorusme"].includes(String(item.type)) &&
        text(item.summary) &&
        text(item.availability) &&
        validDate(item.createdAt) &&
        (item.reply === undefined || text(item.reply)) &&
        (item.opportunityId === undefined ||
          (typeof item.opportunityId === "string" &&
            opportunityById(item.opportunityId))),
    )
  )
    return false;
  if (
    !Array.isArray(value.exams) ||
    !value.exams.every(
      (item) =>
        record(item) &&
        text(item.id) &&
        validDate(item.date) &&
        ["TYT", "AYT"].includes(String(item.type)) &&
        text(item.source) &&
        ["math", "language", "science", "social"].every(
          (key) =>
            typeof item[key] === "number" &&
            Number.isFinite(item[key]) &&
            Number(item[key]) >= -20 &&
            Number(item[key]) <= 80,
        ),
    )
  )
    return false;
  if (
    value.reminders !== undefined &&
    (!Array.isArray(value.reminders) ||
      !value.reminders.every(
        (item) =>
          record(item) &&
          typeof item.opportunityId === "string" &&
          !!opportunityById(item.opportunityId) &&
          validDate(item.date) &&
          typeof item.done === "boolean",
      ))
  )
    return false;
  return true;
}

export function setReviewDate(state: State, id: string, date: string): State {
  if (!opportunityById(id) || !validDate(date) || date < DEMO_TODAY)
    return state;
  return {
    ...state,
    saved: state.saved.includes(id) ? state.saved : [...state.saved, id],
    reminders: [
      ...(state.reminders ?? []).filter((item) => item.opportunityId !== id),
      { opportunityId: id, date, done: false },
    ],
  };
}
export function updateTrackProgress(
  state: State,
  id: string,
  participation: NonNullable<Track["participation"]>,
  note: string,
): State {
  if (
    !["arastiriyorum", "hazirlaniyorum", "basvurdum", "katildim"].includes(
      participation,
    )
  )
    return state;
  return {
    ...state,
    tracks: state.tracks.map((track) =>
      track.opportunityId !== id
        ? track
        : {
            ...track,
            participation,
            updates: note.trim()
              ? [
                  ...(track.updates ?? []),
                  {
                    id: crypto.randomUUID(),
                    date: DEMO_TODAY,
                    text: note.trim().slice(0, 1200),
                  },
                ]
              : track.updates,
          },
    ),
  };
}
export function loadState(storage: Pick<Storage, "getItem">): {
  state: State;
  warning?: string;
} {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { state: freshState() };
    const value: unknown = JSON.parse(raw);
    return validState(value)
      ? { state: value }
      : {
          state: freshState(),
          warning:
            "Eski veya bozuk demo kaydı yüklenemedi. Yeni bir başlangıç yapabilirsin.",
        };
  } catch {
    return {
      state: freshState(),
      warning: "Tarayıcı kaydı okunamadı. Bu oturumda devam edebilirsin.",
    };
  }
}
export function persistState(
  storage: Pick<Storage, "setItem">,
  state: State,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

const dayDiff = (from: string, to: string) =>
  Math.round(
    (new Date(`${to}T12:00:00`).getTime() -
      new Date(`${from}T12:00:00`).getTime()) /
      86400000,
  );

/**
 * A3 · Demo hatırlatması: takip edilen (kaydedilmiş ya da rotadaki) fırsatların en yakın
 * son tarihi ve sıradaki hazırlık işi. Gerçek üründe telefon bildirimi olur; prototipte uygulama içi bildirimdir.
 */
export function upcomingReminder(state: State) {
  const reflected = new Set(state.reflections.map((item) => item.opportunityId));
  const active = state.tracks.filter(
    (track) => !track.paused && !reflected.has(track.opportunityId),
  );
  const followed = new Set([
    ...state.saved,
    ...active.map((track) => track.opportunityId),
  ]);
  const deadlines = [...followed]
    .map((id) => opportunityById(id))
    .filter(
      (item): item is Opportunity =>
        !!item?.deadline && item.deadline >= DEMO_TODAY,
    )
    .sort((a, b) => a.deadline!.localeCompare(b.deadline!));
  const nextTask = active
    .flatMap((track) =>
      track.tasks
        .filter((task) => !task.done && task.date >= DEMO_TODAY)
        .map((task) => ({ task, track })),
    )
    .sort((a, b) =>
      `${a.task.date}${a.task.time}`.localeCompare(`${b.task.date}${b.task.time}`),
    )[0];
  if (!deadlines.length && !nextTask) return null;
  const nearest = deadlines[0];
  const parts: string[] = [];
  if (nearest) {
    const days = dayDiff(DEMO_TODAY, nearest.deadline!);
    parts.push(
      days === 0
        ? `${nearest.title}: son başvuru bugün.`
        : `${nearest.title}: son başvuruya ${days} gün kaldı.`,
    );
  }
  if (nextTask) {
    const when =
      nextTask.task.date === DEMO_TODAY
        ? `bugün ${nextTask.task.time}`
        : `${nextTask.task.date.slice(8)}.${nextTask.task.date.slice(5, 7)} ${nextTask.task.time}`;
    parts.push(`Sıradaki hazırlık işin: ${nextTask.task.title} (${when}).`);
  }
  return {
    title: "Hatırlatma",
    description: parts.join(" "),
    date: nearest?.deadline ?? nextTask?.task.date,
  };
}

/** Mahremiyet: öğrenci paylaştığı özeti ve talebi her an geri çekebilir; öğretmen görünümünden kalkar. */
export function withdrawRequest(state: State, id: string): State {
  return {
    ...state,
    requests: state.requests.filter((request) => request.id !== id),
  };
}

/**
 * B2 / Y1 · Sınıfın fırsat özeti (öğretmen görünümü). Örnek sınıfın SAYILARI sabit örnek veridir;
 * demo öğrencisinin kendi kayıt, rota ve talepleri canlı olarak eklenir. Ad, not, ölçek sonucu içermez.
 */
const SAMPLE_CLASS = {
  name: "10-A (örnek sınıf)",
  students: 28,
  following: { "2204-arastir": 4, technovation: 2, "kanguru-matematik": 5 } as Record<string, number>,
  teamSeekers: 2,
};
export function classSummary(state: State) {
  const live = new Set([
    ...state.saved,
    ...state.tracks.map((track) => track.opportunityId),
  ]);
  const counts = new Map<string, number>(Object.entries(SAMPLE_CLASS.following));
  for (const id of live) counts.set(id, (counts.get(id) ?? 0) + 1);
  const rows = [...counts.entries()]
    .map(([id, count]) => ({ item: opportunityById(id), count }))
    .filter(
      (row): row is { item: Opportunity; count: number } =>
        !!row.item?.deadline && row.item.deadline >= DEMO_TODAY,
    )
    .sort((a, b) => a.item.deadline!.localeCompare(b.item.deadline!))
    .slice(0, 4)
    .map((row) => ({ ...row, days: dayDiff(DEMO_TODAY, row.item.deadline!) }));
  const liveFollowing = live.size ? 1 : 0;
  return {
    className: SAMPLE_CLASS.name,
    students: SAMPLE_CLASS.students,
    followingStudents: 9 + liveFollowing,
    teamSeekers:
      SAMPLE_CLASS.teamSeekers +
      state.requests.filter((request) => request.type === "ekip").length,
    meetingRequests: state.requests.filter(
      (request) => request.type === "gorusme" && !request.reply,
    ).length,
    rows,
  };
}
