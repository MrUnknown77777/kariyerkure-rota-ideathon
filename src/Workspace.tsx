import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Link2,
  MessageCircle,
  Play,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { opportunityById } from "./catalog";
import {
  calendarEvents,
  classSummary,
  exportCalendar,
  setTask,
  validDate,
  withdrawRequest,
} from "./engine";
import type { CalendarEvent } from "./engine";
import {
  DEMO_TODAY,
  datePlus,
  fieldLabels,
  formatDate,
  freshState,
  personas,
} from "./model";
import {
  Empty,
  IconTile,
  OpportunityMark,
  PageHead,
  SectionHead,
  go,
  useApp,
} from "./ui";
import { organizations } from "./targets";

export function CalendarPage({ initialDate }: { initialDate?: string }) {
  const { state, setState } = useApp();
  const initial = validDate(initialDate) ? initialDate : DEMO_TODAY;
  const [month, setMonth] = useState(`${initial.slice(0, 7)}-01`);
  const [selected, setSelected] = useState(initial);
  const [organization, setOrganization] = useState("all");
  const [planning, setPlanning] = useState(false);
  const [chosenTask, setChosenTask] = useState("");
  const [planDate, setPlanDate] = useState(DEMO_TODAY);
  const [planTime, setPlanTime] = useState("17:00");
  const allEvents = calendarEvents(state);
  const events = allEvents.filter(
    (event) =>
      organization === "all" ||
      opportunityById(event.opportunityId)?.organization === organization,
  );
  const organizationIds = [
    ...new Set(
      allEvents
        .map((event) => opportunityById(event.opportunityId)?.organization)
        .filter((id): id is string => !!id),
    ),
  ];
  const tasks = state.tracks.flatMap((track) =>
    track.tasks
      .filter((task) => !task.done)
      .map((task) => ({ ...task, opportunityId: track.opportunityId })),
  );
  const start = new Date(`${month}T12:00:00`);
  const offset = (start.getDay() + 6) % 7;
  const firstCell = datePlus(month, -offset);
  const selectedEvents = events.filter((event) => event.date === selected);
  const monthTitle = new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(start);
  const upcoming = events.filter(
    (event) => event.kind !== "task" && !event.done && event.date >= DEMO_TODAY,
  );
  function shiftMonth(delta: number) {
    const value = new Date(start);
    value.setMonth(value.getMonth() + delta);
    setMonth(
      `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-01`,
    );
  }
  function download() {
    const blob = new Blob([exportCalendar(state)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kariyerkure-demo-takvim.ics";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Demo takvimi indirildi.", {
      description:
        "Otomatik senkronizasyon değil; takvim uygulamana aktarılabilen bir dosya.",
    });
  }
  return (
    <>
      <PageHead
        eyebrow="HAZIRLIK VE TARİHLER BİR ARADA"
        title="Biraz yer açalım."
        description="Kaydettiğin fırsatların tarihleri ve rotandaki hazırlık oturumları burada."
        action={
          <button
            className="button secondary"
            disabled={!events.length}
            onClick={download}
          >
            <Download size={16} />
            Takvimi indir
          </button>
        }
      />
      {organizationIds.length ? (
        <div
          className="calendar-organizations"
          aria-label="Kurumlara göre takvim"
        >
          <button
            className={organization === "all" ? "active" : ""}
            onClick={() => setOrganization("all")}
          >
            Tümü
          </button>
          {organizationIds.map((id) => (
            <button
              key={id}
              aria-pressed={organization === id}
              className={organization === id ? "active" : ""}
              onClick={() => {
                setOrganization(id);
                const next = allEvents.find(
                  (event) =>
                    event.date >= DEMO_TODAY &&
                    opportunityById(event.opportunityId)?.organization === id,
                );
                if (next) {
                  setSelected(next.date);
                  setMonth(`${next.date.slice(0, 7)}-01`);
                }
              }}
            >
              <img src={`/assets/logos/${organizations[id].logo}`} alt="" />
              {organizations[id].name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="calendar-heading">
            <h2>{monthTitle}</h2>
            <div>
              <button
                className="text-button"
                onClick={() => {
                  setMonth("2026-10-01");
                  setSelected(DEMO_TODAY);
                }}
              >
                Demo bugünü
              </button>
              <button
                className="icon-button"
                aria-label="Önceki ay"
                onClick={() => shiftMonth(-1)}
              >
                <ChevronLeft size={19} />
              </button>
              <button
                className="icon-button"
                aria-label="Sonraki ay"
                onClick={() => shiftMonth(1)}
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
          <div className="calendar-weekdays">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 42 }, (_, i) => {
              const date = datePlus(firstCell, i);
              const dayEvents = events.filter((event) => event.date === date);
              return (
                <button
                  key={date}
                  aria-label={`${formatDate(date, true)}: ${dayEvents.length} kayıt`}
                  aria-pressed={selected === date}
                  onClick={() => setSelected(date)}
                  className={`calendar-cell ${date.slice(0, 7) !== month.slice(0, 7) ? "other-month" : ""} ${selected === date ? "selected" : ""} ${date === DEMO_TODAY ? "today" : ""}`}
                >
                  <span className="calendar-day">{Number(date.slice(-2))}</span>
                  {dayEvents.slice(0, 2).map((event) => (
                    <span
                      className={`calendar-chip ${event.kind} ${event.done ? "done" : ""}`}
                      key={event.id}
                    >
                      <OpportunityMark
                        item={opportunityById(event.opportunityId)!}
                        small
                      />
                      {event.time ? `${event.time} · ` : ""}
                      {event.kind === "deadline" ? "Son tarih · " : ""}
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > 2 ? (
                    <small className="more-events">
                      +{dayEvents.length - 2} kayıt
                    </small>
                  ) : null}
                  <span className="mobile-event-dots">
                    {dayEvents.slice(0, 3).map((event) => (
                      <i className={event.kind} key={event.id} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span>
              <i className="task" />
              Hazırlık
            </span>
            <span>
              <i className="deadline" />
              Son tarih
            </span>
            <span>
              <i className="event" />
              Etkinlik
            </span>
            <span>
              <i className="review" />
              Çağrı kontrolü
            </span>
            <small>Demo zamanı · 24 Ekim 2026</small>
          </div>
        </section>
        <aside className="calendar-aside">
          <section className="panel day-panel">
            <span className="eyebrow">SEÇTİĞİN GÜN</span>
            <h2>{formatDate(selected, true)}</h2>
            {selectedEvents.length ? (
              selectedEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))
            ) : (
              <div className="quiet-empty">
                <CalendarDays size={26} />
                <p>
                  Bu gün için bir kayıt yok. Hazırlık oturumlarını sana uyan
                  günlere taşıyabilirsin.
                </p>
              </div>
            )}
            <button
              className="button secondary full"
              disabled={!tasks.length}
              onClick={() => {
                setPlanning(!planning);
                setPlanDate(selected);
                setChosenTask(tasks[0]?.id ?? "");
              }}
            >
              <Plus size={16} />
              Hazırlık saatini ayarla
            </button>
            {!tasks.length ? (
              <small className="muted">
                Önce bir fırsatı hazırlık işleriyle rotana ekle.
              </small>
            ) : null}
            {planning ? (
              <form
                className="schedule-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const task = tasks.find((value) => value.id === chosenTask);
                  if (!task || !planDate || !planTime) return;
                  setState((previous) =>
                    setTask(previous, task.opportunityId, task.id, {
                      date: planDate,
                      time: planTime,
                    }),
                  );
                  setSelected(planDate);
                  setMonth(`${planDate.slice(0, 7)}-01`);
                  setPlanning(false);
                  toast.success("Hazırlık saatin güncellendi.", {
                    description: "Aynı değişiklik rotandaki işte de görünüyor.",
                  });
                }}
              >
                <label>
                  Hazırlık işi
                  <select
                    value={chosenTask}
                    onChange={(event) =>
                      setChosenTask(event.currentTarget.value)
                    }
                  >
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tarih
                  <input
                    type="date"
                    required
                    value={planDate}
                    onInput={(event) => setPlanDate(event.currentTarget.value)}
                  />
                </label>
                <label>
                  Saat · Türkiye
                  <input
                    type="time"
                    required
                    value={planTime}
                    onInput={(event) => setPlanTime(event.currentTarget.value)}
                  />
                </label>
                <button className="button primary full" type="submit">
                  Takvimi güncelle
                  <Check size={16} />
                </button>
              </form>
            ) : null}
          </section>
          <div className="gentle-note">
            <Clock3 size={22} />
            <h3>Son tarih, hazırlık saati değildir.</h3>
            <p>
              Son tarihleri ayrı, senin ayırdığın çalışma oturumlarını ayrı
              gösteriyoruz.
            </p>
          </div>
        </aside>
      </div>
      <section className="panel watched-dates">
        <SectionHead
          title="Takip ettiğin tarihler"
          note="Kaydettiğin veya rotana eklediğin fırsatlardan gelir."
        />
        {upcoming.length ? (
          <div className="watched-grid">
            {upcoming.map((event) => (
              <button
                className="watched-date"
                key={event.id}
                onClick={() => {
                  setSelected(event.date);
                  setMonth(`${event.date.slice(0, 7)}-01`);
                  window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "instant"
                      : "smooth",
                  });
                }}
              >
                <OpportunityMark
                  item={opportunityById(event.opportunityId)!}
                  small
                />
                <span>
                  <strong>{event.title}</strong>
                  <small>
                    {formatDate(event.date, true)} ·{" "}
                    {event.kind === "deadline"
                      ? "Son tarih"
                      : (event.label ?? "Etkinlik")}{" "}
                    · {event.demo ? "Kişisel / örnek tarih" : "Resmî kaynaklı"}
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">
            Doğrulanmış tarihi olan bir fırsatı kaydettiğinde burada görünür.
            Tarihsiz kaynaklara son tarih uydurulmaz.
          </p>
        )}
      </section>
    </>
  );
}

function EventRow({ event }: { event: CalendarEvent }) {
  const { state, setState } = useApp();
  const recorded = state.reflections.some(
    (item) => item.opportunityId === event.opportunityId,
  );
  return (
    <div className={`day-event ${event.done ? "done" : ""}`}>
      <OpportunityMark item={opportunityById(event.opportunityId)!} small />
      <div>
        <span className="eyebrow">
          {event.kind === "task"
            ? `${event.time} · ${event.minutes ?? 30} DK · HAZIRLIK`
            : event.kind === "deadline"
              ? "SON TARİH"
              : (event.label ?? "ETKİNLİK")}
          {event.paused ? " · ARA VERİLDİ" : ""}
        </span>
        <strong>{event.title}</strong>
        <small>
          {event.kind === "task" || event.kind === "review"
            ? "Kendi planın"
            : event.demo
              ? "Demo verisi"
              : `Kaynaklı tarih${event.time ? ` · ${event.time} Türkiye` : ""}`}
        </small>
        {event.kind === "review" ? (
          <label className="check-label">
            <input
              type="checkbox"
              checked={event.done}
              onChange={() =>
                setState((previous) => ({
                  ...previous,
                  reminders: previous.reminders?.map((item) =>
                    item.opportunityId === event.opportunityId
                      ? { ...item, done: !item.done }
                      : item,
                  ),
                }))
              }
            />
            Çağrıyı kontrol ettim
          </label>
        ) : null}
        {event.kind === "task" ? (
          <label className="check-label">
            <input
              type="checkbox"
              disabled={event.paused || recorded}
              checked={event.done}
              onChange={() => {
                setState((previous) =>
                  setTask(previous, event.opportunityId, event.id, {
                    done: !event.done,
                  }),
                );
                toast.success(
                  event.done
                    ? "Hazırlık işi yeniden açıldı."
                    : "Hazırlık işi rotanda da tamamlandı.",
                );
              }}
            />
            <span>
              {event.done ? "Tamamlandı" : "Bu hazırlık işini tamamladım"}
            </span>
          </label>
        ) : null}
        <button
          className="text-button"
          onClick={() => go(`firsat/${event.opportunityId}`)}
        >
          Çalışmayı aç
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function MemoriesPage() {
  const { state, setState } = useApp();
  const [sharing, setSharing] = useState(false);
  const [consent, setConsent] = useState(false);
  const [availability, setAvailability] = useState("İlk uygun rehberlik saati");
  const summary = state.reflections
    .map(
      (reflection) =>
        `${opportunityById(reflection.opportunityId)?.title}: “${reflection.liked}” kısmını sevdiğini belirtti. Zorlayan: ${reflection.blocker}. ${reflection.note ? `Kendi notu: ${reflection.note}` : ""}`,
    )
    .join("\n");
  const pendingMeeting = state.requests.some(
    (request) => request.type === "gorusme" && !request.reply,
  );
  return (
    <>
      <PageHead
        eyebrow="DENEDİKLERİN YANINDA KALSIN"
        title="Bir testten daha fazlasısın."
        description="Ürettiklerin ve kendi gözlemlerin. Yetenek puanı değil, sana ait bir deneyim geçmişi."
        action={
          state.reflections.length ? (
            <button
              className="button secondary"
              disabled={pendingMeeting}
              onClick={() => setSharing(!sharing)}
            >
              <Users size={17} />
              {pendingMeeting
                ? "Görüşme talebin bekliyor"
                : "Öğretmenimle paylaş"}
            </button>
          ) : undefined
        }
      />
      {state.reflections.length ? (
        <>
          <section className="memory-summary">
            <span className="memory-count">
              <Sprout size={26} />
              <b>{state.reflections.length}</b>
            </span>
            <div>
              <h2>Gerçekten denediğin şeyler.</h2>
              <p>
                Kaydettiğin fırsatlar burada başarı sayılmaz. Tamamlayıp
                değerlendirdiğin çalışmalar görünür.
              </p>
            </div>
          </section>
          {sharing ? (
            <section className="panel share-panel">
              <SectionHead
                title="Paylaşılmadan önce sen gör."
                note="Yalnızca aşağıdaki özet demo öğretmen görünümüne gönderilir."
              />
              <div className="share-preview">
                <p className="preserve-lines">{summary}</p>
              </div>
              <label className="field-label">
                Görüşmek için uygun zaman
                <input
                  value={availability}
                  maxLength={150}
                  onInput={(event) =>
                    setAvailability(event.currentTarget.value)
                  }
                />
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.currentTarget.checked)}
                />
                <span>
                  Bu özeti rehber öğretmen görünümünde paylaşmayı onaylıyorum.
                </span>
              </label>
              <button
                className="button primary"
                disabled={!consent || !availability.trim()}
                onClick={() => {
                  setState((previous) => ({
                    ...previous,
                    requests: [
                      ...previous.requests,
                      {
                        id: crypto.randomUUID(),
                        type: "gorusme",
                        summary,
                        availability,
                        createdAt: DEMO_TODAY,
                      },
                    ],
                  }));
                  setSharing(false);
                  setConsent(false);
                  toast.success("Görüşme talebin öğretmen görünümünde.", {
                    description:
                      "Canlı bildirim gönderilmedi; sunumda PDR sekmesine geçebilirsin.",
                    action: {
                      label: "PDR görünümü",
                      onClick: () => go("ogretmen"),
                    },
                  });
                }}
              >
                Özeti paylaş ve görüşme iste
                <Send size={16} />
              </button>
            </section>
          ) : null}
          <div className="memory-list">
            {[...state.reflections].reverse().map((reflection) => {
              const item = opportunityById(reflection.opportunityId)!;
              return (
                <article
                  className="panel memory-card"
                  key={reflection.opportunityId}
                >
                  <div className="memory-card-top">
                    <IconTile kind={item.kind} accent={item.accent} />
                    <div>
                      <span className="eyebrow">
                        {formatDate(reflection.date, true)} · KENDİ GÖZLEMİN
                      </span>
                      <h2>{item.title}</h2>
                    </div>
                    <span className="pill mint">
                      <Check size={13} />
                      Denedim
                    </span>
                  </div>
                  <div className="memory-quotes">
                    <div>
                      <span>SEVDİĞİM KISIM</span>
                      <strong>{reflection.liked}</strong>
                    </div>
                    <div>
                      <span>ZORLAYAN</span>
                      <strong>{reflection.blocker}</strong>
                    </div>
                    <div>
                      <span>SONRAKİ TERCİHİM</span>
                      <strong>
                        {
                          {
                            devam: "Aynı alanda devam",
                            rol: "Başka bir rol",
                            baska: "Başka bir alan",
                            ara: "Şimdilik ara",
                          }[reflection.next]
                        }
                      </strong>
                    </div>
                  </div>
                  {reflection.note ? (
                    <blockquote>{reflection.note}</blockquote>
                  ) : null}
                  <div className="memory-card-footer">
                    <button
                      className="text-button"
                      onClick={() => go(`yansit/${item.id}`)}
                    >
                      Notumu düzenle
                      <ArrowUpRight size={15} />
                    </button>
                    <button className="text-button" onClick={() => go("rotam")}>
                      Buna göre sonraki adım
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <Empty
          title="İlk deneyimin için yer hazır."
          description="Bir fırsatı seç, hazırlıklarını yap ve gerçekten denedikten sonra ne öğrendiğini kaydet. Sadece kaydetmek burayı doldurmaz."
          label="Rotama dön"
          onClick={() => go("rotam")}
        />
      )}
      {state.requests.length ? (
        <section className="panel requests-history">
          <SectionHead
            title="Öğretmeninle paylaştıkların"
            note="Rehber öğretmenin yalnızca burada gördüğün özeti ve talebi görür. Notların, değerlendirme cevapların ve ölçek sonuçların paylaşılmaz. Fikrini değiştirirsen paylaşımı geri çekebilirsin."
          />
          {[...state.requests].reverse().map((request) => (
            <div className="request-history" key={request.id}>
              <span className="icon-tile purple small">
                <MessageCircle size={18} />
              </span>
              <div>
                <strong>
                  {request.type === "ekip" ? "Ekip talebi" : "Görüşme talebi"}
                </strong>
                <small>
                  {formatDate(request.createdAt)} ·{" "}
                  {request.reply ? "Yanıtlandı" : "Öğretmen yanıtı bekleniyor"}
                </small>
                <p className="preserve-lines">{request.summary}</p>
                {request.reply ? (
                  <div className="teacher-reply">
                    <span className="eyebrow">REHBER ÖĞRETMENİNİN YANITI</span>
                    <p>{request.reply}</p>
                  </div>
                ) : null}
                <button
                  className="text-button withdraw-share"
                  onClick={() => {
                    setState((previous) => withdrawRequest(previous, request.id));
                    toast.success("Paylaşım geri çekildi.", {
                      description:
                        "Bu özet ve talep artık öğretmen görünümünde yer almıyor.",
                    });
                  }}
                >
                  Paylaşımı geri çek
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}

export function TeacherPage() {
  const { state, setState } = useApp();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const pending = state.requests.filter((request) => !request.reply);
  const answered = state.requests.filter((request) => request.reply);
  return (
    <>
      <PageHead
        eyebrow="REHBER ÖĞRETMEN · DEMO GÖRÜNÜMÜ"
        title="Bir görüşmeye hazır başlangıç."
        description="Yeni bir rapor yığını değil. Öğrencinin onayladığı özet ve birlikte atabileceğiniz sonraki adım."
      />
      <div className="teacher-context">
        <span className="icon-tile purple">
          <Users size={23} />
        </span>
        <div>
          <strong>{pending.length} talep yanıt bekliyor.</strong>
          <p>
            Bu prototipte yalnızca seçili demo öğrencisi var. Rol geçişi gerçek
            yetkilendirme değildir.
          </p>
        </div>
        <span className="pill purple">Okul içi</span>
      </div>
      <ClassSummaryPanel />
      <section>
        <SectionHead
          title="Senden bir yanıt bekleyenler"
          note="Öğrenci talep gönderdiğinde burada görünür; sessizlikten risk veya motivasyon sonucu çıkarılmaz."
        />
        {pending.length ? (
          <div className="teacher-requests">
            {pending.map((request) => (
              <article className="panel teacher-request" key={request.id}>
                <div className="teacher-request-top">
                  <span className="avatar">
                    {state.profile?.name.slice(0, 1)}
                  </span>
                  <div>
                    <strong>
                      {state.profile?.name} ·{" "}
                      {state.profile?.grade === "Hazırlık"
                        ? "Hazırlık"
                        : `${state.profile?.grade}. sınıf`}
                    </strong>
                    <small>
                      {request.type === "ekip"
                        ? "Okul içi ekip talebi"
                        : "Görüşme talebi"}{" "}
                      · {formatDate(request.createdAt)}
                    </small>
                  </div>
                  <span className="pill yellow">Yanıt bekliyor</span>
                </div>
                <div className="share-preview">
                  <span className="eyebrow">ÖĞRENCİNİN ONAYLADIĞI ÖZET</span>
                  <p className="preserve-lines">{request.summary}</p>
                  <small>Uygun zaman: {request.availability}</small>
                </div>
                <label className="field-label">
                  Öğrenciye yanıtın
                  <textarea
                    rows={3}
                    maxLength={1200}
                    value={drafts[request.id] ?? ""}
                    onInput={(event) => {
                      const reply = event.currentTarget.value;
                      setDrafts((previous) => ({
                        ...previous,
                        [request.id]: reply,
                      }));
                    }}
                    placeholder="Bir görüşme öner, doğru danışmana yönlendir veya gerekli bilgiyi iste."
                  />
                </label>
                <div className="teacher-quick-replies">
                  <button
                    className="text-button"
                    onClick={() =>
                      setDrafts((previous) => ({
                        ...previous,
                        [request.id]:
                          request.type === "ekip"
                            ? "Kulüp danışmanıyla görüşmeni öneriyorum. Uygun oturumu birlikte doğrulayalım; henüz bir ekibe atanmış değilsin."
                            : "Deneyim notlarını gördüm. İlk uygun rehberlik saatinde seçeneklerini birlikte değerlendirelim. Görüşme saatini ayrıca doğrulayacağız.",
                      }))
                    }
                  >
                    Örnek yanıtı düzenle
                    <Sparkles size={14} />
                  </button>
                </div>
                <button
                  className="button primary"
                  disabled={!drafts[request.id]?.trim()}
                  onClick={() => {
                    const reply = drafts[request.id]?.trim();
                    if (!reply) return;
                    setState((previous) => ({
                      ...previous,
                      requests: previous.requests.map((value) =>
                        value.id === request.id ? { ...value, reply } : value,
                      ),
                    }));
                    toast.success("Yanıt demo öğrencisine iletildi.", {
                      description: "Gerçek mesaj veya e-posta gönderilmedi.",
                      action: {
                        label: "Öğrencide gör",
                        onClick: () => go("deneyimlerim"),
                      },
                    });
                  }}
                >
                  Yanıtı demo öğrencisine kaydet
                  <ArrowRight size={17} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Henüz paylaşılmış bir talep yok."
            description="Öğrenci bir ekip talebi veya deneyim özeti paylaşınca burada görünür. Onaylamadığı notlar bu görünüme taşınmaz."
            label="Öğrenciye dön"
            onClick={() => go("rotam")}
          />
        )}
      </section>
      {answered.length ? (
        <section className="panel answered-requests">
          <SectionHead title="Yanıtladıkların" />
          {answered.map((request) => (
            <div key={request.id}>
              <CircleCheck size={20} />
              <span>
                <strong>
                  {request.type === "ekip" ? "Ekip talebi" : "Görüşme talebi"}
                </strong>
                <p>{request.reply}</p>
              </span>
            </div>
          ))}
        </section>
      ) : null}
      <section className="panel integration-note">
        <ShieldCheck size={24} />
        <div>
          <h3>Canlı sisteme geçişte</h3>
          <p>
            Okul hesabı, öğrenci–öğretmen yetkisi, paylaşım izinleri ve sınav
            aktarımı için gerçek entegrasyon gerekir. Bu demo bunlara bağlı
            değildir; KVKK uygunluğu veya bilimsel geçerlilik iddiası taşımaz.
          </p>
        </div>
      </section>
    </>
  );
}

export function DemoPage() {
  const { state, setState } = useApp();
  const [resetting, setResetting] = useState(false);
  return (
    <>
      <PageHead
        eyebrow="İDEATHON · SUNUM KUMANDASI"
        title="Fikir değil, çalışan bir döngü."
        description="Sorulardan kişisel rotaya; fırsattan hazırlık takvimine; deneyimden öğretmenle görüşmeye."
      />
      <section className="panel demo-personas">
        <SectionHead
          title="Hangi öğrencinin gözünden bakalım?"
          note="Senaryo seçimi mevcut demo kaydının yerine geçer. Wayweft ve gerçek Kariyer Küre verilerine dokunulmaz."
        />
        <div className="persona-grid">
          {Object.entries(personas).map(([id, profile]) => (
            <button
              key={id}
              className={`persona-card ${id}`}
              onClick={() => {
                setState({ ...freshState(), profile });
                toast.success(`${profile.name} senaryosu açıldı.`, {
                  description:
                    "Önceki demo temizlendi. Yeni bir rota başlangıcı.",
                });
                go("rotam");
              }}
            >
              <span className="persona-avatar">{profile.name.slice(0, 1)}</span>
              <span className="eyebrow">
                {profile.grade === "Hazırlık"
                  ? "HAZIRLIK"
                  : `${profile.grade}. SINIF`}
              </span>
              <h3>{profile.name}</h3>
              <p>{profile.target}</p>
              <small>
                {profile.interests
                  .map((field) => fieldLabels[field])
                  .join(" · ")}
                <br />
                Haftada {profile.hours} saat
              </small>
              <span className="text-button">
                Senaryoyu aç
                <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel demo-walkthrough">
        <SectionHead
          title="Üç dakikalık sunum akışı"
          note="En güçlü demo: tek öğrencinin birbirine bağlı hikâyesi."
        />
        <ol>
          {[
            [
              "Başlangıç",
              "Altı soruyu cevapla; sınıf, hedef ve erişim koşullarının rotayı nasıl değiştirdiğini göster.",
            ],
            [
              "İlk hareket",
              "Bir fırsatı incele. Önce kaydet; sonra hazırlık işlerini onaylayarak rotaya ekle.",
            ],
            [
              "Takvim",
              "Son tarih ile hazırlık oturumunun farklı olduğunu göster. Bir hazırlık tarihini değiştir.",
            ],
            [
              "Deneyim",
              "Hazırlık işlerini tamamla; deneyimi değerlendir. Sadece kaydetmenin başarı sayılmadığını anlat.",
            ],
            [
              "Birlikte karar",
              "Özeti onaylayıp paylaş. PDR görünümünden yanıt ver, öğrenciye geri dön.",
            ],
            [
              "11–12 örneği",
              "Ege senaryosunda aynı rotanın sınav ve bölüm araştırmasına yöneldiğini göster.",
            ],
          ].map(([title, description], i) => (
            <li key={title}>
              <span>{i + 1}</span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <div className="demo-info-grid">
        <section className="panel">
          <span className="eyebrow">GERÇEKTEN ÇALIŞAN</span>
          <h3>Birbirine bağlı durum.</h3>
          <ul>
            <li>Cevaplara göre kural tabanlı öneriler.</li>
            <li>Kaydetme, rotaya ekleme ve tamamlamanın ayrılması.</li>
            <li>Çift yönlü hazırlık takvimi ve .ics dışa aktarım.</li>
            <li>Deneyime göre sonraki önerilerin değişmesi.</li>
            <li>Onaylı öğretmen talebi ve öğrenciye yanıt.</li>
            <li>Yenilemede korunan tarayıcı kaydı.</li>
          </ul>
        </section>
        <section className="panel">
          <span className="eyebrow">SİMÜLASYON OLAN</span>
          <h3>Ne iddia etmiyoruz?</h3>
          <ul>
            <li>Canlı AI veya okul sistemi bağlı değil.</li>
            <li>Örnek okul etkinlikleri ve tarihleri gerçek kayıt değil.</li>
            <li>Demo rol geçişi gerçek yetkilendirme değil.</li>
            <li>Başvuru, e-posta veya bildirim gönderilmez.</li>
            <li>Netten yerleşme veya meslek uygunluğu tahmini yok.</li>
            <li>Bilimsel envanter puanları değiştirilmez.</li>
          </ul>
        </section>
      </div>
      <section className="panel demo-reset">
        <div>
          <h3>Temiz bir başlangıç.</h3>
          <p>Yalnızca bu projenin bu tarayıcıdaki demo kaydı temizlenir.</p>
        </div>
        {resetting ? (
          <div className="reset-actions">
            <span>Mevcut demo silinecek. Emin misin?</span>
            <button
              className="button secondary"
              onClick={() => setResetting(false)}
            >
              Vazgeç
            </button>
            <button
              className="button danger"
              onClick={() => {
                setState(freshState());
                toast("Demo sıfırlandı.");
                go("baslangic");
              }}
            >
              Evet, sıfırla
            </button>
          </div>
        ) : (
          <button
            className="button secondary"
            onClick={() => setResetting(true)}
          >
            <RotateCcw size={16} />
            Demoyu sıfırla
          </button>
        )}
      </section>
      <div className="demo-links">
        <a href="https://kariyerkurem.com/" target="_blank" rel="noreferrer">
          Kariyer Küre · marka ve mevcut ürün referansı
          <ExternalLink size={14} />
        </a>
        <span>
          Logo simgesi ve Urbanist yazı tipi kamuya açık Kariyer Küre
          kaynağından.
        </span>
      </div>
      {!state.profile ? (
        <button className="button primary" onClick={() => go("baslangic")}>
          Altı soruyla başla
          <ArrowRight size={16} />
        </button>
      ) : null}
    </>
  );
}

function ClassSummaryPanel() {
  const { state } = useApp();
  const summary = classSummary(state);
  return (
    <section className="panel class-summary">
      <SectionHead
        title="Sınıfın fırsat özeti"
        note={`${summary.className} · Yalnızca sayılar ve tarihler. Ad, not veya ölçek sonucu yok. Sayılar örnek veridir; demo öğrencinin kayıtları canlı eklenir.`}
      />
      <div className="class-summary-stats">
        <div>
          <strong>
            {summary.followingStudents}/{summary.students}
          </strong>
          <span>öğrenci bir fırsatı takip ediyor</span>
        </div>
        <div>
          <strong>{summary.teamSeekers}</strong>
          <span>öğrenci ekip arıyor</span>
        </div>
        <div>
          <strong>{summary.meetingRequests}</strong>
          <span>görüşme talebi yanıt bekliyor</span>
        </div>
      </div>
      {summary.rows.length ? (
        <ul className="class-summary-list">
          {summary.rows.map(({ item, count, days }) => (
            <li key={item.id}>
              <span>
                <strong>{item.title}</strong>
                <small>
                  Son başvuru {formatDate(item.deadline!, true)} · {days} gün
                </small>
              </span>
              <span className="pill purple">{count} öğrenci</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="class-summary-note">
        Öneri: Son tarihi yaklaşan fırsat için sınıf rehberlik saatinde 5 dakikalık bir hatırlatma yapılabilir.
      </p>
    </section>
  );
}
