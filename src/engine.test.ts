import { describe, expect, it } from "vitest";
import { catalog, opportunityById } from "./catalog";
import {
  addReflection,
  calendarEvents,
  createTrack,
  eligibility,
  exportCalendar,
  loadState,
  persistState,
  recommendations,
  setTask,
  toggleSaved,
  validDate,
  validProfile,
  validState,
  setReviewDate,
  updateTrackProgress,
} from "./engine";
import {
  DEMO_TODAY,
  STORAGE_KEY,
  datePlus,
  freshState,
  personas,
} from "./model";
import type { Profile, State } from "./model";

const starting = (profile: Profile = personas.defne): State => ({
  ...freshState(),
  profile,
});
const trackState = () => createTrack(starting(), "tasarim-denemesi", "Tasarım");
const doneState = () => {
  let state = trackState();
  for (const task of state.tracks[0].tasks)
    state = setTask(state, "tasarim-denemesi", task.id, { done: true });
  return state;
};
const reflection = {
  opportunityId: "tasarim-denemesi",
  liked: "Üretmek",
  blocker: "Zaman ayırmak",
  next: "devam" as const,
  note: "Bir ekran çizdim.",
  date: DEMO_TODAY,
};

describe("personalization and honest eligibility", () => {
  it("uses departments for ranking but not arbitrary university prestige", () => {
    const p = { ...personas.defne, departments: ["bilgisayar"] };
    const a = recommendations(starting(p));
    const b = recommendations(starting({ ...p, universities: ["hacettepe"] }));
    expect(a.map((item) => [item.item.id, item.score])).toEqual(
      b.map((item) => [item.item.id, item.score]),
    );
    expect(
      a.find((item) => item.item.id === "technovation")?.reasons[0],
    ).toContain("Bilgisayar");
    const unrelated = recommendations(
      starting({ ...p, departments: ["hukuk"] }),
    );
    expect(
      a.find((item) => item.item.id === "technovation")!.score,
    ).toBeGreaterThan(
      unrelated.find((item) => item.item.id === "technovation")!.score,
    );
  });
  it("does not call an unknown competition fee free", () => {
    expect(
      eligibility(opportunityById("diamond-challenge")!, personas.defne).length,
    ).toBeGreaterThan(0);
    expect(
      eligibility(opportunityById("technovation")!, personas.defne),
    ).toEqual([]);
  });
  it("validates target ids and still loads older profiles", () => {
    expect(
      validProfile({
        ...personas.defne,
        departments: undefined,
        universities: undefined,
      }),
    ).toBe(true);
    expect(validProfile({ ...personas.defne, departments: ["invented"] })).toBe(
      false,
    );
  });
  it("has no personalized recommendations without answers", () =>
    expect(recommendations(freshState())).toEqual([]));
  it("generates meaningfully different first choices for three personas", () => {
    const ids = Object.values(personas).map(
      (profile) => recommendations(starting(profile))[0].item.id,
    );
    expect(new Set(ids).size).toBe(3);
    expect(recommendations(starting(personas.ege))[0].item.kind).toBe("sinav");
  });
  it("does not recommend exam preparation to juniors", () =>
    expect(
      recommendations(starting()).some(
        (result) => result.item.kind === "sinav",
      ),
    ).toBe(false));
  it("respects location, hours and prerequisites", () => {
    expect(
      eligibility(opportunityById("robotik-tanisma")!, personas.deniz).length,
    ).toBeGreaterThan(0);
    expect(
      eligibility(opportunityById("ileri-prototip")!, personas.defne).length,
    ).toBeGreaterThan(0);
    for (const result of recommendations(starting(personas.deniz))) {
      expect(result.item.access).not.toBe("okul");
      expect(result.item.hours).toBeLessThanOrEqual(1);
    }
  });
  it("rejects paid and expired fixtures", () => {
    const item = opportunityById("tasarim-denemesi")!;
    expect(eligibility({ ...item, cost: 100 }, personas.defne)).toHaveLength(1);
    expect(
      eligibility({ ...item, deadline: "2020-01-01" }, personas.defne),
    ).toHaveLength(1);
  });
  it("each recommendation refers to real catalog ids and exposes its reasoning", () => {
    for (const profile of Object.values(personas))
      for (const result of recommendations(starting(profile))) {
        expect(catalog.some((item) => item.id === result.item.id)).toBe(true);
        expect(result.reasons.length).toBeGreaterThan(0);
      }
  });
});

describe("real competition follow-through", () => {
  it("saving a competition watches its real deadline without adding tasks", () => {
    const state = toggleSaved(starting(), "diamond-challenge");
    expect(state.tracks).toHaveLength(0);
    const event = calendarEvents(state)[0];
    expect(event).toMatchObject({
      date: "2027-01-15",
      time: "01:00",
      demo: false,
      kind: "deadline",
    });
    expect(exportCalendar(state)).toContain("DTSTART:20270114T220000Z");
  });
  it("an undated call gets an explicit personal check date, not a fake deadline", () => {
    const state = setReviewDate(starting(), "teknofest-insanlik", "2026-11-01");
    expect(calendarEvents(state)).toHaveLength(1);
    expect(calendarEvents(state)[0]).toMatchObject({
      kind: "review",
      date: "2026-11-01",
      demo: true,
    });
    expect(validState(state)).toBe(true);
    expect(setReviewDate(state, "teknofest-insanlik", "2020-01-01")).toBe(
      state,
    );
  });
  it("a participation note does not fabricate completed tasks or experience", () => {
    const initial = createTrack(starting(), "technovation", "Kodlama");
    const state = updateTrackProgress(
      initial,
      "technovation",
      "basvurdum",
      "Danışmanla görüştüm.",
    );
    expect(state.tracks[0].updates?.[0].text).toBe("Danışmanla görüştüm.");
    expect(state.tracks[0].tasks.every((task) => !task.done)).toBe(true);
    expect(state.reflections).toEqual([]);
    expect(validState(state)).toBe(true);
  });
});

describe("saving is not doing", () => {
  it("saving a dated opportunity only adds a watch date", () => {
    const state = toggleSaved(starting(), "robotik-tanisma");
    expect(state.tracks).toHaveLength(0);
    expect(state.reflections).toHaveLength(0);
    expect(calendarEvents(state).map((event) => event.kind)).toEqual([
      "deadline",
      "event",
    ]);
  });
  it("does not invent dates for undated resources", () =>
    expect(calendarEvents(toggleSaved(starting(), "bolum-atlas"))).toHaveLength(
      0,
    ));
  it("removing a saved item also removes watch dates when no route uses it", () => {
    const state = toggleSaved(
      toggleSaved(starting(), "robotik-tanisma"),
      "robotik-tanisma",
    );
    expect(calendarEvents(state)).toHaveLength(0);
  });
  it("retains route dates when unsaving a tracked opportunity", () => {
    let state = createTrack(starting(), "robotik-tanisma", "Tasarım");
    state = toggleSaved(state, "robotik-tanisma");
    expect(
      calendarEvents(state).filter((event) => event.kind !== "task"),
    ).toHaveLength(2);
  });
  it("ignores unknown ids", () =>
    expect(toggleSaved(starting(), "does-not-exist").saved).toHaveLength(0));
});

describe("connected route and calendar", () => {
  it("fits a short experience into one realistic time block", () => {
    const tasks = trackState().tracks[0].tasks;
    expect(new Set(tasks.map((task) => task.date)).size).toBe(1);
    expect(tasks.reduce((sum, task) => sum + (task.minutes ?? 0), 0)).toBe(30);
    expect(tasks.map((task) => task.time)).toEqual(["17:00", "17:10", "17:20"]);
  });
  it("creates only explicitly selected preparation tasks", () => {
    const state = createTrack(
      starting(),
      "tasarim-denemesi",
      "Tasarım",
      [0, 2],
    );
    expect(state.tracks[0].tasks).toHaveLength(2);
    expect(state.tracks[0].tasks.every((task) => !task.done)).toBe(true);
    expect(
      calendarEvents(state).filter((event) => event.kind === "task"),
    ).toHaveLength(2);
  });
  it("deduplicates tasks and tracks", () => {
    const state = createTrack(
      starting(),
      "tasarim-denemesi",
      "Tasarım",
      [0, 0, 1, 999],
    );
    expect(state.tracks[0].tasks).toHaveLength(2);
    expect(
      createTrack(state, "tasarim-denemesi", "Tasarım").tracks,
    ).toHaveLength(1);
  });
  it("requires eligible conditions, known role and at least one task", () => {
    expect(
      createTrack(starting(), "yks-hazirlik", "Bireysel hazırlık").tracks,
    ).toHaveLength(0);
    expect(
      createTrack(starting(), "tasarim-denemesi", "Unknown").tracks,
    ).toHaveLength(0);
    expect(
      createTrack(starting(), "tasarim-denemesi", "Tasarım", []).tracks,
    ).toHaveLength(0);
  });
  it("reflects rescheduling and completion in the same calendar event", () => {
    const state = setTask(
      trackState(),
      "tasarim-denemesi",
      "tasarim-denemesi:task:0",
      { date: "2026-11-03", time: "18:30", done: true },
    );
    const event = calendarEvents(state).find(
      (value) => value.id === "tasarim-denemesi:task:0",
    );
    expect(event?.date).toBe("2026-11-03");
    expect(event?.time).toBe("18:30");
    expect(event?.done).toBe(true);
  });
  it("rejects invalid dates and times", () => {
    const state = trackState();
    expect(
      setTask(state, "tasarim-denemesi", state.tracks[0].tasks[0].id, {
        date: "2026-02-30",
      }),
    ).toBe(state);
    expect(
      setTask(state, "tasarim-denemesi", state.tracks[0].tasks[0].id, {
        time: "25:00",
      }),
    ).toBe(state);
  });
  it("exports valid UTC intervals and all-day exclusive end dates", () => {
    const state = createTrack(starting(), "robotik-tanisma", "Tasarım");
    const file = exportCalendar(state);
    expect(file).toContain("BEGIN:VCALENDAR");
    expect(file).toContain("DTSTART:20261025T140000Z");
    expect(file).toContain("DTEND:20261025T142000Z");
    expect(file).toContain("DTSTART;VALUE=DATE:20261030");
    expect(file).toContain("DTEND;VALUE=DATE:20261031");
    expect(file).toContain("[DEMO]");
  });
  it("excludes paused and completed preparation from export", () => {
    const state = trackState();
    state.tracks[0].paused = true;
    expect(exportCalendar(state)).not.toContain("BEGIN:VEVENT");
    expect(exportCalendar(doneState())).not.toContain("BEGIN:VEVENT");
  });
});

describe("reflection is evidence, not a fake score", () => {
  it("does not silently reopen recorded experience from another view", () => {
    const state = addReflection(doneState(), reflection);
    expect(
      setTask(state, reflection.opportunityId, state.tracks[0].tasks[0].id, {
        done: false,
      }),
    ).toBe(state);
  });
  it("cannot complete a mere saved or unprepared opportunity", () => {
    expect(
      addReflection(toggleSaved(starting(), "tasarim-denemesi"), reflection)
        .reflections,
    ).toHaveLength(0);
    expect(addReflection(trackState(), reflection).reflections).toHaveLength(0);
  });
  it("stores personal reflection without changing preferences or sharing automatically", () => {
    const state = addReflection(doneState(), reflection);
    expect(state.reflections).toHaveLength(1);
    expect(state.profile).toEqual(personas.defne);
    expect(state.requests).toHaveLength(0);
  });
  it("updates the same reflection rather than creating duplicate evidence", () => {
    let state = addReflection(doneState(), reflection);
    state = addReflection(state, { ...reflection, note: "Düzeltilmiş not." });
    expect(state.reflections).toHaveLength(1);
    expect(state.reflections[0].note).toBe("Düzeltilmiş not.");
  });
  it("does not recommend completed work as a new opportunity", () => {
    const state = addReflection(doneState(), reflection);
    expect(
      recommendations(state).some(
        (value) => value.item.id === reflection.opportunityId,
      ),
    ).toBe(false);
  });
  it("uses the wish to try another field rather than treating access barriers as disinterest", () => {
    const same = recommendations(addReflection(doneState(), reflection))[0];
    const different = recommendations(
      addReflection(doneState(), { ...reflection, next: "baska" }),
    )[0];
    expect(
      same.item.fields.some((value) =>
        ["teknoloji", "tasarim"].includes(value),
      ),
    ).toBe(true);
    expect(
      different.item.fields.some((value) =>
        ["teknoloji", "tasarim"].includes(value),
      ),
    ).toBe(false);
    expect(different.reasons[0]).toContain("Başka bir alanı");
  });
});

describe("safe versioned persistence", () => {
  it("round-trips full demo data", () => {
    const state = addReflection(doneState(), reflection);
    let raw = "";
    const storage = {
      setItem: (_key: string, value: string) => {
        raw = value;
      },
      getItem: () => raw,
    };
    expect(persistState(storage, state)).toBe(true);
    expect(loadState(storage).state).toEqual(state);
    expect(validState(state)).toBe(true);
  });
  it("handles corrupt, outdated and structurally invalid storage", () => {
    for (const value of [
      "bad json",
      JSON.stringify({ version: 2 }),
      JSON.stringify({ ...starting(), tracks: [{}] }),
      JSON.stringify({ ...starting(), profile: { grade: "9" } }),
    ]) {
      expect(loadState({ getItem: () => value }).state).toEqual(freshState());
      expect(loadState({ getItem: () => value }).warning).toBeTruthy();
    }
  });
  it("handles denied storage reads and writes without crashing", () => {
    expect(
      loadState({
        getItem: () => {
          throw Error("denied");
        },
      }).state,
    ).toEqual(freshState());
    expect(
      persistState(
        {
          setItem: () => {
            throw Error("quota");
          },
        },
        starting(),
      ),
    ).toBe(false);
  });
  it("rejects impossible preferences and dates", () => {
    expect(validProfile({ ...personas.defne, interests: ["madeup"] })).toBe(
      false,
    );
    expect(validProfile({ ...personas.defne, hours: -1 })).toBe(false);
    expect(validDate("2026-02-30")).toBe(false);
    expect(validDate("2026-10-24")).toBe(true);
    expect(datePlus("2026-10-31", 1)).toBe("2026-11-01");
  });
});
