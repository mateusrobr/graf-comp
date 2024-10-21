import { getIndex } from "../utils";
import { applyGrayScaleFilter } from "./grayscale";

/**
 * Aplica um filtro de detecção de bordas baseado em máscaras de convolução.
 * @param imageData - Os dados da imagem a serem processados.
 * @param Gx - Máscara de convolução para a direção X.
 * @param Gy - Máscara de convolução para a direção Y.
 * @returns Uma nova instância de ImageData com as bordas destacadas.
 */
function applyEdgeFilter(
  imageData: ImageData,
  Gx: number[][],
  Gy: number[][]
): ImageData {
  const { data, width, height } = imageData;
  const newData = new Uint8ClampedArray(data.length);

  // Converter para tons de cinza
  const grayData = applyGrayScaleFilter(imageData);

  // Aplicar as máscaras de convolução
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Obter o índice do pixel atual
      const pixelIndex = getIndex(x, y, width);

      // Inicializar os somatórios para Gx e Gy
      let sumGx = 0;
      let sumGy = 0;

      // Aplicar as máscaras Gx e Gy
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          // Obter o valor do pixel vizinho
          const neighborX = x + k;
          const neighborY = y + j;
          const index = getIndex(neighborX, neighborY, width);
          const gray = grayData.data[index]; // R = G = B em tons de cinza

          // Somar o valor ponderado do pixel vizinho
          sumGx += gray * Gx[j + 1][k + 1];
          sumGy += gray * Gy[j + 1][k + 1];
        }
      }

      // Calcular a magnitude do gradiente
      const magnitude = Math.sqrt(sumGx * sumGx + sumGy * sumGy);

      // Normalizar o valor para o intervalo [0, 255]
      const edgeValue = magnitude > 255 ? 255 : magnitude;

      // Atualizar os canais R, G e B com o valor da borda
      newData[pixelIndex] = edgeValue;
      newData[pixelIndex + 1] = edgeValue;
      newData[pixelIndex + 2] = edgeValue;
      newData[pixelIndex + 3] = data[pixelIndex + 3]; // Manter a transparência original
    }
  }

  // Preencher as bordas da imagem com preto
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        // Preencher com preto
        const index = getIndex(x, y, width);

        // R, G e B são 0, transparência é mantida
        newData[index] = 0;
        newData[index + 1] = 0;
        newData[index + 2] = 0;
        newData[index + 3] = data[index + 3];
      }
    }
  }

  return new ImageData(newData, width, height);
}

/**
 * Aplica o algoritmo de Sobel para destacar as bordas da imagem.
 * @param imageData - Os dados da imagem a serem processados.
 * @returns Uma nova instância de ImageData com as bordas destacadas.
 */
export function applySobelFilter(imageData: ImageData): ImageData {
  // Máscaras de convolução para as direções X e Y
  const sobelGx = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];

  // Máscaras de convolução para as direções X e Y
  const sobelGy = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
  ];

  return applyEdgeFilter(imageData, sobelGx, sobelGy);
}

/**
 * Aplica o algoritmo de Prewitt para destacar as bordas da imagem.
 * @param imageData - Os dados da imagem a serem processados.
 * @returns Uma nova instância de ImageData com as bordas destacadas.
 */
export function applyPrewittFilter(imageData: ImageData): ImageData {
  // Máscaras de convolução para as direções X e Y
  const prewittGx = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ];

  // Máscaras de convolução para as direções X e Y
  const prewittGy = [
    [1, 1, 1],
    [0, 0, 0],
    [-1, -1, -1],
  ];

  return applyEdgeFilter(imageData, prewittGx, prewittGy);
}
