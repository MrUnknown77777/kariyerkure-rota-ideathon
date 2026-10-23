import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Compass,
  FlaskConical,
  GraduationCap,
  Layers,
  Leaf,
  Lightbulb,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  defaultProfile,
  fieldLabels,
  goalLabels,
  isSenior,
  personas,
} from "./model";
import type { Field, Grade, Profile } from "./model";
import { Brand, Choice, OrbitArt, go, useApp } from "./ui";
import TargetPicker from "./TargetPicker";

const fields = Object.entries(fieldLabels) as [Field, string][];
const fieldIcons = {
  teknoloji: Rocket,
  tasarim: Palette,
  saglik: FlaskConical,
  sosyal: Users,
  isletme: Lightbulb,
  doga: Leaf,
  kesif: Compass,
};
const questions = [
  [
    "Önce bulunduğun yerden başlayalım.",
    "Hangi sınıftasın?",
    "Rotan, lise hayatının hangi döneminde olduğuna göre şekillenecek.",
  ],
  [
    "Bir yön seçmek yeterli.",
    "Şu an neye ulaşmak istiyorsun?",
    "Kesin bir meslek bilmen gerekmiyor. Bugünkü amacını seç.",
  ],
  [
    "Merakın iyi bir başlangıç.",
    "Seni neler meraklandırıyor?",
    "En fazla üç alan seçebilirsin. Kararsız olmak da bir cevap.",
  ],
  [
    "Olduğun yerden başlayacağız.",
    "Şimdiye kadar neler denedin?",
    "Burada doğru cevap yok. İlk kez başlıyorsan küçük adımlarla ilerleriz.",
  ],
  [
    "İlk adım senin seçimin.",
    "İlk olarak ne yapmak istersin?",
    "Rotanın başlangıcını sen belirle; sonra değiştirebilirsin.",
  ],
  [
    "Sana uyan bir rota.",
    "Hayatında ne kadar yer açalım?",
    "Zamanına ve imkânlarına uyan seçeneklerle başlayalım.",
  ],
];

export default function Onboarding() {
  const { state, setState } = useApp();
  const editing = !!state.profile;
  const [profile, setProfile] = useState<Profile>(
    () => state.profile ?? { ...defaultProfile },
  );
  const [step, setStep] = useState(editing ? 0 : -1);
  const [building, setBuilding] = useState(false);
  const patch = (values: Partial<Profile>) =>
    setProfile((previous) => ({ ...previous, ...values }));
  const toggleField = (field: Field) =>
    setProfile((previous) => ({
      ...previous,
      interests:
        field === "kesif"
          ? ["kesif"]
          : previous.interests.includes(field)
            ? previous.interests.filter((value) => value !== field)
            : [
                ...previous.interests.filter((value) => value !== "kesif"),
                field,
              ].slice(-3),
    }));
  const ready = step !== 2 || profile.interests.length > 0;

  function finish() {
    if (!profile.interests.length) return;
    setBuilding(true);
    // A short visual handoff, not a pretend server/model call. Matching itself is synchronous.
    window.setTimeout(
      () => {
        setState((previous) => ({
          ...previous,
          profile: {
            ...profile,
            name: profile.name.trim() || "Defne",
            first:
              !isSenior(profile) && profile.first === "sinav"
                ? "dene"
                : profile.first,
          },
        }));
        toast.success(
          editing
            ? "Tercihlerin güncellendi."
            : "Rotan hazır. İlk adımı sen seç.",
          {
            description: editing
              ? "Eklediğin çalışmalar korundu; yeni öneriler cevaplarına göre değişti."
              : "Hiçbir fırsata senin adına başvuru yapılmadı.",
          },
        );
        go("rotam");
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 850,
    );
  }

  if (building)
    return (
      <div className="building-screen">
        <div className="building-orbit">
          <Sparkles size={37} />
        </div>
        <span className="eyebrow">CEVAPLARINDAN ROTANA</span>
        <h1>Başlayabileceğin bir yol.</h1>
        <p>
          {profile.grade === "Hazırlık"
            ? "Hazırlık"
            : `${profile.grade}. sınıf`}{" "}
          · {profile.interests.map((field) => fieldLabels[field]).join(" & ")} ·
          Haftada {profile.hours} saat
        </p>
        <div className="building-checks">
          <span>
            <Check size={17} /> Sınıf ve erişim koşulların
          </span>
          <span>
            <Check size={17} /> İlgin ve başlangıç tercihin
          </span>
          <span>
            <Check size={17} /> Uygun fırsatlar ve ilk adım
          </span>
        </div>
        <small>
          Bu prototip, tanımlı kurallarla eşleştirme yapar; canlı AI bağlı
          değil.
        </small>
      </div>
    );

  return (
    <div className="onboard-shell">
      <header className="onboard-top">
        <Brand />
        <a className="demo-pill" href="#/demo">
          <span className="live-dot" /> İdeathon prototipi
        </a>
      </header>
      <div className="onboard-body">
        <aside className="onboard-story">
          <div className="eyebrow">KARİYER KÜRE · ROTAM</div>
          <h1>
            Yolunu bir anda
            <br />
            bilmen gerekmiyor.
          </h1>
          <p>
            Merak ettiğin bir şeyden başla.
            <br />
            Denedikçe kendi yönünü bul.
          </p>
          <OrbitArt />
          <div className="story-stages">
            {["Dene", "Seç", "Daralt"].map((label, i) => (
              <span key={label}>
                <b>0{i + 1}</b>
                {label}
              </span>
            ))}
          </div>
          <div className="story-foot">
            <ShieldCheck size={16} /> Kararı sen verirsin. Rotan seninle
            değişir.
          </div>
        </aside>
        <main className="onboard-main">
          {step === -1 ? (
            <section className="welcome-panel page-enter">
              <span className="mini-kicker">
                <Sparkles size={16} /> Senin merakın. Senin rotan.
              </span>
              <h2>
                Geleceğin için
                <br />
                küçük bir başlangıç.
              </h2>
              <p>
                Altı kısa cevapla sana uygun deneyimleri bulalım. Birini seç,
                rotana ekle; hazırlığını ve tarihlerini birlikte gör.
              </p>
              <div className="welcome-points">
                <span>
                  <Compass size={19} /> Sana göre fırsatlar
                </span>
                <span>
                  <Layers size={19} /> Değiştirebildiğin rota
                </span>
                <span>
                  <Clock3 size={19} /> Birbirine bağlı takvim
                </span>
              </div>
              <button
                className="button primary large"
                onClick={() => setStep(0)}
              >
                Rotamı oluşturalım
                <ArrowRight size={19} />
              </button>
              <small className="muted">
                Yaklaşık 2 dakika · Hesap açman gerekmiyor
              </small>
              <div className="quick-demo">
                <span>Sunumda hızlı başlamak için</span>
                <div>
                  {Object.entries(personas).map(([id, value]) => (
                    <button
                      key={id}
                      onClick={() => {
                        setState((previous) => ({
                          ...previous,
                          profile: value,
                          saved: [],
                          tracks: [],
                          reflections: [],
                          requests: [],
                          exams: [],
                          reminders: [],
                        }));
                        go("rotam");
                      }}
                    >
                      {value.name}
                      <small>
                        {value.grade === "Hazırlık"
                          ? "Hazırlık"
                          : `${value.grade}. sınıf`}
                      </small>
                      <ArrowUpRightIcon />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section
              className="question-panel"
              aria-labelledby="question-title"
            >
              <div className="question-progress">
                <span>ROTANI TANIYALIM</span>
                <b>
                  {step + 1} <span>/ 6</span>
                </b>
              </div>
              <div className="question-bars">
                {questions.map((_, i) => (
                  <span key={i} className={i <= step ? "filled" : ""} />
                ))}
              </div>
              <div key={step} className="question-content page-enter">
                <span className="eyebrow">{questions[step][0]}</span>
                <h2 id="question-title">{questions[step][1]}</h2>
                <p>{questions[step][2]}</p>
                {step === 0 ? (
                  <>
                    <div className="grade-grid">
                      {(["Hazırlık", "9", "10", "11", "12"] as Grade[]).map(
                        (grade) => (
                          <button
                            type="button"
                            className={`grade-choice ${profile.grade === grade ? "selected" : ""}`}
                            aria-pressed={profile.grade === grade}
                            key={grade}
                            onClick={() => patch({ grade })}
                          >
                            <GraduationCap size={22} />
                            <strong>{grade}</strong>
                            <small>
                              {grade === "Hazırlık"
                                ? "Keşfe başla"
                                : Number(grade) >= 11
                                  ? "Hedefe hazırlan"
                                  : "Dene & keşfet"}
                            </small>
                          </button>
                        ),
                      )}
                    </div>
                    <label className="field-label">
                      Sana nasıl seslenelim?{" "}
                      <small>
                        İsteğe bağlı · gerçek adını yazman gerekmiyor
                      </small>
                      <input
                        maxLength={35}
                        value={profile.name}
                        onInput={(event) =>
                          patch({ name: event.currentTarget.value })
                        }
                        autoComplete="off"
                        placeholder="Bir ad veya takma ad"
                      />
                    </label>
                  </>
                ) : null}
                {step === 1 ? (
                  <div className="choice-list target-question">
                    {(["kesfet", "uret", "alan", "hazirlan"] as const).map(
                      (goal, i) => (
                        <Choice
                          key={goal}
                          selected={profile.goal === goal}
                          title={goalLabels[goal]}
                          description={
                            [
                              "Neyi sevdiğimi henüz bilmiyorum.",
                              "Bir fikirden gerçek bir çıktı üretmek istiyorum.",
                              "İlgilerimi ve seçeneklerimi karşılaştırmak istiyorum.",
                              "Aklımdaki alan için ne yapabileceğimi görmek istiyorum.",
                            ][i]
                          }
                          icon={
                            i === 0 ? (
                              <Compass />
                            ) : i === 1 ? (
                              <Lightbulb />
                            ) : i === 2 ? (
                              <Layers />
                            ) : (
                              <Target />
                            )
                          }
                          onClick={() => patch({ goal })}
                        />
                      ),
                    )}
                    <TargetPicker profile={profile} onChange={patch} />
                  </div>
                ) : null}
                {step === 2 ? (
                  <div className="interest-grid">
                    {fields.map(([field, label]) => {
                      const Icon = fieldIcons[field];
                      return (
                        <Choice
                          key={field}
                          selected={profile.interests.includes(field)}
                          title={label}
                          icon={<Icon />}
                          onClick={() => toggleField(field)}
                        />
                      );
                    })}
                  </div>
                ) : null}
                {step === 3 ? (
                  <div className="choice-list">
                    {(
                      [
                        [
                          "yeni",
                          "Henüz başlamadım",
                          "İlk küçük deneyimimi bulmak istiyorum.",
                        ],
                        [
                          "kulup",
                          "Kulüp veya etkinlik denedim",
                          "Bir alana dokundum, biraz daha keşfetmek istiyorum.",
                        ],
                        [
                          "proje",
                          "Bir proje veya araştırma yaptım",
                          "Ürettiklerimden yola çıkarak derinleşmek istiyorum.",
                        ],
                      ] as const
                    ).map(([value, title, description]) => (
                      <Choice
                        key={value}
                        selected={profile.experience === value}
                        title={title}
                        description={description}
                        icon={<Layers />}
                        onClick={() => patch({ experience: value })}
                      />
                    ))}
                  </div>
                ) : null}
                {step === 4 ? (
                  <div className="choice-list">
                    {(
                      [
                        [
                          "dene",
                          "Küçük bir şey denemek",
                          "Önce bir rolü veya alanı tanıyayım.",
                        ],
                        [
                          "ekip",
                          "Bir kulüp veya ekip bulmak",
                          "Birlikte üretebileceğim insanlarla tanışayım.",
                        ],
                        [
                          "yarisma",
                          "Bir proje veya yarışma araştırmak",
                          "Koşullarını öğrenip hazırlanabileceğim bir hedef bulayım.",
                        ],
                        ...(isSenior(profile)
                          ? [
                              [
                                "sinav",
                                "Hedefim için sınav hazırlığını düzenlemek",
                                "İlgili testleri ve hazırlık kaynaklarını araştırayım.",
                              ],
                            ]
                          : []),
                      ] as [Profile["first"], string, string][]
                    ).map(([value, title, description]) => (
                      <Choice
                        key={value}
                        selected={profile.first === value}
                        title={title}
                        description={description}
                        icon={
                          value === "sinav" ? <GraduationCap /> : <Compass />
                        }
                        onClick={() => patch({ first: value })}
                      />
                    ))}
                  </div>
                ) : null}
                {step === 5 ? (
                  <>
                    <label className="field-label">
                      Haftada ne kadar zaman ayırmak istersin?
                    </label>
                    <div className="segmented">
                      {[1, 2, 4].map((hours) => (
                        <button
                          key={hours}
                          aria-pressed={profile.hours === hours}
                          className={profile.hours === hours ? "active" : ""}
                          onClick={() => patch({ hours })}
                        >
                          {hours === 1 ? "1 saate kadar" : `${hours} saat`}
                        </button>
                      ))}
                    </div>
                    <label className="field-label">
                      Nereden katılmak sana daha uygun?
                    </label>
                    <div className="choice-list compact-choices">
                      {(
                        [
                          ["her", "Okuldan veya evden"],
                          ["ev", "Evden / uzaktan"],
                          ["okul", "Okul içinde"],
                        ] as const
                      ).map(([access, label]) => (
                        <Choice
                          key={access}
                          title={label}
                          selected={profile.access === access}
                          onClick={() => patch({ access })}
                        />
                      ))}
                    </div>
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={profile.freeOnly}
                        onChange={(event) =>
                          patch({ freeOnly: event.currentTarget.checked })
                        }
                      />
                      <span>Yalnızca ücretsiz seçeneklerle başla.</span>
                    </label>
                    <div className="privacy-note">
                      <ShieldCheck size={18} />
                      <span>
                        Bu demo yalnızca bu tarayıcıda saklanır. Gerçek öğrenci
                        veya hassas bilgi girme.
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="question-footer">
                <button
                  className="text-button"
                  onClick={() =>
                    step === 0 && editing ? go("rotam") : setStep(step - 1)
                  }
                >
                  <ArrowLeft size={17} />
                  {step === 0 && editing ? "İptal" : "Geri"}
                </button>
                <button
                  className="button primary"
                  disabled={!ready}
                  onClick={() => (step === 5 ? finish() : setStep(step + 1))}
                >
                  {step === 5
                    ? editing
                      ? "Tercihlerimi güncelle"
                      : "Rotamı göster"
                    : "Devam et"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          )}
          <footer className="onboard-disclaimer">
            Bağımsız ideathon konsepti · Kariyer Küre’nin canlı sistemiyle
            bağlantılı değildir.
          </footer>
        </main>
      </div>
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={16} />;
}
