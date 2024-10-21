export type Algorithms =
  | "bresenham"
  | "circulos"
  | "elipses"
  | "bezier"
  | "polilinha"
  | "preenchimento"
  | "recorte-linha"
  | "recorte-poligonos"
  | "transformacoes"
  | "projecoes";

export type AlgorithmsOptions = Array<{
  value: Algorithms;
  label: string;
}>;
