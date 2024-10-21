import { Point } from "../../../canvas/types";

/**
 * Aplica uma translação em um conjunto de pontos
 * @param points - Conjunto de pontos
 * @param transformation - Translação a ser aplicada
 * @returns Novo conjunto de pontos
 */
export function applyTranslation(points: Point[], transformation: Point) {
  const newPoints: Point[] = points.map((point) => ({
    // Adiciona a translação em cada ponto
    x: point.x + transformation.x,
    y: point.y + transformation.y,
  }));

  return newPoints;
}

/**
 * Aplica uma rotação em um conjunto de pontos com base em um ponto fixo
 * @param points - Conjunto de pontos
 * @param angle - Ângulo de rotação
 * @param fixPoint - Ponto fixo
 * @returns Novo conjunto de pontos
 */
export function applyRotation(points: Point[], angle: number, fixPoint: Point) {
  // Converte o ângulo para radianos
  const angleRad = (angle * Math.PI) / 180;

  // Aplica a rotação em cada ponto
  const newPoints: Point[] = points.map((point) => {
    const x =
      fixPoint.x +
      (point.x - fixPoint.x) * Math.cos(angleRad) -
      (point.y - fixPoint.y) * Math.sin(angleRad);
    const y =
      fixPoint.y +
      (point.x - fixPoint.x) * Math.sin(angleRad) +
      (point.y - fixPoint.y) * Math.cos(angleRad);

    return { x: Math.round(x), y: Math.round(y) };
  });

  return newPoints;
}

/**
 * Aplica uma escala em um conjunto de pontos com base em um ponto fixo
 * @param points - Conjunto de pontos
 * @param scale - Escala
 * @param fixPoint - Ponto fixo
 * @returns Novo conjunto de pontos
 */
export function applyScale(
  points: Point[],
  scale: {
    xPercent: number;
    yPercent: number;
  },
  fixPoint: Point
): Point[] {
  const newPoints: Point[] = points.map((point) => {
    const x = fixPoint.x + (point.x - fixPoint.x) * scale.xPercent;
    const y = fixPoint.y + (point.y - fixPoint.y) * scale.yPercent;

    return { x: Math.round(x), y: Math.round(y) };
  });

  return newPoints;
}
