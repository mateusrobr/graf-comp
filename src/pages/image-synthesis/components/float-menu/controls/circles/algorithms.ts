import { Point } from "../../../canvas/types";

/**
 * Função que implementa o algoritmo de Bresenham para desenhar um círculo.
 * @param center Ponto central do círculo.
 * @param radius Raio do círculo.
 * @returns Array de pontos que representam o perímetro do círculo.
 */
export function drawCircle(center: Point, radius: number): Point[] {
  const points: Point[] = []; // Array para armazenar os pontos do círculo

  // Coordenadas iniciais
  let x = 0;
  let y = radius;

  // Valor de decisão inicial
  let d = 1 - radius;

  // Adiciona os pontos iniciais nas oito seções do círculo
  addCirclePoints(points, center, x, y);

  // Loop para calcular os pontos do círculo usando o algoritmo de Bresenham
  while (x < y) {
    x++; // Incrementa x para avançar pelo perímetro do círculo

    if (d < 0) {
      // Ponto escolhido está dentro do círculo
      d += 2 * x + 1; // Atualiza o valor de decisão
    } else {
      // Ponto escolhido está fora ou na borda do círculo
      y--; // Decrementa y para aproximar-se do perímetro
      d += 2 * (x - y) + 1; // Atualiza o valor de decisão
    }

    // Adiciona os pontos calculados nas oito seções do círculo
    addCirclePoints(points, center, x, y);
  }

  return points; // Retorna o array de pontos do círculo
}

/**
 * Função auxiliar que adiciona os pontos simétricos do círculo nas oito seções.
 * @param points Array onde os pontos serão adicionados.
 * @param center Ponto central do círculo.
 * @param x Coordenada x atual.
 * @param y Coordenada y atual.
 */
function addCirclePoints(
  points: Point[],
  center: Point,
  x: number,
  y: number
): void {
  // Adiciona os pontos nos quatro quadrantes principais
  points.push({ x: center.x + x, y: center.y + y }); // Quadrante I
  points.push({ x: center.x - x, y: center.y + y }); // Quadrante II
  points.push({ x: center.x + x, y: center.y - y }); // Quadrante IV
  points.push({ x: center.x - x, y: center.y - y }); // Quadrante III

  // Adiciona os pontos espelhados sobre a linha y = x
  points.push({ x: center.x + y, y: center.y + x });
  points.push({ x: center.x - y, y: center.y + x });
  points.push({ x: center.x + y, y: center.y - x });
  points.push({ x: center.x - y, y: center.y - x });
}
