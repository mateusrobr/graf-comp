import { Point } from "../components/canvas/types";

/**
 * Função que verifica se um ponto está dentro de um polígono, excluindo as arestas.
 * @param point O ponto a ser verificado.
 * @param polygon Array de pontos que definem os vértices do polígono, em ordem.
 * @returns `true` se o ponto estiver estritamente dentro do polígono, `false` caso contrário.
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const { x, y } = point;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    // Verifica se o ponto está exatamente sobre a aresta
    if (isPointOnLineSegment(point, { x: xi, y: yi }, { x: xj, y: yj })) {
      return false; // O ponto está na aresta, não é considerado dentro
    }

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}
/**
 * Função que verifica se um ponto está sobre uma aresta definida por dois pontos.
 * @param p Ponto a ser verificado.
 * @param a Ponto inicial da aresta.
 * @param b Ponto final da aresta.
 * @returns `true` se o ponto estiver sobre a aresta, `false` caso contrário.
 */
function isPointOnLineSegment(p: Point, a: Point, b: Point): boolean {
  // Calcula a área do paralelogramo (se for zero, os pontos são colineares)
  const cross = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
  if (Math.abs(cross) > Number.EPSILON) return false;

  // Verifica se o ponto está entre 'a' e 'b'
  const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
  if (dot < 0) return false;

  const squaredLengthBA = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (dot > squaredLengthBA) return false;

  return true;
}
