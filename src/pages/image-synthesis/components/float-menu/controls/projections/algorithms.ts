import { Point } from "../../../canvas/types";
import { Point3D, ProjectionPlane } from "./types";

/**
 * Realiza a projeção ortográfica de um ponto 3D para 2D em um plano especificado.
 * A projeção ortográfica descarta uma das coordenadas do ponto 3D com base no plano escolhido,
 * mapeando o ponto para um espaço 2D sem considerar a perspectiva.
 * @param point - O ponto 3D a ser projetado.
 * @param plane - O plano de projeção desejado. Pode ser 'XY', 'XZ' ou 'YZ'. Padrão é 'XY'.
 * @returns O ponto 2D resultante da projeção.
 */
export function orthographicProjection(
  point: Point3D,
  plane: ProjectionPlane = "XY"
): Point {
  switch (plane) {
    case "XY":
      return { x: Math.round(point.x), y: Math.round(point.y) };
    case "XZ":
      return { x: Math.round(point.x), y: Math.round(point.z) };
    case "YZ":
      return { x: Math.round(point.y), y: Math.round(point.z) };
    default:
      return { x: Math.round(point.x), y: Math.round(point.y) };
  }
}

/**
 * Realiza a projeção cavalier de um ponto 3D para 2D.
 * @param point Ponto 3D a ser projetado.
 * @param angle Ângulo de projeção em graus.
 * @param scale Fator de escala para a profundidade.
 * @returns Ponto 2D projetado.
 */
export function cavalierProjection(
  point: Point3D,
  angle: number = 20,
  scale: number = 0.25
): Point {
  const theta = (angle * Math.PI) / 180; // Converte para radianos
  const xPrime = point.x + scale * Math.cos(theta) * point.z;
  const yPrime = point.y + scale * Math.sin(theta) * point.z;
  return { x: Math.round(xPrime), y: Math.round(yPrime) };
}

/**
 * Realiza a projeção em perspectiva de um ponto 3D para 2D.
 * @param point Ponto 3D a ser projetado.
 * @param d Distância do observador ao plano de projeção.
 * @returns Ponto 2D projetado.
 */
export function perspectiveProjection(point: Point3D, d: number = 100): Point {
  const zAdjusted = point.z + d;
  const xPrime = (point.x * d) / zAdjusted;
  const yPrime = (point.y * d) / zAdjusted;
  return { x: Math.round(xPrime), y: Math.round(yPrime) };
}


export function cabinetProjection(
  point: Point3D,
  angle: number = 45   // em graus
): Point {
  const theta = (angle * Math.PI) / 180;
  const xPrime = point.x + 0.5 * Math.cos(theta) * point.z;
  const yPrime = point.y + 0.5 * Math.sin(theta) * point.z;
  return { x: Math.round(xPrime), y: Math.round(yPrime) };
}