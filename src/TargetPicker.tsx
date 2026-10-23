import { useState } from "react";
import { Check, GraduationCap, Search, Target } from "lucide-react";
import { departments, universities } from "./targets";
import type { Profile } from "./model";

export default function TargetPicker({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (value: Partial<Profile>) => void;
}) {
  const [tab, setTab] = useState<"bolum" | "uni">("bolum");
  const [query, setQuery] = useState("");
  const [limitMessage, setLimitMessage] = useState("");
  const chosenDepartments = profile.departments ?? [];
  const chosenUniversities = profile.universities ?? [];
  function choose(key: "departments" | "universities", id: string) {
    const list = profile[key] ?? [];
    const limit = key === "departments" ? 3 : 5;
    if (!list.includes(id) && list.length >= limit) {
      setLimitMessage(
        `En fazla ${limit} seçim yapabilirsin. Önce bir seçimini kaldır.`,
      );
      return;
    }
    setLimitMessage("");
    onChange({
      [key]: list.includes(id)
        ? list.filter((value) => value !== id)
        : [...list, id],
    });
  }
  return (
    <section
      className="target-picker"
      aria-label="Bölüm ve üniversite hedefleri"
    >
      <div className="target-picker-title">
        <GraduationCap size={19} />
        <div>
          <strong>Hangi geleceklere bakıyorsun?</strong>
          <small>
            İstersen seç. Kararsızsan boş bırak; sonra değiştirebilirsin.
          </small>
        </div>
      </div>
      <div className="tabs">
        <button
          type="button"
          aria-pressed={tab === "bolum"}
          className={tab === "bolum" ? "active" : ""}
          onClick={() => {
            setTab("bolum");
            setQuery("");
          }}
        >
          Bölüm & alan
          {chosenDepartments.length ? ` · ${chosenDepartments.length}` : ""}
        </button>
        <button
          type="button"
          aria-pressed={tab === "uni"}
          className={tab === "uni" ? "active" : ""}
          onClick={() => {
            setTab("uni");
            setQuery("");
          }}
        >
          Üniversiteler
          {chosenUniversities.length ? ` · ${chosenUniversities.length}` : ""}
        </button>
      </div>
      <label className="search-field">
        <Search size={15} />
        <input
          aria-label={
            tab === "bolum" ? "Hedef bölüm ara" : "Hedef üniversite ara"
          }
          value={query}
          onInput={(event) => setQuery(event.currentTarget.value)}
          placeholder={
            tab === "bolum"
              ? "Bilgisayar, psikoloji, tasarım…"
              : "ODTÜ, İTÜ, Boğaziçi…"
          }
        />
      </label>
      <div className="target-options">
        {tab === "bolum"
          ? departments
              .filter((item) =>
                item.name
                  .toLocaleLowerCase("tr-TR")
                  .includes(query.toLocaleLowerCase("tr-TR")),
              )
              .map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`target-option ${chosenDepartments.includes(item.id) ? "selected" : ""}`}
                  aria-pressed={chosenDepartments.includes(item.id)}
                  onClick={() => choose("departments", item.id)}
                >
                  <Target size={16} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.exam}</small>
                  </span>
                  <span className="target-tick">
                    {chosenDepartments.includes(item.id) ? (
                      <Check size={13} />
                    ) : null}
                  </span>
                </button>
              ))
          : universities
              .filter((item) =>
                `${item.name} ${item.short} ${item.city}`
                  .toLocaleLowerCase("tr-TR")
                  .includes(query.toLocaleLowerCase("tr-TR")),
              )
              .map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`target-option ${chosenUniversities.includes(item.id) ? "selected" : ""}`}
                  aria-pressed={chosenUniversities.includes(item.id)}
                  onClick={() => choose("universities", item.id)}
                >
                  <img
                    className="university-logo"
                    src={`/assets/logos/${item.logo}`}
                    alt=""
                  />
                  <span>
                    <strong>{item.short}</strong>
                    <small>{item.city}</small>
                  </span>
                  <span className="target-tick">
                    {chosenUniversities.includes(item.id) ? (
                      <Check size={13} />
                    ) : null}
                  </span>
                </button>
              ))}
      </div>
      <div className="target-selection-summary">
        {limitMessage ? <span role="status">{limitMessage}</span> : null}
        {chosenDepartments.length || chosenUniversities.length ? (
          <>
            <span>
              {chosenDepartments.length} bölüm · {chosenUniversities.length}{" "}
              üniversite
            </span>
            {tab === "bolum" ? (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setTab("uni");
                  setQuery("");
                }}
              >
                Üniversiteleri de seç →
              </button>
            ) : null}
          </>
        ) : (
          <span>Henüz hedef seçmedin. Keşif rotasıyla da başlayabilirsin.</span>
        )}
      </div>
      <small className="target-disclaimer">
        Bölümler önerilerin konusunu belirler. Üniversiteler kişisel hedefindir;
        yarışma katılımı kabul garantisi değildir. Sunum kataloğu sınırlıdır.
      </small>
    </section>
  );
}
