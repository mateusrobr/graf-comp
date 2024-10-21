import { Point } from "../../../canvas/types";

/**
 * Calcula o ponto de interseção entre duas linhas definidas por (p1, p2) e (p3, p4).
 * @param p1 Primeiro ponto da primeira linha.
 * @param p2 Segundo ponto da primeira linha.
 * @param p3 Primeiro ponto da segunda linha.
 * @param p4 Segundo ponto da segunda linha.
 * @returns O ponto de interseção.
 */
function computeIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point {
  const denominator =
    (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

  const intersectX =
    ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) -
      (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) /
    denominator;

  const intersectY =
    ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) -
      (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) /
    denominator;

  return { x: intersectX, y: intersectY };
}

/**
 * Determina se um ponto está dentro do lado "interno" da aresta de recorte.
 * @param p Ponto a ser testado.
 * @param clipEdgeStart Ponto inicial da aresta de recorte.
 * @param clipEdgeEnd Ponto final da aresta de recorte.
 * @returns Verdadeiro se o ponto está dentro, falso caso contrário.
 */
function isInside(p: Point, clipEdgeStart: Point, clipEdgeEnd: Point): boolean {
  // Calcula a posição do ponto em relação à aresta de recorte usando produto vetorial
  const position =
    (clipEdgeEnd.x - clipEdgeStart.x) * (p.y - clipEdgeStart.y) -
    (clipEdgeEnd.y - clipEdgeStart.y) * (p.x - clipEdgeStart.x);
  return position < 0; // Assume que o interior está à esquerda da aresta
}

/**
 * Realiza o recorte de um polígono contra uma única aresta de recorte.
 * @param polygon Polígono a ser recortado.
 * @param clipEdgeStart Ponto inicial da aresta de recorte.
 * @param clipEdgeEnd Ponto final da aresta de recorte.
 * @returns Novo polígono após o recorte.
 */
function clipPolygon(
  polygon: Point[],
  clipEdgeStart: Point,
  clipEdgeEnd: Point
): Point[] {
  const newPolygon: Point[] = [];

  for (let i = 0; i < polygon.length; i++) {
    const currentPoint = polygon[i];
    const prevPoint = polygon[(i - 1 + polygon.length) % polygon.length];

    const isCurrentInside = isInside(currentPoint, clipEdgeStart, clipEdgeEnd);
    const isPrevInside = isInside(prevPoint, clipEdgeStart, clipEdgeEnd);

    if (isCurrentInside) {
      if (!isPrevInside) {
        // Entrada: adiciona o ponto de interseção
        const intersection = computeIntersection(
          prevPoint,
          currentPoint,
          clipEdgeStart,
          clipEdgeEnd
        );
        newPolygon.push(intersection);
      }
      // Adiciona o ponto atual
      newPolygon.push(currentPoint);
    } else if (isPrevInside) {
      // Saída: adiciona o ponto de interseção
      const intersection = computeIntersection(
        prevPoint,
        currentPoint,
        clipEdgeStart,
        clipEdgeEnd
      );
      newPolygon.push(intersection);
    }
    // Se ambos os pontos estiverem fora, não faz nada
  }

  return newPolygon;
}

/**
 * Implementa o algoritmo de Sutherland–Hodgman para recorte de polígonos.
 * @param polygon Polígono a ser recortado.
 * @param clipWindow Objeto definindo a janela de recorte com pontos mínimos e máximos.
 * @returns Novo polígono após o recorte.
 */
export function sutherlandHodgmanClip(
  polygon: Point[],
  clipWindow: { min: Point; max: Point }
): Point[] {
  const { min, max } = clipWindow;

  // Define as quatro arestas da janela de recorte em ordem horária
  const clipEdges: [Point, Point][] = [
    // Esquerda
    [
      { x: min.x, y: min.y },
      { x: min.x, y: max.y },
    ],
    // Superior
    [
      { x: min.x, y: max.y },
      { x: max.x, y: max.y },
    ],
    // Direita
    [
      { x: max.x, y: max.y },
      { x: max.x, y: min.y },
    ],
    // Inferior
    [
      { x: max.x, y: min.y },
      { x: min.x, y: min.y },
    ],
  ];

  let clippedPolygon = polygon;

  // Realiza o recorte contra cada aresta da janela
  for (const [clipEdgeStart, clipEdgeEnd] of clipEdges) {
    clippedPolygon = clipPolygon(clippedPolygon, clipEdgeStart, clipEdgeEnd);
    if (clippedPolygon.length === 0) {
      break; // Polígono totalmente fora da janela
    }
  }

  return clippedPolygon;
}
