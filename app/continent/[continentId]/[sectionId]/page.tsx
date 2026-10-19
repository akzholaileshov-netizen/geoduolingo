import { Suspense } from "react";
import { SectionScreen } from "@/components/SectionScreen";
import { Splash } from "@/components/Providers";

export default function SectionPage() {
  return (
    <Suspense fallback={<Splash />}>
      <SectionScreen />
    </Suspense>
  );
}
