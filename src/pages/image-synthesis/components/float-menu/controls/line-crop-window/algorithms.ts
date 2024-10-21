import { Point } from "../../../canvas/types";
import { computeCode, RegionCode } from "@/pages/image-synthesis/utils/crop";

/**
 * Aplica o algoritmo de recorte de Cohen-Sutherland em uma linha
 * @param lineVertices - Vértices da linha
 * @param clipWindow - Janela de corte
 * @returns - Vértices da linha recortada
 */
export function cohenSutherlandClip(
  lineVertices: [Point, Point], // Vértices da linha
  clipWindow: { min: Point; max: Point }
): Point[] {
  const { x: xMin, y: yMin } = clipWindow.min;
  const { x: xMax, y: yMax } = clipWindow.max;

  const clippedVertices: Point[] = [];

  // Percorre cada par de vértices consecutivos da linha
  for (let i = 0; i < lineVertices.length; i++) {
    // Pega o vértice atual da linha
    let { x: x1, y: y1 } = lineVertices[i];

    // Pega o próximo vértice da linha
    let { x: x2, y: y2 } = lineVertices[(i + 1) % lineVertices.length];

    // Calcula o código de cada vértice (região)
    let code1 = computeCode(x1, y1, xMin, xMax, yMin, yMax);
    let code2 = computeCode(x2, y2, xMin, xMax, yMin, yMax);

    // Variável que indica se a linha foi aceita
    let accept = false;

    while (true) {
      // Se ambos os códigos forem 0, então ambos os pontos estão dentro
      if ((code1 | code2) === 0) {
        // Ambos os pontos estão dentro
        accept = true;
        break;
        // Se a interseção dos códigos for diferente de 0, então ambos os pontos estão fora e em regiões diferentes
      } else if ((code1 & code2) !== 0) {
        // Ambos os pontos estão fora e na mesma região
        break;
      } else {
        // Calcula a interseção da linha com a janela de corte
        const codeOut = code1 !== 0 ? code1 : code2;

        // Variáveis que armazenam as coordenadas da interseção
        let x = 0,
          y = 0;

        // Calcula a interseção da linha com a janela de corte
        if (codeOut & RegionCode.TOP) {
          // Calcula a interseção com a borda superior
          x = x1 + ((x2 - x1) * (yMax - y1)) / (y2 - y1);
          y = yMax;
        } else if (codeOut & RegionCode.BOTTOM) {
          // Calcula a interseção com a borda inferior
          x = x1 + ((x2 - x1) * (yMin - y1)) / (y2 - y1);
          y = yMin;
        } else if (codeOut & RegionCode.RIGHT) {
          // Calcula a interseção com a borda direita
          y = y1 + ((y2 - y1) * (xMax - x1)) / (x2 - x1);
          x = xMax;
        } else if (codeOut & RegionCode.LEFT) {
          // Calcula a interseção com a borda esquerda
          y = y1 + ((y2 - y1) * (xMin - x1)) / (x2 - x1);
          x = xMin;
        }

        if (codeOut === code1) {
          // Atualiza as coordenadas do primeiro ponto
          x1 = x;
          y1 = y;
          code1 = computeCode(x1, y1, xMin, xMax, yMin, yMax);
        } else {
          // Atualiza as coordenadas do segundo ponto
          x2 = x;
          y2 = y;
          code2 = computeCode(x2, y2, xMin, xMax, yMin, yMax);
        }
      }
    }

    if (accept) {
      // Adiciona os vértices recortados
      clippedVertices.push({ x: x1, y: y1 });

      if (
        clippedVertices[clippedVertices.length - 1].x !== x2 ||
        clippedVertices[clippedVertices.length - 1].y !== y2
      ) {
        clippedVertices.push({ x: x2, y: y2 });
      }
    }
  }

  return clippedVertices;
}
