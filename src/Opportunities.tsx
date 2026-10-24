import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { catalog, opportunityById } from "./catalog";
import {
  addReflection,
  createTrack,
  distinctReasons,
  eligibility,
  recommendations,
  setTask,
  toggleSaved,
} from "./engine";
import {
  DEMO_TODAY,
  fieldLabels,
  formatDate,
  kindLabels,
  modeLabels,
} from "./model";
import { CompetitionInfo, ProgressJournal } from "./CompetitionTracking";
import type { Kind, Opportunity, Reflection } from "./model";
import {
  Choice,
  Empty,
  IconTile,
  OpportunityMark,
  feeLabel,
  KindBadge,
  PageHead,
  SectionHead,
  go,
  useApp,
} from "./ui";

export function Opportunities({ initialKind }: { initialKind?: string }) {
  const { state, setState } = useApp();
  const [view, setView] = useState<"sana" | "hepsi" | "kayit">(
    initialKind ? "hepsi" : "sana",
  );
  const [kind, setKind] = useState<Kind | "all">(
    initialKind === "yarisma" ? "yarisma" : "all",
  );
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<keyof typeof modeLabels | "all">("all");
  const recommended = recommendations(state);
  const cardReasons = distinctReasons(recommended);
  const base =
    view === "sana"
      ? recommended.map((result) => result.item)
      : view === "kayit"
        ? catalog.filter((item) => state.saved.includes(item.id))
        : catalog;
  const items = base.filter(
    (item) =>
      (kind === "all" || item.kind === kind) &&
      (mode === "all" || item.mode === mode) &&
      `${item.title} ${item.provider} ${item.fields.map((field) => fieldLabels[field]).join(" ")}`
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")),
  );
  return (
    <>
      <PageHead
        eyebrow="MERAKINDAN BİR SONRAKİ ADIMA"
        title="Bir olasılıkla başla."
        description="İncele, kaydet. Sana uyarsa rotana ekle; hazırlığın ve tarihlerin bir araya gelsin."
      />
      <div className="catalog-toolbar">
        <div className="tabs" aria-label="Fırsat görünümü">
          {(
            [
              ["sana", "Sana göre"],
              ["hepsi", "Tüm fırsatlar"],
              [
                "kayit",
                `Kaydedilenler${state.saved.length ? ` · ${state.saved.length}` : ""}`,
              ],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              className={view === value ? "active" : ""}
              onClick={() => setView(value)}
              aria-pressed={view === value}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Fırsat ara"
            placeholder="Bir alan veya fırsat ara"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
      </div>
      <div className="filter-chips" aria-label="Fırsat türü">
        <button
          className={kind === "all" ? "active" : ""}
          onClick={() => setKind("all")}
          aria-pressed={kind === "all"}
        >
          Hepsi
        </button>
        {Object.entries(kindLabels).map(([value, label]) => (
          <button
            key={value}
            className={kind === value ? "active" : ""}
            onClick={() => {
              setKind(value as Kind);
              if (value === "yarisma") setView("hepsi");
            }}
            aria-pressed={kind === value}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="filter-chips mode-chips" aria-label="Katılım biçimi">
        <span className="chip-label">Katılım:</span>
        {(["all", "cevrimici", "yuzyuze", "hibrit"] as const).map((value) => (
          <button
            key={value}
            className={mode === value ? "active" : ""}
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
          >
            {value === "all" ? "Hepsi" : modeLabels[value]}
          </button>
        ))}
      </div>
      <div className="catalog-caption">
        <span>
          {items.length} seçenek
          {view === "sana"
            ? " · Cevapların ve son deneyimin dikkate alındı"
            : ""}
        </span>
        <span>Örnek etkinlikler etiketlidir.</span>
      </div>
      {items.length ? (
        <div className="catalog-grid">
          {items.map((item) => {
            const saved = state.saved.includes(item.id);
            const added = state.tracks.some(
              (track) => track.opportunityId === item.id,
            );
            const reason = cardReasons.get(item.id);
            const mismatch =
              view !== "sana" && state.profile
                ? eligibility(item, state.profile)[0]
                : undefined;
            return (
              <article key={item.id} className="panel opportunity-card">
                <div className="opportunity-top">
                  <OpportunityMark item={item} />
                  <button
                    className={`icon-button bookmark ${saved ? "saved" : ""}`}
                    aria-label={
                      saved
                        ? `${item.title} kayıttan çıkar`
                        : `${item.title} kaydet`
                    }
                    aria-pressed={saved}
                    onClick={() => {
                      setState((previous) => toggleSaved(previous, item.id));
                      toast.success(
                        saved
                          ? "Kaydedilenlerden çıkarıldı."
                          : "Fırsat kaydedildi.",
                        {
                          description:
                            !saved && item.deadline
                              ? `${item.demo ? "Örnek" : "Kaynaklı"} son tarih takvimine eklendi. Henüz rotana görev eklenmedi.`
                              : !saved
                                ? "Doğrulanmış bir tarih bulunmadığı için takvim etkinliği oluşturulmadı."
                                : added
                                  ? "Rotandaki çalışma ve ona bağlı tarihler korunuyor."
                                  : "Kayda bağlı tarih takibi de kaldırıldı.",
                          action:
                            !saved && item.deadline
                              ? {
                                  label: "Takvimi gör",
                                  onClick: () => go(`takvim/${item.deadline}`),
                                }
                              : undefined,
                        },
                      );
                    }}
                  >
                    <Bookmark
                      size={20}
                      fill={saved ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <KindBadge item={item} />
                {item.competitionStatus ? (
                  <span className="competition-status">
                    {item.competitionStatus === "open"
                      ? "Çağrı açık"
                      : "Yeni çağrıyı izle"}{" "}
                    · {feeLabel(item)}
                  </span>
                ) : null}
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="card-meta">
                  <span>
                    <Clock3 size={14} />
                    {item.hours <= 0.5
                      ? "25–30 dk"
                      : `${item.hours} sa / hafta`}
                  </span>
                  <span>
                    <MapPin size={14} />
                    {placeLabel(item)}
                  </span>
                </div>
                {reason && view === "sana" ? (
                  <div className="recommendation-reason">
                    <Sparkles size={14} />
                    <span>
                      <strong>Neden sana?</strong> {reason}
                    </span>
                  </div>
                ) : mismatch ? (
                  <div className="recommendation-reason mismatch">
                    <span>
                      <strong>Şu an sana uymuyor:</strong> {mismatch}
                    </span>
                  </div>
                ) : null}
                <div className="opportunity-bottom">
                  <span className={`source-badge ${item.demo ? "demo" : ""}`}>
                    {item.demo ? "Örnek etkinlik" : "Resmî kaynaklı"}
                    {added ? " · Rotanda" : ""}
                  </span>
                  <button
                    className="text-button"
                    onClick={() => go(`firsat/${item.id}`)}
                  >
                    İncele
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty
          title={
            view === "kayit"
              ? "İlk kaydın için yer hazır."
              : "Bu filtrelerde seçenek bulamadık."
          }
          description={
            view === "kayit"
              ? "Bir fırsattaki yer imiyle kısa listeni oluşturmaya başla."
              : "Aramanı veya tür filtresini değiştirebilirsin. Sana uymayan bir fırsatı uydurmayacağız."
          }
          label="Filtreleri temizle"
          onClick={() => {
            setView("hepsi");
            setKind("all");
            setQuery("");
          }}
        />
      )}
      <div className="bottom-source-note">
        <ShieldCheck size={16} />
        Demo katalog. Okul etkinlikleri ve tarihleri sunum için örnektir; gerçek
        başvuru yapılmaz.
      </div>
    </>
  );
}

export function OpportunityDetail({ id }: { id: string }) {
  const { state, setState } = useApp();
  const item = opportunityById(id);
  const [role, setRole] = useState(item?.roles[0] ?? "");
  const [indexes, setIndexes] = useState<number[]>([0, 1, 2]);
  const [teamOpen, setTeamOpen] = useState(false);
  const [availability, setAvailability] = useState("Hafta içi okul çıkışı");
  const [consent, setConsent] = useState(false);
  if (!item || !state.profile)
    return (
      <Empty
        title="Bu fırsat bulunamadı."
        description="Katalogdaki diğer seçeneklere bakabilirsin."
        label="Fırsatlara dön"
        onClick={() => go("firsatlar")}
      />
    );
  const track = state.tracks.find((value) => value.opportunityId === id);
  const reflection = state.reflections.find(
    (value) => value.opportunityId === id,
  );
  const saved = state.saved.includes(id);
  const issues = eligibility(item, state.profile);
  const reason = recommendations({
    ...state,
    tracks: state.tracks.filter((value) => value.opportunityId !== id),
    reflections: state.reflections.filter(
      (value) => value.opportunityId !== id,
    ),
  }).find((value) => value.item.id === id)?.reasons;
  const hasRequest = state.requests.some(
    (value) => value.opportunityId === id && value.type === "ekip",
  );
  const summary = `${state.profile.name}, “${item.title}” çalışmasında ${track?.role ?? role} rolünü denemek için okul içinde ekip arıyor. Uygun zaman: ${availability}.`;
  return (
    <>
      <button className="text-button back-link" onClick={() => go("firsatlar")}>
        <ArrowLeft size={17} />
        Fırsatlara dön
      </button>
      <div className="detail-grid">
        <div>
          <section className="panel detail-intro">
            <div className="detail-intro-top">
              <OpportunityMark item={item} />
              <span className={`source-badge ${item.demo ? "demo" : ""}`}>
                {item.demo
                  ? "Örnek okul etkinliği"
                  : "Resmî kaynaklı araştırma görevi"}
              </span>
            </div>
            <KindBadge item={item} />
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <div className="detail-facts">
              <span>
                <Clock3 size={17} />
                {item.hours <= 0.5
                  ? "25–30 dakika"
                  : `${item.hours} saat / hafta`}
              </span>
              <span>
                <MapPin size={17} />
                {item.access === "ev"
                  ? "Evden"
                  : item.access === "okul"
                    ? "Okul içinde"
                    : "Okul veya evden"}
              </span>
              <span>{feeLabel(item)}</span>
            </div>
            <div className="detail-outcome">
              <CheckCircle2 size={19} />
              <div>
                <strong>Bu çalışmanın sonunda</strong>
                <p>{item.outcome}</p>
              </div>
            </div>
          </section>
          {item.competitionStatus ? <CompetitionInfo id={id} /> : null}
          {track ? <ProgressJournal id={id} /> : null}
          {track ? (
            <section className="panel detail-work">
              <SectionHead
                title={
                  reflection ? "Tamamlanan hazırlığın" : "Hazırlık işlerin"
                }
                note="İşaretlemek yalnızca bu işi tamamlar. Katılımını ve ne öğrendiğini ayrıca kaydedersin."
              />
              <div className="editable-tasks">
                {track.tasks.map((task) => (
                  <div
                    className={`editable-task ${task.done ? "done" : ""}`}
                    key={task.id}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={task.done}
                        disabled={track.paused || !!reflection}
                        onChange={() => {
                          setState((previous) =>
                            setTask(previous, id, task.id, {
                              done: !task.done,
                            }),
                          );
                          toast.success(
                            !task.done
                              ? "Hazırlık işi tamamlandı."
                              : "Hazırlık işi yeniden açıldı.",
                          );
                        }}
                      />
                      <span>{task.title}</span>
                    </label>
                    <div className="task-schedule">
                      <CalendarDays size={14} />
                      <input
                        type="date"
                        aria-label={`${task.title} hazırlık tarihi`}
                        value={task.date}
                        disabled={!!reflection}
                        onInput={(event) => {
                          const date = event.currentTarget.value;
                          setState((previous) =>
                            setTask(previous, id, task.id, { date }),
                          );
                        }}
                      />
                      <input
                        type="time"
                        aria-label={`${task.title} hazırlık saati`}
                        value={task.time}
                        disabled={!!reflection}
                        onInput={(event) => {
                          const time = event.currentTarget.value;
                          setState((previous) =>
                            setTask(previous, id, task.id, { time }),
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {reflection ? (
                <div className="success-inline">
                  <CheckCircle2 size={20} />
                  <span>
                    Deneyimin kaydedildi.{" "}
                    <a href="#/deneyimlerim">Ne öğrendiğini gör.</a>
                  </span>
                </div>
              ) : track.tasks.every((task) => task.done) ? (
                <div className="reflection-cta">
                  <SproutIcon />
                  <div>
                    <h3>Hazırlıkların tamam. Deneyimin nasıl geçti?</h3>
                    <p>
                      Gerçekten yaptıysan ne öğrendiğini kaydet. Henüz
                      katılmadıysan bekleyebilirsin.
                    </p>
                  </div>
                  <button
                    className="button primary"
                    onClick={() => go(`yansit/${id}`)}
                  >
                    Deneyimimi kaydet
                    <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <p className="muted">
                  Tarihleri düzenlediğinde takvimin de güncellenir.
                </p>
              )}
            </section>
          ) : (
            <section className="panel detail-work">
              <SectionHead
                title="Rotana neler eklensin?"
                note="Hazırlık işlerini ve denemek istediğin rolü onayla."
              />
              <label className="field-label">
                Denemek istediğin rol
                <select
                  value={role}
                  onChange={(event) => setRole(event.currentTarget.value)}
                >
                  {item.roles.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <div className="task-checklist">
                {item.steps.map((step, i) => (
                  <label className="task-row" key={step}>
                    <input
                      type="checkbox"
                      checked={indexes.includes(i)}
                      onChange={() =>
                        setIndexes((previous) =>
                          previous.includes(i)
                            ? previous.filter((value) => value !== i)
                            : [...previous, i],
                        )
                      }
                    />
                    <span>{step}</span>
                  </label>
                ))}
              </div>
              {issues.length ? (
                <div className="eligibility-warning">
                  <strong>Şu anki tercihlerine tam uymuyor.</strong>
                  {issues.map((issue) => (
                    <p key={issue}>{issue}</p>
                  ))}
                  <a href="#/baslangic">Cevaplarımı düzenle</a>
                </div>
              ) : null}
              <button
                className="button primary"
                disabled={!indexes.length || !!issues.length}
                onClick={() => {
                  setState((previous) =>
                    createTrack(previous, id, role, indexes),
                  );
                  toast.success("Rotana eklendi. Hazırlık takvimin de hazır.", {
                    description:
                      "Başlangıç tarihleri öneridir; aşağıdaki işlerden değiştirebilirsin.",
                    action: { label: "Rotama git", onClick: () => go("rotam") },
                  });
                }}
              >
                Rotama ekle
                <ArrowRight size={18} />
              </button>
              <small className="muted">
                Başvuru yapılmaz. Seçtiğin hazırlık işleri için düzenlenebilir
                örnek oturumlar oluşur.
              </small>
            </section>
          )}
          {track && !reflection && ["kulup", "proje", "yarisma"].includes(item.kind) ? (
            <section className="panel team-panel">
              <SectionHead
                title="Birlikte denemek ister misin?"
                note="Yalnızca okul içi, öğretmen onaylı ekip talebi."
              />
              {hasRequest ? (
                <div className="success-inline">
                  <Users size={20} />
                  <span>
                    Ekip talebin rehber öğretmeninde. Yanıtı deneyimlerim
                    bölümünde görebilirsin.
                  </span>
                </div>
              ) : (
                <>
                  <button
                    className="button secondary"
                    onClick={() => setTeamOpen(!teamOpen)}
                    aria-expanded={teamOpen}
                  >
                    <Users size={17} />
                    Ekip talebini hazırla
                  </button>
                  {teamOpen ? (
                    <div className="team-form">
                      <label className="field-label">
                        Uygun zamanın
                        <input
                          value={availability}
                          maxLength={150}
                          onInput={(event) => {
                            setAvailability(event.currentTarget.value);
                            setConsent(false);
                          }}
                        />
                      </label>
                      <div className="share-preview">
                        <span className="eyebrow">
                          ÖĞRETMENİNİN GÖRECEĞİ ÖZET
                        </span>
                        <p>{summary}</p>
                      </div>
                      <label className="check-label">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) =>
                            setConsent(event.currentTarget.checked)
                          }
                        />
                        <span>
                          Bu özetin demo rehber öğretmen görünümünde
                          paylaşılmasını onaylıyorum.
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
                                opportunityId: id,
                                type: "ekip",
                                summary,
                                availability,
                                createdAt: DEMO_TODAY,
                              },
                            ],
                          }));
                          toast.success(
                            "Ekip talebin öğretmen görünümüne gönderildi.",
                            {
                              action: {
                                label: "PDR görünümü",
                                onClick: () => go("ogretmen"),
                              },
                            },
                          );
                        }}
                      >
                        Talebi paylaş
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          ) : null}
        </div>
        <aside className="detail-sidebar">
          {track ? (
            <div className="panel added-receipt">
              <span className="receipt-icon">
                <Check size={23} />
              </span>
              <h3>Bu çalışma rotanda.</h3>
              <p>
                {track.tasks.length} hazırlık işi takvimine bağlı. Tarihleri
                kendine göre düzenleyebilirsin.
              </p>
              <button className="button primary" onClick={() => go("rotam")}>
                Rotamda gör
                <ArrowRight size={16} />
              </button>
              <button className="text-button" onClick={() => go("takvim")}>
                <CalendarDays size={16} />
                Takvimde gör
              </button>
            </div>
          ) : null}
          <section className="panel why-card">
            <span className="eyebrow">
              <Sparkles size={13} /> NEDEN SANA?
            </span>
            {reason?.length ? (
              reason.slice(0, 3).map((value) => (
                <p key={value}>
                  <Check size={15} />
                  {value}
                </p>
              ))
            ) : (
              <p>
                Bu seçeneği katalogdan inceliyorsun. Sınıf ve erişim koşullarını
                kontrol ederek karar verebilirsin.
              </p>
            )}
            <div className="detail-source">
              <span className="eyebrow">KAYNAK & TARİHLER</span>
              <strong>{item.provider}</strong>
              {item.deadline ? (
                <p>
                  Son tarih: {formatDate(item.deadline, true)} ·{" "}
                  {item.demo ? "Örnek" : "Resmî kaynaklı"}
                </p>
              ) : (
                <p>Doğrulanmış bir başvuru tarihi eklenmedi.</p>
              )}
              {item.eventDate ? (
                <p>
                  {item.eventLabel ?? "Etkinlik"}:{" "}
                  {formatDate(item.eventDate, true)} ·{" "}
                  {item.demo ? "Örnek" : "Resmî kaynaklı"}
                </p>
              ) : null}
              {item.source ? (
                <a
                  className="text-button"
                  href={item.source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Resmî kaynağı aç
                  <ExternalLink size={15} />
                </a>
              ) : (
                <small>
                  Okul etkinliği, kurum ve tarihler ideathon senaryosu için
                  örnektir.
                </small>
              )}
            </div>
            <button
              className={`button secondary full ${saved ? "saved" : ""}`}
              onClick={() => {
                setState((previous) => toggleSaved(previous, id));
                toast(saved ? "Kaydedilenlerden çıkarıldı." : "Kaydedildi.", {
                  description:
                    item.deadline && !saved
                      ? `${item.demo ? "Örnek" : "Kaynaklı"} son tarih takvimine geldi; henüz görev eklenmedi.`
                      : !item.deadline && !saved
                        ? "Tarih bilinmediği için takvim etkinliği eklenmedi."
                        : track
                          ? "Rotandaki işler ve tarihler korunuyor."
                          : "Kayda bağlı tarihler de kaldırıldı.",
                });
              }}
            >
              <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
              {saved ? "Kaydedildi" : "Sonra bakmak için kaydet"}
            </button>
          </section>
          <p className="sidebar-disclaimer">
            <ShieldCheck size={16} />
            Karar senin. Bir öneri yeteneğin, mesleğin veya geleceğin hakkında
            kesin bir sonuç değildir.
          </p>
        </aside>
      </div>
    </>
  );
}
function SproutIcon() {
  return (
    <span className="icon-tile mint">
      <CheckCircle2 size={22} />
    </span>
  );
}

export function ReflectionPage({ id }: { id: string }) {
  const { state, setState } = useApp();
  const existing = state.reflections.find((item) => item.opportunityId === id);
  const [liked, setLiked] = useState(existing?.liked ?? "");
  const [blocker, setBlocker] = useState(existing?.blocker ?? "");
  const [next, setNext] = useState<Reflection["next"]>(
    existing?.next ?? "devam",
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const item = opportunityById(id);
  const track = state.tracks.find((value) => value.opportunityId === id);
  if (!item || !track || !track.tasks.every((task) => task.done))
    return (
      <Empty
        title="Önce çalışmana geri dönelim."
        description="Deneyimini kaydetmeden önce seçtiğin hazırlık işlerini kontrol et. Henüz yapmadığın bir çalışmayı tamamlandı saymayacağız."
        label="Rotama dön"
        onClick={() => go("rotam")}
      />
    );
  return (
    <>
      <button
        className="text-button back-link"
        onClick={() => go(`firsat/${id}`)}
      >
        <ArrowLeft size={17} />
        Çalışmaya dön
      </button>
      <PageHead
        eyebrow="BİR DENEYİM. YENİ BİR GÖZLEM."
        title="Sende ne bıraktı?"
        description="Bir şeyi sevmediğini fark etmek de değerli. Burada doğru cevap yok."
      />
      <form
        className="panel reflection-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!liked || !blocker) return;
          setState((previous) =>
            addReflection(previous, {
              opportunityId: id,
              liked,
              blocker,
              next,
              note: note.trim(),
              date: DEMO_TODAY,
            }),
          );
          toast.success("Deneyimin kaydedildi.", {
            description:
              "Ne öğrendiğin geçmişine eklendi. Sonraki öneriler bu tercihini de dikkate alıyor.",
          });
          go("deneyimlerim");
        }}
      >
        <div className="reflection-item">
          <IconTile kind={item.kind} accent={item.accent} small />
          <span>
            <small>{track.role} rolü</small>
            <strong>{item.title}</strong>
          </span>
        </div>
        <fieldset>
          <legend>01 · En çok hangi kısmı sevdin?</legend>
          <div className="filter-chips">
            {[
              "Araştırmak",
              "Üretmek",
              "Anlatmak",
              "Ekip çalışması",
              "Henüz emin değilim",
            ].map((value) => (
              <button
                type="button"
                key={value}
                className={liked === value ? "active" : ""}
                aria-pressed={liked === value}
                onClick={() => setLiked(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>02 · Seni ne zorladı?</legend>
          <div className="filter-chips">
            {[
              "İşin kendisi",
              "Zaman ayırmak",
              "Kaynak veya erişim",
              "Ekip bulmak",
              "Belirgin bir engel yoktu",
            ].map((value) => (
              <button
                type="button"
                key={value}
                className={blocker === value ? "active" : ""}
                aria-pressed={blocker === value}
                onClick={() => setBlocker(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>03 · Bundan sonra ne olsun?</legend>
          <div className="next-grid">
            {(
              [
                ["devam", "Aynı alanda devam edeyim"],
                ["rol", "Başka bir rol deneyeyim"],
                ["baska", "Başka bir alan keşfedeyim"],
                ["ara", "Şimdilik ara vereyim"],
              ] as const
            ).map(([value, title]) => (
              <Choice
                key={value}
                selected={next === value}
                title={title}
                onClick={() => setNext(value)}
              />
            ))}
          </div>
        </fieldset>
        <label className="field-label">
          Kendine bir not{" "}
          <small>İsteğe bağlı · link ekleyebilirsin; dosya yükleme yok</small>
          <textarea
            rows={3}
            value={note}
            maxLength={1200}
            onInput={(event) => setNote(event.currentTarget.value)}
            placeholder="Ne ürettin, ne öğrendin, bir dahaki sefere neyi değiştirmek istersin?"
          />
        </label>
        <div className="reflection-preview">
          <span className="eyebrow">GEÇMİŞİNE EKLENECEK GÖZLEM</span>
          <p>
            {liked
              ? `“${liked}” kısmını sevdiğini söyledin.`
              : "Seçimlerin burada özetlenecek."}{" "}
            {blocker && blocker !== "Belirgin bir engel yoktu"
              ? `Zorlayan konu: ${blocker.toLocaleLowerCase("tr-TR")}.`
              : ""}
          </p>
          <small>
            Bu senin gözlemin; yetenek puanın veya envanter sonucun değildir.
            Öğretmeninle kendiliğinden paylaşılmaz.
          </small>
        </div>
        <button
          type="submit"
          className="button primary"
          disabled={!liked || !blocker}
        >
          Onayla ve deneyimimi kaydet
          <Check size={18} />
        </button>
      </form>
    </>
  );
}

/** A1 · Kartta katılım biçimi ve şehir; il kısıtı varsa açıkça yazılır. */
function placeLabel(item: Opportunity) {
  const base = item.mode
    ? modeLabels[item.mode]
    : item.access === "okul"
      ? "Okul içinde"
      : item.access === "ev"
        ? "Evden"
        : "Okul / ev";
  if (item.onlyCities?.length)
    return `${base} · Yalnızca ${item.onlyCities.join(", ")}`;
  return item.city ? `${base} · ${item.city}` : base;
}
