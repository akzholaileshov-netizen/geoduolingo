"use client";

import { Heart, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DuoButton } from "@/components/DuoButton";
import { SoundToggle } from "@/components/SoundToggle";
import { playTone, unlockAudio } from "@/lib/audio";
import { EurasiaMap, type MapFlash, type MapRegionState, type RegionTone } from "@/components/EurasiaMap";
import { Splash } from "@/components/Providers";
import { useRequireProfile } from "@/components/AppShell";
import { findLesson, findQuiz, getPlace, questionsForLesson } from "@/lib/curriculum";
import { frameFor } from "@/lib/map-regions";
import { lessonContinueHref } from "@/lib/progress";
import { XP_PER_CORRECT } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

const letters = ["A", "B", "C", "D"];

function formatClock(startedAt: number, finishedAt: number) {
  const total = Math.max(0, Math.floor((finishedAt - startedAt) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function LessonScreen() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;
  const quiz = findQuiz(lessonId);
  const sectionOnly = findLesson(lessonId);
  const profile = useRequireProfile();
  const session = useAppStore((state) => state.session);
  const startLesson = useAppStore((state) => state.startLesson);
  const setChoice = useAppStore((state) => state.setChoice);
  const gradeMapClick = useAppStore((state) => state.gradeMapClick);
  const checkAnswer = useAppStore((state) => state.checkAnswer);
  const nextQuestion = useAppStore((state) => state.nextQuestion);
  const router = useRouter();
  const [flash, setFlash] = useState<{ id: string; level: "yellow" | "orange" } | null>(null);
  const [blinkId, setBlinkId] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const fanfarePlayed = useRef(false);

  useEffect(() => {
    if (quiz || !sectionOnly) return;
    router.replace(`/continent/${sectionOnly.continentId}/${sectionOnly.id}`);
  }, [quiz, sectionOnly, router]);

  const startedLesson = useRef<string | null>(null);
  useEffect(() => {
    if (!profile || !quiz) return;
    if (startedLesson.current === quiz.subTopic.id) return;
    startedLesson.current = quiz.subTopic.id;
    startLesson(quiz.subTopic.id);
  }, [profile, quiz, startLesson]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) window.clearTimeout(timer);
    };
  }, []);

  const questions = quiz ? questionsForLesson(quiz.subTopic.id) : [];
  const view = session?.lessonId === lessonId ? session : null;
  const active = view?.status === "active" ? view : null;
  const finished = view && view.status !== "active" ? view : null;
  const question = view ? questions[view.index] : undefined;

  useEffect(() => {
    if (!finished || finished.status !== "passed" || fanfarePlayed.current) return;
    fanfarePlayed.current = true;
    playTone("done");
  }, [finished]);

  if (!profile || sectionOnly) return <Splash />;
  if (!quiz) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <p className="text-xl font-extrabold">Сабақ табылмады</p>
          <div className="mt-4">
            <DuoButton onClick={() => router.push("/")}>Басты бетке</DuoButton>
          </div>
        </div>
      </div>
    );
  }
  if (!question || !view) return <Splash />;

  const place = getPlace(question.placeId);
  const selectedChoice = view.selected?.type === "choice" ? view.selected.optionId : null;
  const placeIds = quiz.subTopic.placeIds;
  const frame = frameFor(placeIds);
  const mapQuestion = question.type === "pinpoint";

  function effectFor(id: string): MapFlash | undefined {
    if (blinkId === id) return "blink";
    if (flash?.id === id) return flash.level;
    return undefined;
  }

  function toneFor(id: string, fallback: RegionTone): RegionTone {
    const lock = view?.locks[id];
    if (lock === "found") return "found";
    if (lock === "missed") return "missed";
    return fallback;
  }

  let mapRegions: MapRegionState[] = [];
  if (mapQuestion) {
    const seen = new Set<string>();
    mapRegions = placeIds.map((id) => {
      seen.add(id);
      const locked = view.locks[id];
      const isAnswer = id === question.placeId;
      return {
        id,
        tone: toneFor(id, "idle"),
        interactive: Boolean(active && !view.checked && (!locked || isAnswer)),
        effect: effectFor(id),
      };
    });
    for (const id of Object.keys(view.locks)) {
      if (seen.has(id)) continue;
      mapRegions.push({ id, tone: toneFor(id, "idle"), interactive: false, effect: effectFor(id) });
    }
    if (flash && !seen.has(flash.id)) {
      mapRegions.push({ id: flash.id, tone: toneFor(flash.id, "idle"), interactive: true, effect: flash.level });
    }
  } else if (question.type === "identify") {
    mapRegions = [{ id: question.placeId, tone: toneFor(question.placeId, "marked"), interactive: false, effect: effectFor(question.placeId) }];
    for (const [id, lock] of Object.entries(view.locks)) {
      if (id === question.placeId) continue;
      mapRegions.push({ id, tone: lock === "found" ? "found" : "missed", interactive: false });
    }
  } else if (question.type === "pick") {
    mapRegions = question.optionIds.map((id, index) => {
      let tone: RegionTone = "idle";
      if (view.checked) {
        if (id === question.placeId) tone = "correct";
        else if (id === selectedChoice) tone = "wrong";
        else tone = "muted";
      } else if (id === selectedChoice) {
        tone = "selected";
      }
      return { id, tone: toneFor(id, tone), letter: letters[index] ?? "?", interactive: Boolean(active && !view.checked && !view.locks[id]) };
    });
  }

  const canCheck = Boolean(selectedChoice);
  const correct = view.lastResult?.correct ?? false;
  const ending = view.hearts <= 0 || view.index >= questions.length - 1;
  const found = view.answers.filter((mark) => mark === "correct").length;
  const accuracy = questions.length ? Math.round((found / questions.length) * 100) : 0;
  const elapsed = view.finishedAt ? formatClock(view.startedAt, view.finishedAt) : "00:00";

  const sectionHref = `/continent/${quiz.lesson.continentId}/${quiz.lesson.id}`;
  function quit() {
    const leave = window.confirm("Сабақтан шыққың келе ме? Бұл әрекеттің ұпайы сақталмайды.");
    if (leave) router.push(sectionHref);
  }

  function later(ms: number, fn: () => void) {
    const timer = window.setTimeout(fn, ms);
    timers.current.push(timer);
  }

  function handleMapSelect(regionId: string) {
    if (!question) return;
    if (!active || question.type === "pick") {
      if (question.type === "pick") setChoice(regionId);
      return;
    }
    if (question.type !== "pinpoint") return;
    unlockAudio();
    const outcome = gradeMapClick(regionId);
    if (outcome === "miss1" || outcome === "miss2") {
      const token = regionId + outcome;
      setFlash({ id: regionId, level: outcome === "miss1" ? "yellow" : "orange" });
      later(400, () => {
        setFlash((current) => (current && current.id + (current.level === "yellow" ? "miss1" : "miss2") === token ? null : current));
      });
      return;
    }
    if (outcome === "correct") {
      setFlash(null);
      later(280, () => nextQuestion());
      return;
    }
    if (outcome === "miss3") {
      setFlash(null);
      setBlinkId(question.placeId);
      later(1200, () => {
        setBlinkId(null);
        nextQuestion();
      });
    }
  }

  function handleNext() {
    unlockAudio();
    nextQuestion();
  }

  function continuePath() {
    if (!finished || !profile) return;
    router.push(lessonContinueHref(lessonId, finished.status === "passed", profile.completedLessonIds));
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden bg-[#f4fbf0]">
      <header className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={quit} aria-label="Жабу" className="text-[#afafaf]">
          <X size={28} />
        </button>
        <div className="flex flex-1 gap-1">
          {questions.map((item, index) => {
            const mark = view.answers[index];
            const color =
              mark === "correct" ? "bg-[#58cc02]" : mark === "wrong" ? "bg-[#ff4b4b]" : index === view.index && active ? "bg-[#1cb0f6]" : "bg-[#e5e5e5]";
            return <div key={item.id} className={`h-3 flex-1 rounded-full ${color}`} />;
          })}
        </div>
        <div
          className={`flex items-center ${!mapQuestion && view.checked && !correct ? "animate-nibble" : ""}`}
          data-testid="hearts"
          data-hearts={view.hearts}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Heart
              key={index}
              size={18}
              fill={index < view.hearts ? "#ff4b4b" : "transparent"}
              color={index < view.hearts ? "#ff4b4b" : "#e5e5e5"}
            />
          ))}
        </div>
        <SoundToggle />
      </header>
      <p className="px-4 text-center text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
        {quiz.subTopic.titleKk} · {view.index + 1}/{questions.length}
      </p>
      <h1 className="px-5 pt-2 text-center text-xl font-extrabold leading-tight" data-testid="lesson-prompt">
        {question.promptKk}
      </h1>
      <p className="px-5 pb-3 text-center text-sm font-bold text-[#777]">
        {mapQuestion
          ? "Дұрыс аймақты картадан бас."
          : question.type === "pick"
            ? "Дұрыс әріпті картадан немесе төменнен таңда."
            : "Нұсқаның бірін таңда."}
      </p>
      <div className="relative mx-4 min-h-[280px] flex-1" data-testid="map-root">
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border-2 border-[#e5e5e5] bg-[#d7ecff]">
          <EurasiaMap
            active={mapRegions}
            frame={frame}
            selectAny={mapQuestion && Boolean(active) && !view.checked}
            onSelect={active && !view.checked ? (mapQuestion ? handleMapSelect : question.type === "pick" ? setChoice : undefined) : undefined}
          />
        </div>
      </div>
      {question.type === "identify" ? (
        <div className="grid grid-cols-2 gap-2 px-4 pt-3">
          {question.optionIds.map((id) => {
            const option = getPlace(id);
            const picked = selectedChoice === id;
            let tone = "border-[#e5e5e5] bg-white text-[#3c3c3c]";
            if (view.checked && id === question.placeId) tone = "border-[#58cc02] bg-[#e8f8d8] text-[#46a302]";
            else if (view.checked && picked) tone = "border-[#ff4b4b] bg-[#ffecec] text-[#ea2b2b]";
            else if (picked) tone = "border-[#1cb0f6] bg-[#e7f6ff] text-[#1899d6]";
            return (
              <button
                key={id}
                type="button"
                data-testid={`choice-${id}`}
                disabled={!active || view.checked}
                onClick={() => setChoice(id)}
                className={`min-h-14 rounded-2xl border-2 border-b-4 px-2 py-2 text-sm font-extrabold ${tone}`}
              >
                {option.nameKk}
              </button>
            );
          })}
        </div>
      ) : null}
      {question.type === "pick" ? (
        <div className="grid grid-cols-4 gap-2 px-4 pt-3">
          {question.optionIds.map((id, index) => {
            const letter = letters[index] ?? "?";
            const picked = selectedChoice === id;
            let tone = "border-[#e5e5e5] bg-white text-[#3c3c3c]";
            if (view.checked && id === question.placeId) tone = "border-[#58cc02] bg-[#e8f8d8] text-[#46a302]";
            else if (view.checked && picked) tone = "border-[#ff4b4b] bg-[#ffecec] text-[#ea2b2b]";
            else if (picked) tone = "border-[#1cb0f6] bg-[#1cb0f6] text-white";
            return (
              <button
                key={id}
                type="button"
                data-testid={`choice-${id}`}
                disabled={!active || view.checked}
                onClick={() => setChoice(id)}
                className={`rounded-2xl border-2 border-b-4 py-3 text-sm font-extrabold ${tone}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ) : null}
      {mapQuestion ? <div className="h-4" /> : null}
      {!mapQuestion && active ? (
        <div className={`mt-3 px-4 pb-4 ${view.checked ? "animate-pop" : ""}`}>
          {view.checked ? (
            <div className={`rounded-[28px] p-4 ${correct ? "bg-[#58cc02]" : "bg-[#ff4b4b]"}`}>
              <p className="text-xl font-extrabold text-white">{correct ? "Дұрыс!" : "Қате"}</p>
              <p className="mt-1 text-sm font-bold text-white/95">
                {correct ? `+${XP_PER_CORRECT} XP` : `Дұрыс жауап: ${place.nameKk}`}
              </p>
              <div className="mt-3">
                <DuoButton variant="white" data-testid="next-button" onClick={handleNext}>
                  {ending ? "Нәтижені көру" : "Келесі"}
                </DuoButton>
              </div>
            </div>
          ) : (
            <DuoButton data-testid="check-button" disabled={!canCheck} onClick={checkAnswer}>
              Тексеру
            </DuoButton>
          )}
        </div>
      ) : null}
      {finished ? (
        <div className="absolute inset-x-0 top-0 z-30 px-4 pt-3" data-testid="result-panel">
          <div className="animate-slide-down rounded-[28px] border-2 border-[#e5e5e5] bg-white p-5 shadow-[0_18px_50px_rgba(28,176,246,0.18)]">
            <p className="text-center text-sm font-extrabold uppercase tracking-wide text-[#afafaf]">Нәтиже</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat testId="result-accuracy" label="Дәлдік" value={`${accuracy}%`} />
              <Stat testId="result-time" label="Уақыт" value={elapsed} />
              <Stat testId="result-xp" label="XP" value={`+${view.xpEarned}`} />
            </div>
            <div className="mt-5">
              <DuoButton data-testid="continue-button" onClick={continuePath}>
                ЖАЛҒАСТЫРУ
              </DuoButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value, testId }: { label: string; value: string; testId: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-[#3c3c3c]" data-testid={testId}>
        {value}
      </p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">{label}</p>
    </div>
  );
}
