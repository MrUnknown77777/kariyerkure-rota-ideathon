import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Compass,
  Flag,
  GraduationCap,
  Layers,
  Pause,
  Play,
  Plus,
  Settings2,
  Sparkles,
  Sprout,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { opportunityById } from "./catalog";
import { calendarEvents, recommendations, setTask } from "./engine";
import {
  DEMO_TODAY,
  fieldLabels,
  formatDate,
  goalLabels,
  isSenior,
  stage,
} from "./model";
import type { ExamRecord, Track } from "./model";
import {
  Empty,
  OpportunityMark,
  feeLabel,
  PageHead,
  SectionHead,
  go,
  useApp,
} from "./ui";
import TargetPicker from "./TargetPicker";
import { selectedDepartments, selectedUniversities } from "./targets";

export function RoutePage() {
  const { state, setState } = useApp();
  const profile = state.profile;
  const [showMap, setShowMap] = useState(false);
  if (!profile) return null;
  const completed = new Set(
    state.reflections.map((item) => item.opportunityId),
  );
  const active = state.tracks.filter(
    (track) => !completed.has(track.opportunityId),
  );
  const nextTrack = active.find((track) => !track.paused);
  const suggested = recommendations(state);
  const first = suggested[0];
  const nextTask = nextTrack?.tasks.find((task) => !task.done);
  const readyReflection =
    nextTrack && nextTrack.tasks.every((task) => task.done);
  const events = calendarEvents(state)
    .filter((event) => !event.done && !event.paused && event.date >= DEMO_TODAY)
    .slice(0, 3);
  const replies = state.requests.filter((request) => request.reply);

  return (
    <>
      <PageHead
        eyebrow={`${profile.grade === "Hazırlık" ? "HAZIRLIK" : `${profile.grade}. SINIF`} · ${stage(profile).toLocaleUpperCase("tr-TR")}`}
        title={`Kendi yolun, ${profile.name}.`}
        description="Her şeyi bugün çözmen gerekmiyor. Bir sonraki adımın burada."
        action={
          <button className="button secondary" onClick={() => go("hedefim")}>
            <Settings2 size={16} />
            Tercihlerim
          </button>
        }
      />
      <section className="route-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="live-dot" />
            {nextTrack
              ? readyReflection
                ? "BİR DENEYİMİ GERİDE BIRAKTIN"
                : "ŞİMDİKİ ADIMIN"
              : state.reflections.length
                ? "DENEYİMİNDEN SONRA"
                : "ROTANIN İLK ADIMI"}
          </span>
          <h2>
            {nextTrack
              ? readyReflection
                ? "Yaptığın şeyden ne öğrendin?"
                : (nextTask?.title ?? "Çalışmana geri dön.")
              : first
                ? first.item.title
                : "Bir sonraki yönü sen seç."}
          </h2>
          <p>
            {nextTrack
              ? readyReflection
                ? "Hazırlık işlerini tamamladın. Deneyimini kaydet; sıradaki seçeneği ne öğrendiğine göre bulalım."
                : `${opportunityById(nextTrack.opportunityId)?.title} için hazırlığın devam ediyor.`
              : first
                ? first.reasons[0]
                : "Ara verebilir, tercihlerini değiştirebilir veya tüm fırsatlara bakabilirsin."}
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() =>
                go(
                  nextTrack
                    ? readyReflection
                      ? `yansit/${nextTrack.opportunityId}`
                      : `firsat/${nextTrack.opportunityId}`
                    : first
                      ? `firsat/${first.item.id}`
                      : "firsatlar",
                )
              }
            >
              {nextTrack
                ? readyReflection
                  ? "Deneyimimi kaydet"
                  : "Adımıma devam et"
                : first
                  ? "İlk adımı incele"
                  : "Fırsatları keşfet"}
              <ArrowRight size={18} />
            </button>
            <span>
              {nextTrack
                ? `${nextTrack.tasks.filter((task) => task.done).length}/${nextTrack.tasks.length} hazırlık işi tamamlandı`
                : "Eklemek için önce sen onaylarsın."}
            </span>
          </div>
        </div>
        <div className="hero-route-art" aria-hidden="true">
          <svg viewBox="0 0 310 250">
            <path
              d="M69 204C38 142 243 186 218 115S71 125 106 48"
              fill="none"
              stroke="#ded8f5"
              strokeWidth="34"
              strokeLinecap="round"
            />
            <path
              d="M69 204C38 142 243 186 218 115S71 125 106 48"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeDasharray="4 9"
            />
            <circle
              cx="69"
              cy="204"
              r="24"
              fill="#e9f5ed"
              stroke="white"
              strokeWidth="7"
            />
            <path
              d="m60 204 6 6 12-14"
              stroke="#4d8e6c"
              strokeWidth="2.5"
              fill="none"
            />
            <circle
              cx="218"
              cy="132"
              r="29"
              fill="#6749dc"
              stroke="white"
              strokeWidth="8"
            />
            <path
              d="m209 132 7 7 13-15"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
            />
            <circle
              cx="106"
              cy="48"
              r="22"
              fill="#f1cf90"
              stroke="white"
              strokeWidth="7"
            />
            <path
              d="M106 38v20m0-19 10 4-10 5"
              fill="none"
              stroke="#7b5928"
              strokeWidth="1.8"
            />
          </svg>
          <span className="art-note">
            Bir adım.
            <br />
            <b>Yeni bir olasılık.</b>
          </span>
        </div>
      </section>
      <div className="route-content-grid">
        <div className="route-main-column">
          <section className="panel route-overview">
            <div className="section-head">
              <div>
                <span className="eyebrow">KİŞİSEL ROTAN</span>
                <h2>{profile.target || goalLabels[profile.goal]}</h2>
              </div>
              <span className="pill purple">{stage(profile)}</span>
            </div>
            <div className="route-milestones">
              <div className="milestone done">
                <span>
                  <Check size={17} />
                </span>
                <strong>Başlangıcını seçtin</strong>
                <small>İlgin, hedefin, imkânların</small>
              </div>
              <div className={`milestone ${active.length ? "current" : ""}`}>
                <span>{active.length ? <Sparkles size={17} /> : "2"}</span>
                <strong>
                  {isSenior(profile) ? "Hazırlığını düzenle" : "Bir şey dene"}
                </strong>
                <small>
                  {active.length
                    ? `${active.length} çalışma rotanda`
                    : "İlk adımı sen ekle"}
                </small>
              </div>
              <div className={`milestone ${completed.size ? "done" : ""}`}>
                <span>{completed.size ? <Check size={17} /> : "3"}</span>
                <strong>
                  {isSenior(profile)
                    ? "Kararını besle"
                    : "Deneyiminden yön bul"}
                </strong>
                <small>
                  {completed.size
                    ? `${completed.size} deneyim notun var`
                    : "Ne öğrendiğini yanında taşı"}
                </small>
              </div>
            </div>
            <button
              className="text-button"
              aria-expanded={showMap}
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? "Rotanın devamını gizle" : "Rotanın devamını gör"}
              <ChevronRight size={16} className={showMap ? "rotate-90" : ""} />
            </button>
            {showMap ? (
              <div className="future-map">
                <div>
                  <Flag size={18} />
                  <span>
                    <strong>
                      {isSenior(profile)
                        ? "Seçeneklerini karşılaştır"
                        : "Bir hedefte derinleş"}
                    </strong>
                    <small>
                      {isSenior(profile)
                        ? "Bölüm dersleri, ilgili sınavlar ve gerçek deneyimlerin birlikte."
                        : "Seçtiğin alanda bir proje, araştırma veya ekip çalışması."}
                    </small>
                  </span>
                </div>
                <div>
                  <Users size={18} />
                  <span>
                    <strong>Gerekince birlikte değerlendir</strong>
                    <small>
                      Rehber öğretmeninle paylaşacağın özeti önce sen görürsün.
                    </small>
                  </span>
                </div>
                <p>
                  Bunlar zorunlu görevler değil. Rotan, seçtiklerin ve
                  deneyimlerinle değişir.
                </p>
              </div>
            ) : null}
          </section>
          {active.length ? (
            <section>
              <SectionHead
                title="Üzerinde çalıştıkların"
                note="Seçtiğin işler burada. Öneriler kendiliğinden göreve dönüşmez."
                link="Fırsat ekle"
                onClick={() => go("firsatlar")}
              />
              <div className="track-list">
                {active.map((track) => (
                  <TrackCard key={track.opportunityId} track={track} />
                ))}
              </div>
            </section>
          ) : null}
          {isSenior(profile) ? <AcademicPanel /> : null}
          <section className="competition-section">
            <SectionHead
              title="Hedefinden yarışmaya"
              note="Gerçek çağrılar. Önce koşulları incele; sonra hazırlanmayı seç."
              link="Yarışmaları gör"
              onClick={() => go("firsatlar/yarisma")}
            />
            <div className="suggestion-grid">
              {suggested
                .filter(({ item }) => item.kind === "yarisma")
                .slice(0, 2)
                .map(({ item, reasons }) => (
                  <button
                    className="panel suggestion-card"
                    key={item.id}
                    onClick={() => go(`firsat/${item.id}`)}
                  >
                    <div className="suggestion-top">
                      <OpportunityMark item={item} />
                      <span className="source-badge">
                        {item.competitionStatus === "open"
                          ? "Çağrı açık"
                          : "Yeni çağrıyı izle"}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{reasons[0]}</p>
                    <span className="suggestion-meta">
                      {item.deadline
                        ? `Son tarih · ${formatDate(item.deadline)}`
                        : "Yeni dönem tarihi doğrulanmadı"}{" "}
                      · {feeLabel(item)}
                    </span>
                  </button>
                ))}
            </div>
            {!suggested.some(({ item }) => item.kind === "yarisma") ? (
              <p className="muted">
                Tercihlerinle örtüşen yeni yarışma yok. Tüm katalogda ücret ve
                katılım koşullarını inceleyebilirsin.
              </p>
            ) : null}
          </section>
          <section>
            <SectionHead
              title={
                state.reflections.length
                  ? "Deneyiminden sonra sana göre"
                  : "Sana göre başlangıçlar"
              }
              note={
                state.reflections.length
                  ? "Son değerlendirmene göre sıralandı. Hiçbiri zorunlu değil."
                  : `${profile.interests.map((field) => fieldLabels[field]).join(" · ")} · Haftada ${profile.hours} saat`
              }
              link="Tüm fırsatlar"
              onClick={() => go("firsatlar")}
            />
            <div className="suggestion-grid">
              {suggested
                .filter(({ item }) => item.kind !== "yarisma")
                .slice(0, 2)
                .map(({ item, reasons }) => (
                  <button
                    className="panel suggestion-card"
                    key={item.id}
                    onClick={() => go(`firsat/${item.id}`)}
                  >
                    <div className="suggestion-top">
                      <OpportunityMark item={item} />
                      <ArrowUpRight size={20} />
                    </div>
                    <span className="eyebrow">{item.provider}</span>
                    <h3>{item.title}</h3>
                    <p>{reasons[0]}</p>
                    <span className="suggestion-meta">
                      {item.hours <= 0.5
                        ? "25–30 dakika"
                        : `${item.hours} saat / hafta`}
                      <i />
                      {feeLabel(item)}
                      {item.demo ? <small>Örnek etkinlik</small> : null}
                    </span>
                  </button>
                ))}
            </div>
            {!suggested.length ? (
              <Empty
                title="Şu an yeni bir uygun öneri yok."
                description="Rotandaki çalışmaları sürdürebilir veya tercihlerini değiştirebilirsin."
                label="Tercihlerimi düzenle"
                onClick={() => go("baslangic")}
              />
            ) : null}
          </section>
        </div>
        <aside className="route-right-column">
          <section className="panel goal-card">
            <span className="eyebrow">BUGÜNKÜ YÖNÜN</span>
            <span className="goal-icon">
              <Target size={23} />
            </span>
            <h3>{goalLabels[profile.goal]}</h3>
            <div className="goal-targets">
              {selectedDepartments(profile).map((item) => (
                <span className="target-department" key={item.id}>
                  {item.name}
                </span>
              ))}
              <div className="university-strip">
                {selectedUniversities(profile).map((item) => (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    key={item.id}
                    title={`${item.name} · Resmî site`}
                  >
                    <img src={`/assets/logos/${item.logo}`} alt="" />
                    <span>{item.short}</span>
                  </a>
                ))}
              </div>
            </div>
            <button className="text-button" onClick={() => go("hedefim")}>
              Bölüm & üniversite hedeflerim <ArrowUpRight size={15} />
            </button>
            <p>
              {profile.interests.map((field) => fieldLabels[field]).join(" & ")}
            </p>
            <div className="goal-tags">
              <span>{profile.hours} saat / hafta</span>
              <span>
                {profile.freeOnly
                  ? "Ücretsiz seçenekler"
                  : "Maliyetler görünür"}
              </span>
            </div>
            <button className="text-button" onClick={() => go("baslangic")}>
              6 cevabımı düzenle
              <ArrowUpRight size={15} />
            </button>
          </section>
          <section className="panel dates-card">
            <SectionHead
              title="Yaklaşanlar"
              link="Takvim"
              onClick={() => go("takvim")}
            />
            {events.length ? (
              events.map((event) => (
                <button
                  className="mini-event"
                  key={event.id}
                  onClick={() => go(`takvim/${event.date}`)}
                >
                  <OpportunityMark
                    item={opportunityById(event.opportunityId)!}
                    small
                  />
                  <span>
                    <strong>{event.title}</strong>
                    <small>
                      {formatDate(event.date)} ·{" "}
                      {event.kind === "task"
                        ? "Hazırlık oturumu"
                        : event.kind === "deadline"
                          ? "Son tarih"
                          : (event.label ?? "Etkinlik")}
                    </small>
                  </span>
                </button>
              ))
            ) : (
              <div className="quiet-empty">
                <CalendarDays size={24} />
                <p>
                  Kaydettiğin fırsatların tarihleri ve planladığın hazırlıklar
                  burada buluşur.
                </p>
              </div>
            )}
            <small className="demo-caption">Sunum takvimi · 24 Ekim 2026</small>
          </section>
          {replies.length ? (
            <section className="panel teacher-note">
              <span className="eyebrow">REHBER ÖĞRETMENİNDEN</span>
              <Users size={24} />
              <p>{replies.at(-1)?.reply}</p>
              <button
                className="text-button"
                onClick={() => go("deneyimlerim")}
              >
                Paylaşımlarıma bak
                <ArrowRight size={15} />
              </button>
            </section>
          ) : (
            <section className="gentle-note">
              <Sprout size={22} />
              <h3>Yön değiştirmek de ilerlemektir.</h3>
              <p>
                Bir şeyi sevmediğini fark etmen de değerli. Burada tek bir doğru
                yol yok.
              </p>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function TrackCard({ track }: { track: Track }) {
  const { state, setState } = useApp();
  const item = opportunityById(track.opportunityId)!;
  const [removing, setRemoving] = useState(false);
  const done = track.tasks.filter((task) => task.done).length;
  return (
    <article className={`panel track-card ${track.paused ? "paused" : ""}`}>
      <div className="track-card-top">
        <OpportunityMark item={item} small />
        <div>
          <span className="eyebrow">
            {track.paused
              ? "ARA VERİLDİ"
              : `${track.role.toLocaleUpperCase("tr-TR")} · ROTANDA`}
          </span>
          <h3>{item.title}</h3>
        </div>
        <button
          className="icon-button"
          aria-label={track.paused ? "Çalışmaya devam et" : "Çalışmaya ara ver"}
          onClick={() => {
            setState((previous) => ({
              ...previous,
              tracks: previous.tracks.map((value) =>
                value.opportunityId === item.id
                  ? { ...value, paused: !value.paused }
                  : value,
              ),
            }));
            toast(
              track.paused ? "Çalışma yeniden aktif." : "Çalışmaya ara verdin.",
              { description: "Notların ve hazırlık işlerin korunuyor." },
            );
          }}
        >
          {track.paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      </div>
      {track.participation ? (
        <span className="competition-status">
          {
            {
              arastiriyorum: "İnceliyorsun",
              hazirlaniyorum: "Hazırlanıyorsun",
              basvurdum: "Başvurdun · kendi beyanın",
              katildim: "Katıldın · kendi beyanın",
            }[track.participation]
          }{" "}
          <button
            className="text-button"
            onClick={() => go(`firsat/${item.id}`)}
          >
            Takibi güncelle →
          </button>
        </span>
      ) : null}
      {track.updates?.length ? (
        <p className="track-update">Son notun: {track.updates.at(-1)?.text}</p>
      ) : null}
      <div className="task-checklist">
        {track.tasks.map((task) => (
          <label
            key={task.id}
            className={`task-row ${task.done ? "done" : ""}`}
          >
            <input
              type="checkbox"
              checked={task.done}
              disabled={track.paused}
              onChange={() => {
                setState((previous) =>
                  setTask(previous, item.id, task.id, { done: !task.done }),
                );
                if (!task.done)
                  toast.success("Hazırlık işi tamamlandı.", {
                    description:
                      "Bu, katılımının veya deneyiminin tamamlandığı anlamına gelmez.",
                  });
              }}
            />
            <span>{task.title}</span>
            <small>{formatDate(task.date)}</small>
          </label>
        ))}
      </div>
      <div className="track-card-footer">
        <span>
          {done}/{track.tasks.length} hazırlık işi
        </span>
        <button
          className="text-button"
          onClick={() =>
            go(
              done === track.tasks.length
                ? `yansit/${item.id}`
                : `firsat/${item.id}`,
            )
          }
        >
          {done === track.tasks.length ? "Deneyimimi kaydet" : "Çalışmayı aç"}
          <ArrowRight size={16} />
        </button>
        <button
          className="icon-button remove-track"
          aria-label={`${item.title} rotadan çıkar`}
          onClick={() => setRemoving(!removing)}
        >
          <Trash2 size={15} />
        </button>
      </div>
      {removing ? (
        <div className="inline-confirm">
          <span>
            Hazırlık işleri de rotadan çıkarılacak. Fırsat kaydedilenlerde
            kalır.
          </span>
          <button className="text-button" onClick={() => setRemoving(false)}>
            Vazgeç
          </button>
          <button
            className="button danger small"
            onClick={() => {
              setState((previous) => ({
                ...previous,
                tracks: previous.tracks.filter(
                  (value) => value.opportunityId !== item.id,
                ),
              }));
              toast("Çalışma rotandan çıkarıldı.");
            }}
          >
            Çıkar
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function AcademicPanel() {
  const { state, setState } = useApp();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    date: DEMO_TODAY,
    type: "TYT" as "TYT" | "AYT",
    source: "Okul denemesi A · örnek",
    math: "18",
    language: "25",
    science: "10",
    social: "12",
  });
  const [error, setError] = useState("");
  function add() {
    const keys = ["math", "language", "science", "social"] as const;
    const limits = form.type === "TYT" ? [40, 40, 20, 20] : [40, 40, 40, 40];
    if (
      !form.source.trim() ||
      !form.date ||
      keys.some(
        (key, i) =>
          !form[key].trim() ||
          !Number.isFinite(Number(form[key])) ||
          Number(form[key]) < -limits[i] / 4 ||
          Number(form[key]) > limits[i],
      )
    ) {
      setError(
        "Kaynak ve tarihi doldur; netleri seçtiğin testin geçerli aralığında yaz.",
      );
      return;
    }
    const item: ExamRecord = {
      id: crypto.randomUUID(),
      ...form,
      source: form.source.trim(),
      math: Number(form.math),
      language: Number(form.language),
      science: Number(form.science),
      social: Number(form.social),
    };
    setState((previous) => ({ ...previous, exams: [...previous.exams, item] }));
    setShow(false);
    setError("");
    toast.success("Örnek deneme kaydı eklendi.", {
      description:
        "Farklı sınavlar doğrudan karşılaştırılmaz; yerleşme tahmini yapılmaz.",
    });
  }
  return (
    <section className="panel academic-panel">
      {state.profile && selectedDepartments(state.profile).length ? (
        <div className="academic-targets">
          <span className="eyebrow">HEDEFİNLE BAĞLANTILI HAZIRLIK</span>
          {selectedDepartments(state.profile).map((item) => (
            <p key={item.id}>
              <strong>
                {item.name} · {item.exam}
              </strong>
              <br />
              {item.preparation}
            </p>
          ))}
          <a
            className="text-button"
            href="https://yokatlas.yok.gov.tr/"
            target="_blank"
            rel="noreferrer"
          >
            Program koşullarını YÖK Atlas’ta doğrula ↗
          </a>
        </div>
      ) : null}
      <SectionHead
        title="Akademik hazırlığın"
        note="İlgin ayrı, sınav durumun ayrı. İkisini birlikte değerlendirebilirsin."
        link={show ? "Kapat" : "Deneme ekle"}
        onClick={() => setShow(!show)}
      />
      {state.exams.length ? (
        <div className="exam-records">
          {state.exams.map((item) => (
            <div key={item.id}>
              <GraduationCap size={20} />
              <span>
                <strong>
                  {item.type} · {item.source}
                </strong>
                <small>
                  {formatDate(item.date)} · Matematik {item.math} ·{" "}
                  {item.type === "TYT" ? "Türkçe" : "TDE–Sosyal 1"}{" "}
                  {item.language} · Fen {item.science} ·{" "}
                  {item.type === "TYT" ? "Sosyal" : "Sosyal 2"} {item.social}
                </small>
              </span>
              <button
                className="icon-button"
                aria-label="Deneme kaydını sil"
                onClick={() =>
                  setState((previous) => ({
                    ...previous,
                    exams: previous.exams.filter(
                      (value) => value.id !== item.id,
                    ),
                  }))
                }
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">
          Henüz deneme kaydın yok. Bir örnek kayıt ekleyerek okuldan veri
          akışını canlandırabilirsin.
        </p>
      )}
      {show ? (
        <form
          className="exam-form"
          onSubmit={(event) => {
            event.preventDefault();
            add();
          }}
        >
          <label>
            Sınav türü
            <select
              value={form.type}
              onChange={(event) =>
                setForm({
                  ...form,
                  type: event.currentTarget.value as "TYT" | "AYT",
                })
              }
            >
              <option>TYT</option>
              <option>AYT</option>
            </select>
          </label>
          <label>
            Tarih
            <input
              type="date"
              required
              value={form.date}
              onInput={(event) =>
                setForm({ ...form, date: event.currentTarget.value })
              }
            />
          </label>
          <label className="wide">
            Kaynak / kitapçık
            <input
              value={form.source}
              required
              maxLength={120}
              onInput={(event) =>
                setForm({ ...form, source: event.currentTarget.value })
              }
            />
          </label>
          {(["math", "language", "science", "social"] as const).map(
            (key, i) => (
              <label key={key}>
                {
                  [
                    "Matematik",
                    form.type === "TYT" ? "Türkçe" : "TDE–Sosyal 1",
                    "Fen",
                    form.type === "TYT" ? "Sosyal" : "Sosyal 2",
                  ][i]
                }
                <input
                  type="number"
                  step="0.25"
                  value={form[key]}
                  onInput={(event) =>
                    setForm({ ...form, [key]: event.currentTarget.value })
                  }
                />
              </label>
            ),
          )}
          {error ? (
            <p className="form-error wide" role="alert">
              {error}
            </p>
          ) : null}
          <button className="button primary wide" type="submit">
            <Plus size={16} />
            Örnek kaydı ekle
          </button>
        </form>
      ) : null}
      <div className="source-note">
        Demo verisi. Okul bağlantısı yok; farklı yayınevi ve zorluktaki
        denemelerden otomatik gelişim veya kabul sonucu çıkarılmaz.
      </div>
    </section>
  );
}

export function ProfilePage() {
  const { state, setState } = useApp();
  const [draft, setDraft] = useState(state.profile!);
  const profile = state.profile;
  if (!profile) return null;
  return (
    <>
      <PageHead
        eyebrow="BAŞLANGIÇ NOKTAN"
        title="Rotanın arkasındaki sen."
        description="Bunlar bir test sonucu değil; bugün verdiğin ve değiştirebildiğin cevaplar."
      />
      <section className="panel target-editor">
        <SectionHead
          title="Bölüm, alan ve üniversitelerin"
          note="Karar vermek zorunda değilsin. Seçimlerin değişince öneriler yenilenir; çalışmaların korunur."
        />
        <TargetPicker
          profile={draft}
          onChange={(patch) =>
            setDraft((previous) => ({ ...previous, ...patch }))
          }
        />
        <button
          className="button primary"
          onClick={() => {
            setState((previous) => ({
              ...previous,
              profile: {
                ...previous.profile!,
                departments: draft.departments,
                universities: draft.universities,
              },
            }));
            toast.success("Hedeflerin kaydedildi. Önerilerin yenilendi.");
          }}
        >
          Hedeflerimi kaydet <Check size={16} />
        </button>
      </section>
      <section className="panel profile-panel">
        <span className="avatar large">{profile.name.slice(0, 1)}</span>
        <h2>{profile.name}</h2>
        <p>
          {profile.grade === "Hazırlık"
            ? "Hazırlık"
            : `${profile.grade}. sınıf`}{" "}
          · {goalLabels[profile.goal]}
        </p>
        <dl>
          <div>
            <dt>Merak ettiklerin</dt>
            <dd>
              {profile.interests.map((field) => fieldLabels[field]).join(", ")}
            </dd>
          </div>
          <div>
            <dt>Bugünkü hedefin</dt>
            <dd>{profile.target || goalLabels[profile.goal]}</dd>
          </div>
          <div>
            <dt>Zamanın</dt>
            <dd>Haftada {profile.hours} saat</dd>
          </div>
          <div>
            <dt>Katılım tercihin</dt>
            <dd>
              {profile.access === "ev"
                ? "Evden / uzaktan"
                : profile.access === "okul"
                  ? "Okul içinde"
                  : "Okuldan veya evden"}
            </dd>
          </div>
        </dl>
        <button className="button primary" onClick={() => go("baslangic")}>
          Altı cevabımı düzenle
          <ArrowRight size={17} />
        </button>
        <p className="source-note">
          Cevapların değişince öneriler yenilenir. Rotana eklediğin çalışmalar
          kendiliğinden silinmez.
        </p>
      </section>
    </>
  );
}
