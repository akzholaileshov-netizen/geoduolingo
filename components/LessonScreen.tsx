"use client";

import { Heart, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { DuoButton } from "@/components/DuoButton";
import type { ChoicePin } from "@/components/LessonMap";
import { Splash } from "@/components/Providers";
import { useRequireProfile } from "@/components/AppShell";
import { findLesson, focusZoom, getModule, getPlace, questionsForLesson } from "@/lib/curriculum";
import { formatKm } from "@/lib/geo";
import { XP_PER_CORRECT } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

const LessonMap = dynamic(() => import("@/components/LessonMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#d7ecff]" />,
});

const letters = ["A", "B", "C", "D"];

export function LessonScreen() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;
  const lesson = findLesson(lessonId);
  const profile = useRequireProfile();
  const session = useAppStore((state) => state.session);
  const startLesson = useAppStore((state) => state.startLesson);
  const setPin = useAppStore((state) => state.setPin);
  const setChoice = useAppStore((state) => state.setChoice);
  const checkAnswer = useAppStore((state) => state.checkAnswer);
  const nextQuestion = useAppStore((state) => state.nextQuestion);
  const router = useRouter();

  const startedLesson = useRef<string | null>(null);
  useEffect(() => {
    if (!profile || !lesson) return;
    if (startedLesson.current === lesson.id) return;
    startedLesson.current = lesson.id;
    startLesson(lesson.id);
  }, [profile, lesson, startLesson]);

  const questions = useMemo(() => (lesson ? questionsForLesson(lesson.id) : []), [lesson]);
  const active = session?.lessonId === lessonId && session.status === "active" ? session : null;
  const question = active ? questions[active.index] : undefined;

  if (!profile) return <Splash />;
  if (!lesson) {
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
  if (!question || !active) return <Splash />;

  const place = getPlace(question.placeId);
  const skillModule = getModule(lesson.moduleId);
  const selectedChoice = active.selected?.type === "choice" ? active.selected.optionId : null;
  const userPin = active.selected?.type === "pinpoint" ? active.selected : null;
  const showReveal = active.checked && question.type === "pinpoint";
  const choices: ChoicePin[] =
    question.type === "pick"
      ? question.optionIds.map((id, index) => {
          const option = getPlace(id);
          let tone: ChoicePin["tone"] = "idle";
          if (active.checked) {
            if (id === question.placeId) tone = "correct";
            else if (id === selectedChoice) tone = "wrong";
            else tone = "muted";
          } else if (id === selectedChoice) {
            tone = "selected";
          }
          return { id, lat: option.lat, lng: option.lng, letter: letters[index] ?? "?", tone };
        })
      : [];

  let fitKey = "";
  let zoom = skillModule.zoom;
  let center: [number, number] = skillModule.center;
  if (question.type === "identify") {
    center = [place.lat, place.lng];
    zoom = focusZoom(place);
    fitKey = `${place.lat},${place.lng}`;
  } else if (question.type === "pick") {
    fitKey = choices.map((choice) => `${choice.lat},${choice.lng}`).join(";");
  }
  if (showReveal && userPin) {
    fitKey = `${userPin.lat},${userPin.lng};${place.lat},${place.lng}`;
    zoom = 5;
  }

  const canCheck = question.type === "pinpoint" ? Boolean(userPin) : Boolean(selectedChoice);
  const correct = active.lastResult?.correct ?? false;
  const ending = active.hearts <= 0 || active.index >= questions.length - 1;

  function quit() {
    const leave = window.confirm("Сабақтан шыққың келе ме? Бұл әрекеттің ұпайы сақталмайды.");
    if (leave) router.push("/");
  }

  function handleNext() {
    nextQuestion();
    if (ending) router.push(`/lesson/${lessonId}/result`);
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col bg-[#f4fbf0]">
      <header className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={quit} aria-label="Жабу" className="text-[#afafaf]">
          <X size={28} />
        </button>
        <div className="flex flex-1 gap-1">
          {questions.map((item, index) => {
            const mark = active.answers[index];
            const color =
              mark === "correct" ? "bg-[#58cc02]" : mark === "wrong" ? "bg-[#ff4b4b]" : index === active.index ? "bg-[#1cb0f6]" : "bg-[#e5e5e5]";
            return <div key={item.id} className={`h-3 flex-1 rounded-full ${color}`} />;
          })}
        </div>
        <div
          className={`flex items-center ${active.checked && !correct ? "animate-nibble" : ""}`}
          data-testid="hearts"
          data-hearts={active.hearts}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Heart
              key={index}
              size={18}
              fill={index < active.hearts ? "#ff4b4b" : "transparent"}
              color={index < active.hearts ? "#ff4b4b" : "#e5e5e5"}
            />
          ))}
        </div>
      </header>
      <p className="px-4 text-center text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
        {lesson.titleKk} · {active.index + 1}/{questions.length}
      </p>
      <h1 className="px-5 pt-2 text-center text-xl font-extrabold leading-tight" data-testid="lesson-prompt">
        {question.promptKk}
      </h1>
      <p className="px-5 pb-3 text-center text-sm font-bold text-[#777]">
        {question.type === "pinpoint"
          ? "Картаны жылжытып, жақындат та, орынды бас."
          : question.type === "pick"
            ? "Дұрыс әріпті картадан немесе төменнен таңда."
            : "Төрт нұсқаның бірін таңда."}
      </p>
      <div className="relative mx-4 min-h-[280px] flex-1" data-testid="map-root">
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border-2 border-[#e5e5e5]">
        <LessonMap
          key={question.id}
          center={center}
          zoom={zoom}
          fitKey={fitKey}
          userPin={userPin}
          userTone={!active.checked ? "selected" : correct ? "correct" : "wrong"}
          onMapClick={question.type === "pinpoint" && !active.checked ? setPin : undefined}
          choices={choices}
          onChoice={question.type === "pick" && !active.checked ? setChoice : undefined}
          highlight={question.type === "identify" ? { lat: place.lat, lng: place.lng } : null}
          reveal={showReveal ? { lat: place.lat, lng: place.lng, radiusKm: place.radiusKm } : null}
        />
        </div>
        {question.type === "identify" ? (
          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#1cb0f6] shadow">
            Белгіленген нысан
          </div>
        ) : null}
      </div>
      {question.type === "identify" ? (
        <div className="grid grid-cols-2 gap-2 px-4 pt-3">
          {question.optionIds.map((id) => {
            const option = getPlace(id);
            const picked = selectedChoice === id;
            let tone = "border-[#e5e5e5] bg-white text-[#3c3c3c]";
            if (active.checked && id === question.placeId) tone = "border-[#58cc02] bg-[#e8f8d8] text-[#46a302]";
            else if (active.checked && picked) tone = "border-[#ff4b4b] bg-[#ffecec] text-[#ea2b2b]";
            else if (picked) tone = "border-[#1cb0f6] bg-[#e7f6ff] text-[#1899d6]";
            return (
              <button
                key={id}
                type="button"
                data-testid={`choice-${id}`}
                disabled={active.checked}
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
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              data-testid={`choice-${choice.id}`}
              disabled={active.checked}
              onClick={() => setChoice(choice.id)}
              className={`rounded-2xl border-2 border-b-4 py-3 text-sm font-extrabold ${
                choice.tone === "correct"
                  ? "border-[#58cc02] bg-[#e8f8d8] text-[#46a302]"
                  : choice.tone === "wrong"
                    ? "border-[#ff4b4b] bg-[#ffecec] text-[#ea2b2b]"
                    : choice.tone === "selected"
                      ? "border-[#1cb0f6] bg-[#1cb0f6] text-white"
                      : "border-[#e5e5e5] bg-white text-[#3c3c3c]"
              }`}
            >
              {choice.letter}
            </button>
          ))}
        </div>
      ) : null}
      <div className={`mt-3 px-4 pb-4 ${active.checked ? "animate-pop" : ""}`}>
        {active.checked ? (
          <div className={`rounded-[28px] p-4 ${correct ? "bg-[#58cc02]" : "bg-[#ff4b4b]"}`}>
            <p className="text-xl font-extrabold text-white">{correct ? "Дұрыс!" : "Қате"}</p>
            <p className="mt-1 text-sm font-bold text-white/95">
              {question.type === "pinpoint" && active.lastResult?.distanceKm !== undefined
                ? `Қашықтық: ${formatKm(active.lastResult.distanceKm)}. Шегі: ${place.radiusKm} км.`
                : correct
                  ? `+${XP_PER_CORRECT} XP`
                  : `Дұрыс жауап: ${place.nameKk}`}
            </p>
            {correct && question.type === "pinpoint" ? (
              <p className="text-sm font-bold text-white">+{XP_PER_CORRECT} XP</p>
            ) : null}
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
    </div>
  );
}
