export type Point = {
  x: number;
  y: number;
  color?: string;
};

export type ImageSynthesisCanvasProps = {
  density: number;
  onPointClick: (point: Point) => void;
  points: Point[];
  maxGridSize?: number;
};
