import { Algorithms } from "@/pages/image-synthesis/types";
import { Point } from "../../components/canvas/types";

export type ImageSynthesisCtxData = {
  algorithm: Algorithms;
  setAlgorithm: (algorithm: Algorithms) => void;
  points: Point[];
  setPoints: (points: Point[]) => void;
  canvasDensity: number;
  setCanvasDensity: (density: number) => void;
  cropWindowPoints: Point[];
  setCropWindowPoints: (points: Point[]) => void;
  isCanvasClickDisabled: boolean;
  setIsCanvasClickDisabled: (isDisabled: boolean) => void;
};
