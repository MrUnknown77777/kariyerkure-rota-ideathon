import { useState } from "react";
import { CalendarDays, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { opportunityById } from "./catalog";
import { setReviewDate, updateTrackProgress } from "./engine";
import { DEMO_TODAY, datePlus, formatDate } from "./model";
import type { Track } from "./model";
import { go, SectionHead, useApp } from "./ui";

export function CompetitionInfo({ id }: { id: string }) {
  const { state, setState } = useApp();
  const item = opportunityById(id)!;
  const reminder = state.reminders?.find((value) => value.opportunityId === id);
  const [date, setDate] = useState(reminder?.date ?? datePlus(DEMO_TODAY, 7));
  return (
    <section className="panel competition-info">
      <SectionHead
        title={
          item.competitionStatus === "open"
            ? "Çağrıyı tanı, sonra hazırlan."
            : "Yeni dönemi birlikte takip et."
        }
        note="Kayıt ve başvuru yalnızca kurumun resmî sitesinde yapılır."
      />
      <p>{item.eligibilityNote}</p>
      <p>
        <strong>Maliyet:</strong>{" "}
        {item.feeNote ?? "Katılım koşullarını resmî kaynaktan kontrol et."}
      </p>
      {item.deadline ? (
        <div className="real-deadline">
          <CalendarDays size={21} />
          <div>
            <strong>
              {formatDate(item.deadline, true)}{" "}
              {item.deadlineTime ? `· ${item.deadlineTime} Türkiye` : ""}
            </strong>
            <p>{item.deadlineNote}</p>
          </div>
        </div>
      ) : (
        <>
          <p>
            Yeni çağrı için doğrulanmış tarih yok. Takvime bir başvuru tarihi
            değil, kendi kontrol gününü ekle.
          </p>
          <form
            className="review-form"
            onSubmit={(event) => {
              event.preventDefault();
              setState((previous) => setReviewDate(previous, id, date));
              toast.success("Kontrol günün takvimine eklendi.");
            }}
          >
            <label>
              Çağrıyı kontrol edeceğim gün
              <input
                aria-label="Çağrı kontrol tarihi"
                type="date"
                min={DEMO_TODAY}
                required
                value={date}
                onInput={(event) => setDate(event.currentTarget.value)}
              />
            </label>
            <button className="button secondary" type="submit">
              <CalendarDays size={16} />
              {reminder ? "Kontrol gününü güncelle" : "Kontrol günü ekle"}
            </button>
          </form>
          {reminder ? (
            <button
              className="text-button"
              onClick={() => go(`takvim/${reminder.date}`)}
            >
              Takvimde gör →
            </button>
          ) : null}
        </>
      )}
      <a
        className="text-button"
        href={item.deadlineSource ?? item.source?.url}
        target="_blank"
        rel="noreferrer"
      >
        Çağrı ve tarih kaynağı <ExternalLink size={15} />
      </a>
      <small className="source-note">
        Kaynak kontrolü: {item.verifiedAt}. Koşullar değişebilir; başvurmadan
        önce tekrar doğrula. Haftalık süre, yalnızca ilk hazırlık içindir.
      </small>
    </section>
  );
}
const statuses: Record<NonNullable<Track["participation"]>, string> = {
  arastiriyorum: "İnceliyorum",
  hazirlaniyorum: "Hazırlanıyorum",
  basvurdum: "Başvurdum",
  katildim: "Katıldım",
};
export function ProgressJournal({ id }: { id: string }) {
  const { state, setState } = useApp();
  const track = state.tracks.find((item) => item.opportunityId === id)!;
  const [status, setStatus] = useState<NonNullable<Track["participation"]>>(
    track.participation ?? "hazirlaniyorum",
  );
  const [note, setNote] = useState("");
  return (
    <section className="panel progress-journal">
      <SectionHead
        title="Çalışman nerede?"
        note="Hazırlık listesinden ayrı, senin gerçek ilerlemen. Sadece senin beyanın; dışarıya başvuru gönderilmez."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setState((previous) =>
            updateTrackProgress(previous, id, status, note),
          );
          setNote("");
          toast.success("İlerlemen kaydedildi. Rotanda da görünüyor.");
        }}
      >
        <label>
          Şu anki durum
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.currentTarget.value as NonNullable<
                  Track["participation"]
                >,
              )
            }
          >
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Bir sonraki geldiğinde hatırlamak istediğin not
          <textarea
            aria-label="İlerleme notum"
            value={note}
            onInput={(event) => setNote(event.currentTarget.value)}
            maxLength={1200}
            placeholder="Örn. Problemimi seçtim; cuma günü danışmanla konuşacağım."
            rows={3}
          />
        </label>
        <button className="button primary">
          <Check size={16} />
          İlerlememi kaydet
        </button>
      </form>
      {track.participation ? (
        <span className="competition-status">
          Durumun: {statuses[track.participation]}
        </span>
      ) : null}
      <ol className="progress-log">
        {[...(track.updates ?? [])]
          .reverse()
          .slice(0, 5)
          .map((update) => (
            <li key={update.id}>
              <small>{formatDate(update.date)}</small>
              <p>{update.text}</p>
            </li>
          ))}
      </ol>
    </section>
  );
}
