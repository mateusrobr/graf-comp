import { Point } from "../../../canvas/types";

export function drawEllipse(
  center: Point,
  radiusX: number,
  radiusY: number
): Point[] {
  const points: Point[] = [];

  // Precomputação dos quadrados dos raios para otimizar cálculos
  const rxSq = radiusX * radiusX;
  const rySq = radiusY * radiusY;

  // Ponto inicial (0, radiusY)
  let x = 0;
  let y = radiusY;

  // Variáveis auxiliares para o cálculo das diferenças incrementais
  let dx = 2 * rySq * x;
  let dy = 2 * rxSq * y;

  // Parâmetro de decisão inicial para a Região 1
  let p1 = rySq - rxSq * radiusY + 0.25 * rxSq;

  // Região 1: Inclinação da elipse >= -1
  while (dx < dy) {
    // Adiciona os pontos simétricos nas quatro regiões da elipse
    addSymmetricPoints(points, center, x, y);

    x++;
    dx += 2 * rySq;

    if (p1 < 0) {
      // Próximo ponto está dentro da elipse
      p1 += dx + rySq;
    } else {
      // Próximo ponto está fora ou na borda da elipse
      y--;
      dy -= 2 * rxSq;
      p1 += dx - dy + rySq;
    }
  }

  // Parâmetro de decisão inicial para a Região 2
  let p2 =
    rySq * (x + 0.5) * (x + 0.5) + rxSq * (y - 1) * (y - 1) - rxSq * rySq;

  // Região 2: Inclinação da elipse < -1
  while (y >= 0) {
    // Adiciona os pontos simétricos nas quatro regiões da elipse
    addSymmetricPoints(points, center, x, y);

    y--;
    dy -= 2 * rxSq;

    if (p2 > 0) {
      // Próximo ponto está fora da elipse
      p2 += rxSq - dy;
    } else {
      // Próximo ponto está dentro ou na borda da elipse
      x++;
      dx += 2 * rySq;
      p2 += dx - dy + rxSq;
    }
  }

  return points;
}

// Função auxiliar para adicionar pontos simétricos da elipse
function addSymmetricPoints(
  points: Point[],
  center: Point,
  x: number,
  y: number
): void {
  points.push({ x: center.x + x, y: center.y + y }); // Quadrante I
  points.push({ x: center.x - x, y: center.y + y }); // Quadrante II
  points.push({ x: center.x + x, y: center.y - y }); // Quadrante IV
  points.push({ x: center.x - x, y: center.y - y }); // Quadrante III
}
