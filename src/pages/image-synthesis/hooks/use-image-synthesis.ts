import { useContext } from "react";
import { ImageSynthesisCtx } from "@/pages/image-synthesis/contexts/image-synthesis";

export function useImageSynthesis() {
  const ctx = useContext(ImageSynthesisCtx);
  if (!ctx) {
    throw new Error(
      "useImageSynthesis must be used within a ImageSynthesisProvider"
    );
  }
  return ctx;
}
