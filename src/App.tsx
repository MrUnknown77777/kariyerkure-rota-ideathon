import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Compass,
  GraduationCap,
  HelpCircle,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import { Toaster } from "sonner";
import { loadState, persistState } from "./engine";
import { freshState, isSenior, stage } from "./model";
import { AppContext, Brand, Empty, go, useApp } from "./ui";
import Onboarding from "./Onboarding";
import { RoutePage, ProfilePage } from "./RoutePage";
import {
  Opportunities,
  OpportunityDetail,
  ReflectionPage,
} from "./Opportunities";
import { CalendarPage, MemoriesPage, TeacherPage, DemoPage } from "./Workspace";

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function hashValue() {
  return window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
}
const nav = [
  { id: "rotam", label: "Rotam", icon: Map },
  { id: "firsatlar", label: "Fırsatlar", icon: Compass },
  { id: "takvim", label: "Takvim", icon: CalendarDays },
  { id: "deneyimlerim", label: "Deneyimlerim", icon: Sprout },
];
const names: Record<string, string> = {
  rotam: "Kişisel rotam",
  firsatlar: "Fırsatları keşfet",
  firsat: "Fırsat detayı",
  takvim: "Takvimim",
  deneyimlerim: "Deneyim geçmişim",
  yansit: "Deneyim değerlendirmesi",
  ogretmen: "Rehber öğretmen",
  demo: "Sunum kontrolleri",
  hedefim: "Tercihlerim",
};

export default function App() {
  const [initial] = useState(() => {
    try {
      return loadState(window.localStorage);
    } catch {
      return {
        state: freshState(),
        warning:
          "Tarayıcı kaydı kullanılamıyor; bu oturumda devam edebilirsin.",
      };
    }
  });
  const [state, setState] = useState(initial.state);
  const [storageWarning, setStorageWarning] = useState(initial.warning ?? "");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [largeText, setLargeText] = useState(() => {
    try {
      return window.localStorage.getItem("kariyerkure-rota:buyuk-yazi") === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    // Erişilebilirlik: büyük yazı tercihi (bu tarayıcıda hatırlanır).
    document.documentElement.classList.toggle("large-text", largeText);
    try {
      window.localStorage.setItem("kariyerkure-rota:buyuk-yazi", largeText ? "1" : "0");
    } catch {
      /* kayıt kapalıysa yalnızca bu oturumda geçerli */
    }
  }, [largeText]);
  const hash = useSyncExternalStore(subscribeHash, hashValue);
  const path = hash || (state.profile ? "rotam" : "baslangic");
  const [page, id] = path.split("/");
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (!persistState(window.localStorage, state))
        setStorageWarning(
          "Kaydın bu tarayıcıda saklanamıyor. Sayfayı kapatmadan sunumunu tamamlayabilirsin.",
        );
    } catch {
      setStorageWarning(
        "Tarayıcı kaydı kapalı. Değişiklikler yalnızca bu oturumda korunur.",
      );
    }
  }, [state]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMobileMenu(false);
    mainRef.current?.focus({ preventScroll: true });
    document.title = `${names[page] ?? "Başlayalım"} · Kariyer Küre / İdeathon`;
  }, [page, id]);

  return (
    <AppContext value={{ state, setState }}>
      <Toaster
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          style: { fontFamily: "Urbanist, sans-serif", borderRadius: "14px" },
        }}
      />
      {page === "baslangic" || (!state.profile && page !== "demo") ? (
        <Onboarding key={page} />
      ) : (
        <div className="app-shell">
          <a
            className="skip-link"
            href="#main-content"
            onClick={(event) => {
              event.preventDefault();
              mainRef.current?.focus();
            }}
          >
            İçeriğe geç
          </a>
          <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
            <Brand />
            <div className="workspace-label">ÖĞRENCİ ÇALIŞMA ALANI</div>
            <nav aria-label="Ana gezinme">
              {nav.map(({ id: itemId, label, icon: Icon }) => (
                <a
                  key={itemId}
                  href={`#/${itemId}`}
                  className={`nav-item ${page === itemId || (itemId === "firsatlar" && page === "firsat") ? "active" : ""}`}
                  aria-current={page === itemId ? "page" : undefined}
                >
                  <Icon size={20} strokeWidth={1.8} />
                  <span>{label}</span>
                  {page === itemId ? <span className="nav-dot" /> : null}
                </a>
              ))}
            </nav>
            <div className="sidebar-journey">
              <div className="journey-line" />
              <span className="eyebrow">YOLUN SENİNLE DEĞİŞİR</span>
              {["Dene", "Seç", "Daralt"].map((label, i) => (
                <div
                  className={`side-stage ${state.profile && stage(state.profile) === label ? "current" : ""}`}
                  key={label}
                >
                  <span>
                    {state.profile && stage(state.profile) === label ? (
                      <Sparkles size={12} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <div>
                    <strong>{label}</strong>
                    <small>
                      {
                        [
                          "Merakından başla",
                          "Deneyimlerinle yön bul",
                          "Hedefine hazırlan",
                        ][i]
                      }
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <div className="sidebar-bottom">
              <a href="#/demo" className="sidebar-help">
                <HelpCircle size={18} />
                <span>
                  Sunuma hazır mısın?<small>Demo akışı ve kontroller</small>
                </span>
                <ChevronRight size={16} />
              </a>
              <button
                className="sidebar-help a11y-toggle"
                aria-pressed={largeText}
                onClick={() => setLargeText(!largeText)}
              >
                <span aria-hidden="true" className="a11y-glyph">Aa</span>
                <span>
                  {largeText ? "Büyük yazı açık" : "Büyük yazı"}
                  <small>Okumayı kolaylaştırır</small>
                </span>
              </button>
              <a href="#/hedefim" className="profile-link">
                <span className="avatar">
                  {state.profile?.name.slice(0, 1) ?? "K"}
                </span>
                <span>
                  <strong>{state.profile?.name ?? "Demo öğrenci"}</strong>
                  <small>
                    {state.profile
                      ? `${state.profile.grade}${state.profile.grade === "Hazırlık" ? "" : ". sınıf"} · ${isSenior(state.profile) ? "Hedef & hazırlık" : "Keşif & deneyim"}`
                      : "İdeathon prototipi"}
                  </small>
                </span>
                <Settings2 size={17} />
              </a>
            </div>
          </aside>
          {mobileMenu ? (
            <button
              className="mobile-backdrop"
              aria-label="Menüyü kapat"
              onClick={() => setMobileMenu(false)}
            />
          ) : null}
          <div className="app-main">
            <header className="topbar">
              <div className="breadcrumb">
                <button
                  className="icon-button mobile-toggle"
                  aria-label={mobileMenu ? "Menüyü kapat" : "Menüyü aç"}
                  aria-expanded={mobileMenu}
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  {mobileMenu ? (
                    <PanelLeftClose size={21} />
                  ) : (
                    <PanelLeftOpen size={21} />
                  )}
                </button>
                <span className="breadcrumb-root">Çalışma alanı</span>
                <ChevronRight size={14} />
                <strong>{names[page] ?? "Başlayalım"}</strong>
              </div>
              <div className="topbar-actions">
                <a href="#/demo" className="demo-pill">
                  <span className="live-dot" /> İdeathon demosu
                </a>
                <div className="role-switch" aria-label="Demo görünümü">
                  <a
                    href="#/rotam"
                    className={page !== "ogretmen" ? "selected" : ""}
                  >
                    Öğrenci
                  </a>
                  <a
                    href="#/ogretmen"
                    className={page === "ogretmen" ? "selected" : ""}
                  >
                    <Users size={14} />
                    PDR
                  </a>
                </div>
              </div>
            </header>
            {storageWarning ? (
              <div className="storage-warning" role="status">
                {storageWarning}
              </div>
            ) : null}
            <main
              ref={mainRef}
              id="main-content"
              tabIndex={-1}
              className="main-content"
            >
              <div className="page-enter" key={path}>
                {page === "rotam" ? (
                  <RoutePage />
                ) : page === "firsatlar" ? (
                  <Opportunities initialKind={id} />
                ) : page === "firsat" && id ? (
                  <OpportunityDetail key={id} id={id} />
                ) : page === "yansit" && id ? (
                  <ReflectionPage key={id} id={id} />
                ) : page === "takvim" ? (
                  <CalendarPage initialDate={id} />
                ) : page === "deneyimlerim" ? (
                  <MemoriesPage />
                ) : page === "ogretmen" ? (
                  <TeacherPage />
                ) : page === "demo" ? (
                  <DemoPage />
                ) : page === "hedefim" ? (
                  <ProfilePage />
                ) : (
                  <Empty
                    title="Bu yol henüz burada değil."
                    description="Rotana dönüp kaldığın yerden devam edebilirsin."
                    label="Rotama dön"
                    onClick={() => go("rotam")}
                  />
                )}
              </div>
            </main>
            <footer className="app-footer">
              <span>
                <ShieldCheck size={13} /> Bağımsız ideathon prototipi · Gerçek
                öğrenci verisi kullanma.
              </span>
              <a href="#/demo">
                Demo verisi · 24 Ekim 2026 <ArrowRight size={12} />
              </a>
            </footer>
          </div>
        </div>
      )}
    </AppContext>
  );
}
