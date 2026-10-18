import { Suspense } from "react";
import { LessonScreen } from "@/components/LessonScreen";
import { Splash } from "@/components/Providers";

export default function LessonPage() {
  return (
    <Suspense fallback={<Splash />}>
      <LessonScreen />
    </Suspense>
  );
}
