import { Point } from "../../../canvas/types";

/**
 * Função que realiza o preenchimento recursivo (Flood Fill) de uma área em um grid.
 * @param startPoint Ponto inicial para iniciar o preenchimento.
 * @param boundaryPoints Array de pontos que representam as bordas da figura a ser preenchida.
 * @returns Array de pontos que foram preenchidos, com a cor definida.
 */
export function drawRecursiveFill(
  startPoint: Point,
  boundaryPoints: Point[]
): Point[] {
  const filledPoints: Point[] = []; // Array para armazenar os pontos preenchidos
  const visited = new Set<string>(); // Conjunto para rastrear os pontos já visitados

  // Converte o array de pontos de borda em um Set para busca eficiente
  const boundarySet = new Set<string>(
    boundaryPoints.map((p) => `${p.x},${p.y}`)
  );

  // Inicia o preenchimento recursivo a partir do ponto inicial
  fill(startPoint.x, startPoint.y);

  // Retorna o array de pontos que foram preenchidos com a cor vermelha
  return filledPoints;

  /**
   * Função recursiva auxiliar para realizar o preenchimento.
   * @param x Coordenada x do ponto atual.
   * @param y Coordenada y do ponto atual.
   */
  function fill(x: number, y: number): void {
    const key = `${x},${y}`; // Chave única para o ponto atual

    // Verifica se o ponto já foi visitado ou se é um ponto de borda
    if (visited.has(key) || boundarySet.has(key)) {
      return; // Sai da função se o ponto já foi processado ou é uma borda
    }

    // Marca o ponto como visitado
    visited.add(key);

    // Define a cor vermelha para o ponto preenchido
    const filledPoint: Point = { x, y, color: "red" };

    // Adiciona o ponto ao array de pontos preenchidos
    filledPoints.push(filledPoint);

    // Chama recursivamente a função fill para os pontos vizinhos (Norte, Sul, Leste, Oeste)
    fill(x + 1, y); // Leste
    fill(x - 1, y); // Oeste
    fill(x, y + 1); // Sul
    fill(x, y - 1); // Norte
  }
}

/**
 * Preenche um polígono utilizando o algoritmo de varredura (scanline).
 * As arestas não são preenchidas e os pontos do preechimento recebem a cor vermelha.
 * @param startPoint - Ponto inicial do preenchimento do preenchimento dentro do polígono.
 * @param boundaryPoints - Array de pontos que representam as arestas do polígono.
 * @returns Array de pontos preenchidos.
 */
export function drawScanlineFill(startPoint: Point, boundaryPoints: Point[]) {
  const filledPixels = new Set<string>();
  const edgePixels = new Set<string>(
    boundaryPoints.map((p) => `${p.x},${p.y}`)
  );

  // Implementa o algoritmo de preenchimento por varredura (scanline flood fill)
  const stack: Point[] = [startPoint];

  while (stack.length > 0) {
    const point = stack.pop()!;
    const { x, y } = point;
    const key = `${x},${y}`;

    if (edgePixels.has(key) || filledPixels.has(key)) {
      continue;
    }

    // Move para a esquerda a partir de x até encontrar uma borda ou pixel já preenchido
    let xLeft = x;
    let keyLeft = `${xLeft},${y}`;
    while (!edgePixels.has(keyLeft) && !filledPixels.has(keyLeft)) {
      xLeft--;
      keyLeft = `${xLeft},${y}`;
    }
    xLeft++; // Retorna para a última posição válida

    // Move para a direita a partir de x até encontrar uma borda ou pixel já preenchido
    let xRight = x;
    let keyRight = `${xRight},${y}`;
    while (!edgePixels.has(keyRight) && !filledPixels.has(keyRight)) {
      xRight++;
      keyRight = `${xRight},${y}`;
    }
    xRight--; // Retorna para a última posição válida

    // Preenche o intervalo de xLeft até xRight
    for (let xi = xLeft; xi <= xRight; xi++) {
      const keySpan = `${xi},${y}`;
      if (!filledPixels.has(keySpan)) {
        filledPixels.add(keySpan);

        // Verifica o pixel acima
        const keyAbove = `${xi},${y - 1}`;
        if (!edgePixels.has(keyAbove) && !filledPixels.has(keyAbove)) {
          stack.push({ x: xi, y: y - 1 });
        }

        // Verifica o pixel abaixo
        const keyBelow = `${xi},${y + 1}`;
        if (!edgePixels.has(keyBelow) && !filledPixels.has(keyBelow)) {
          stack.push({ x: xi, y: y + 1 });
        }
      }
    }
  }

  // Converte o conjunto de pixels preenchidos em um array de pontos com a cor vermelha
  return Array.from(filledPixels).map((key) => {
    const [x, y] = key.split(",").map(Number);
    return { x, y, color: "red" };
  });
}
