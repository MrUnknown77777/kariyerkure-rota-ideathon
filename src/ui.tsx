import { createContext, useContext } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Users,
  Trophy,
  X,
} from "lucide-react";
import type { Kind, Opportunity, State } from "./model";
import { kindLabels } from "./model";
import { organizations } from "./targets";

export function OpportunityMark({
  item,
  small = false,
}: {
  item: Opportunity;
  small?: boolean;
}) {
  const organization = item.organization
    ? organizations[item.organization]
    : undefined;
  return organization ? (
    <span
      className={`organization-mark ${small ? "small" : ""} ${organization.dark ? "on-dark" : ""}`}
    >
      <img src={`/assets/logos/${organization.logo}`} alt={organization.name} />
    </span>
  ) : (
    <IconTile kind={item.kind} accent={item.accent} small={small} />
  );
}
export function feeLabel(item: Opportunity) {
  return item.feeStatus === "unknown"
    ? "Ücreti doğrula"
    : item.cost > 0 || item.feeStatus === "paid"
      ? "Ücretli"
      : "Ücretsiz";
}

export const AppContext = createContext<{
  state: State;
  setState: Dispatch<SetStateAction<State>>;
}>({ state: {} as State, setState: () => {} });
export const useApp = () => useContext(AppContext);
export function go(path: string) {
  window.location.hash = `/${path}`;
}
export const kindIcons = {
  deneyim: Lightbulb,
  kulup: Users,
  proje: BookOpen,
  yarisma: Trophy,
  arastirma: FlaskConical,
  sinav: GraduationCap,
};
export function Brand() {
  return (
    <a
      href="#/rotam"
      className="brand"
      aria-label="Kariyer Küre Rotam ana sayfa"
    >
      <img src="/assets/kariyerkure.png" alt="" />
      <span>
        kariyer<span className="brand-bold">küre</span>
        <small>DENE, SEÇ, DARALT</small>
      </span>
    </a>
  );
}
export function IconTile({
  kind,
  accent = "purple",
  small = false,
}: {
  kind: Kind;
  accent?: string;
  small?: boolean;
}) {
  const Icon = kindIcons[kind];
  return (
    <span className={`icon-tile ${accent} ${small ? "small" : ""}`}>
      <Icon size={small ? 19 : 25} strokeWidth={1.7} />
    </span>
  );
}
export function KindBadge({ item }: { item: Opportunity }) {
  return <span className="eyebrow category">{kindLabels[item.kind]}</span>;
}
export function PageHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
export function SectionHead({
  title,
  note,
  link,
  onClick,
}: {
  title: string;
  note?: string;
  link?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {note ? <p>{note}</p> : null}
      </div>
      {link ? (
        <button className="text-button" onClick={onClick}>
          {link}
          <ArrowUpRight size={17} />
        </button>
      ) : null}
    </div>
  );
}
export function Empty({
  title,
  description,
  label,
  onClick,
}: {
  title: string;
  description: string;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <div className="empty">
      <span className="empty-orbit">
        <Compass size={30} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {label ? (
        <button className="button primary" onClick={onClick}>
          {label}
          <ArrowRight size={17} />
        </button>
      ) : null}
    </div>
  );
}
export function Choice({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`choice ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon ? <span className="choice-icon">{icon}</span> : null}
      <span>
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <span className="choice-check">
        {selected ? <Check size={15} /> : null}
      </span>
    </button>
  );
}
export function Notice({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="notice" role="status">
      <span>{children}</span>
      {onClose ? (
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Bildirimi kapat"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}
export function OrbitArt({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`orbit-art ${compact ? "compact" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 400 330">
        <defs>
          <linearGradient id="orb" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9fe7e1" />
            <stop offset="1" stopColor="#148d83" />
          </linearGradient>
        </defs>
        <ellipse
          cx="205"
          cy="164"
          rx="164"
          ry="68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform="rotate(-30 205 164)"
        />
        <ellipse
          cx="205"
          cy="164"
          rx="145"
          ry="104"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform="rotate(30 205 164)"
        />
        <circle cx="205" cy="164" r="79" fill="url(#orb)" />
        <path
          d="M164 124c24-20 63-19 81 1M162 203c29 18 62 16 82-5"
          fill="none"
          stroke="#ffffff55"
          strokeWidth="2"
        />
        <path
          d="M205 85c-37 45-37 112 0 158M205 85c37 45 37 112 0 158"
          fill="none"
          stroke="#ffffff44"
        />
        <path d="M126 164h158" stroke="#ffffff44" />
        <circle cx="70" cy="220" r="17" fill="#f4c983" />
        <circle cx="343" cy="110" r="12" fill="#b9dfd0" />
        <circle cx="290" cy="271" r="6" fill="#f1d1c6" />
        <path
          d="M317 43v14m-7-7h14M85 82v10m-5-5h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="orbit-label one">Merak et.</span>
      <span className="orbit-label two">Bir adım dene.</span>
      <span className="orbit-label three">Kendi yolunu bul.</span>
    </div>
  );
}
