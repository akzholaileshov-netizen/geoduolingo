import { Suspense } from "react";
import { ContinentScreen } from "@/components/ContinentScreen";
import { Splash } from "@/components/Providers";

export default function ContinentPage() {
  return (
    <Suspense fallback={<Splash />}>
      <ContinentScreen />
    </Suspense>
  );
}
