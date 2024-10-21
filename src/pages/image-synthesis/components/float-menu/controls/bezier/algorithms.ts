import { Point } from "../../../canvas/types";

/**
 * Função auxiliar para realizar a interpolação linear entre dois pontos.
 * @param t Parâmetro de interpolação (varia de 0 a 1).
 * @param p0 Primeiro ponto.
 * @param p1 Segundo ponto.
 * @returns Ponto interpolado entre p0 e p1.
 */
function lerp(t: number, p0: Point, p1: Point): Point {
  return {
    x: (1 - t) * p0.x + t * p1.x,
    y: (1 - t) * p0.y + t * p1.y,
  };
}

/**
 * Função que implementa o Algoritmo de De Casteljau para calcular um ponto na curva.
 * @param controlPoints Array de pontos de controle.
 * @param t Parâmetro da curva (varia de 0 a 1).
 * @returns Ponto calculado na curva para o parâmetro t.
 */
function deCasteljau(controlPoints: Point[], t: number, degree: number): Point {
  const tempPoints = controlPoints.slice(); // Cria uma cópia dos pontos de controle

  // Realiza a interpolação recursiva entre os pontos de controle
  for (let r = 1; r <= degree; r++) {
    for (let i = 0; i <= degree - r; i++) {
      tempPoints[i] = lerp(t, tempPoints[i], tempPoints[i + 1]);
    }
  }

  return tempPoints[0]; // Retorna o ponto calculado na curva
}

/**
 * Função para calcular os pontos de uma curva de Bezier usando o Algoritmo de De Casteljau.
 * @param points Array de pontos de controle marcados pelo usuário.
 * @param numSteps Número de etapas para a discretização da curva (determina a suavidade).
 * @returns Array de pontos calculados ao longo da curva de Bezier.
 */
export function drawBezierCurve(points: Point[], numSteps: number): Point[] {
  const degree = points.length - 1; // Grau da curva de Bezier (número de pontos de controle - 1)
  const p: Point[] = []; // Array para armazenar os pontos calculados da curva

  // Loop para calcular os pontos ao longo da curva de Bezier
  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps; // Calcula o parâmetro t (entre 0 e 1)
    const point = deCasteljau(points, t, degree); // Calcula o ponto na curva para o parâmetro t
    p.push({ x: Math.round(point.x), y: Math.round(point.y) }); // Adiciona o ponto calculado ao array de pontos e arredonda as coordenadas para preencher os quadrados do canvas
  }

  return p; // Retorna o array de pontos calculados da curva
}
