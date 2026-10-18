import { Suspense } from "react";
import { ResultScreen } from "@/components/ResultScreen";
import { Splash } from "@/components/Providers";

export default function ResultPage() {
  return (
    <Suspense fallback={<Splash />}>
      <ResultScreen />
    </Suspense>
  );
}
