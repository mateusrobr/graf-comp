import { Point } from "../../../canvas/types";

/**
 * Função que implementa o algoritmo de Bresenham para desenhar uma linha entre dois pontos.
 * @param a Ponto inicial da linha.
 * @param b Ponto final da linha.
 * @returns Array de pontos que representam a linha entre 'a' e 'b'.
 */
export function bresenham(start: Point, end: Point): Point[] {
  const { x: startX, y: startY } = start;
  const { x: endX, y: endY } = end;

  const points: Point[] = [];

  // Calcula as diferenças nas coordenadas X e Y entre o ponto inicial e o final
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Calcula os valores absolutos das diferenças, úteis para determinar a inclinação
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  // Inicializa as coordenadas x e y com os valores iniciais
  let x = startX;
  let y = startY;
  points.push({ x, y }); // Adiciona o ponto inicial à lista de pontos

  // Caso de inclinação menor que 1 (linha mais horizontal que vertical)
  if (absDeltaX > absDeltaY) {
    // Inicializa o erro para a decisão do próximo ponto
    let error = 2 * absDeltaY - absDeltaX;

    for (let i = 0; i < absDeltaX; i++) {
      // Decide a direção do próximo ponto no eixo X
      x = deltaX < 0 ? x - 1 : x + 1;

      if (error < 0) {
        error += 2 * absDeltaY; // Ajusta o erro sem mover no eixo Y
      } else {
        y = deltaY < 0 ? y - 1 : y + 1; // Move no eixo Y se o erro for significativo
        error += 2 * absDeltaY - 2 * absDeltaX; // Atualiza o erro após o movimento em Y
      }

      points.push({ x, y }); // Adiciona o ponto atual à lista de pontos
    }
  } else {
    // Caso de inclinação maior ou igual a 1 (linha mais vertical que horizontal)
    // Inicializa o erro para a decisão do próximo ponto
    let error = 2 * absDeltaX - absDeltaY;

    for (let i = 0; i < absDeltaY; i++) {
      // Decide a direção do próximo ponto no eixo Y
      y = deltaY < 0 ? y - 1 : y + 1;

      if (error < 0) {
        error += 2 * absDeltaX; // Ajusta o erro sem mover no eixo X
      } else {
        x = deltaX < 0 ? x - 1 : x + 1; // Move no eixo X se o erro for significativo
        error += 2 * absDeltaX - 2 * absDeltaY; // Atualiza o erro após o movimento em X
      }

      points.push({ x, y }); // Adiciona o ponto atual à lista de pontos
    }
  }

  return points; // Retorna todos os pontos que formam a linha entre os pontos inicial e final
}

/**
 * Função que desenha linhas entre pontos consecutivos usando o algoritmo de Bresenham.
 * @param points Array de pontos pelos quais as linhas serão traçadas.
 * @returns Array de pontos que representam todas as linhas entre os pontos fornecidos.
 */
export function drawNearestPoints(points: Point[]): Point[] {
  const nearestPoints: Point[] = []; // Array para armazenar todos os pontos das linhas

  // Itera sobre os pontos, desenhando uma linha entre cada par de pontos consecutivos
  for (let i = 0; i < points.length - 1; i++) {
    // Obtém os pontos da linha entre 'points[i]' e 'points[i + 1]' usando o algoritmo de Bresenham
    const linePoints = bresenham(points[i], points[i + 1]);

    // Adiciona os pontos da linha ao array principal
    nearestPoints.push(...linePoints);
  }

  // Retorna o array de pontos que representam todas as linhas desenhadas
  return nearestPoints;
}
