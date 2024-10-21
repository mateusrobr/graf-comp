import { AlgorithmsOptions } from "@/pages/image-synthesis/types";

export const ALGORITHM_OPTIONS: AlgorithmsOptions = [
  {
    value: "bresenham",
    label: "Bresenham",
  },
  {
    value: "circulos",
    label: "Círculos",
  },
  {
    value: "elipses",
    label: "Elipses",
  },
  {
    value: "bezier",
    label: "Curvas de Bézier grau 2 e 3",
  },
  {
    value: "polilinha",
    label: "Polilinha",
  },
  {
    value: "preenchimento",
    label: "Preenchimento",
  },
  {
    value: "recorte-linha",
    label: "Recorte de linhas",
  },
  {
    value: "recorte-poligonos",
    label: "Recorte de polígonos",
  },
  {
    value: "transformacoes",
    label: "Transformações",
  },
  {
    value: "projecoes",
    label: "Projeções",
  },
];
