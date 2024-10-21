import { createContext, PropsWithChildren, useState } from "react";

import { ImageSynthesisCtxData } from "./types";
import { Algorithms } from "@/pages/image-synthesis/types";
import { Point } from "../../components/canvas/types";

export const ImageSynthesisCtx = createContext({} as ImageSynthesisCtxData);

export function ImageSynthesisProvider({ children }: PropsWithChildren) {
  const [algorithm, setAlgorithm] = useState<Algorithms>("bresenham");
  const [points, setPoints] = useState<Point[]>([]);
  const [canvasDensity, setCanvasDensity] = useState<number>(15);
  const [cropWindowPoints, setCropWindowPoints] = useState<Point[]>([]);

  const [isCanvasClickDisabled, setIsCanvasClickDisabled] = useState(false);

  return (
    <ImageSynthesisCtx.Provider
      value={{
        algorithm,
        setAlgorithm,
        points,
        setPoints,
        canvasDensity,
        setCanvasDensity,
        cropWindowPoints,
        setCropWindowPoints,
        isCanvasClickDisabled,
        setIsCanvasClickDisabled,
      }}
    >
      {children}
    </ImageSynthesisCtx.Provider>
  );
}
