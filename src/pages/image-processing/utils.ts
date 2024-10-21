// Função auxiliar para calcular o índice do pixel
export function getIndex(x: number, y: number, width: number) {
  return (x + y * width) * 4;
}

// Função para calcular a mediana de um array de números
export function getMedian(values: number[]): number {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * Aplica um filtro de convolução genérico à imagem.
 * @param imageData - Dados da imagem a serem processados.
 * @param kernel - Matriz de convolução 2D.
 * @param kernelWeight - Soma dos elementos do kernel para normalização.
 * @returns Nova ImageData com o filtro aplicado.
 */
export function applyConvolutionFilter(
  imageData: ImageData,
  kernel: number[][],
  kernelWeight: number
): ImageData {
  const { data, width, height } = imageData;
  const newData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;

      // Aplicar o kernel à vizinhança 3x3
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          const neighborX = x + k;
          const neighborY = y + j;

          // Verificar se o vizinho está dentro dos limites da imagem
          if (
            neighborX >= 0 &&
            neighborX < width &&
            neighborY >= 0 &&
            neighborY < height
          ) {
            const index = getIndex(neighborX, neighborY, width);
            const weight = kernel[j + 1][k + 1];

            sumR += data[index] * weight;
            sumG += data[index + 1] * weight;
            sumB += data[index + 2] * weight;
          }
        }
      }

      // Calcular a média ponderada para cada canal
      const avgR = Math.round(sumR / kernelWeight);
      const avgG = Math.round(sumG / kernelWeight);
      const avgB = Math.round(sumB / kernelWeight);

      const currentIndex = getIndex(x, y, width);

      newData[currentIndex] = avgR;
      newData[currentIndex + 1] = avgG;
      newData[currentIndex + 2] = avgB;
      newData[currentIndex + 3] = data[currentIndex + 3]; // Manter a transparência original
    }
  }

  return new ImageData(newData, width, height);
}
