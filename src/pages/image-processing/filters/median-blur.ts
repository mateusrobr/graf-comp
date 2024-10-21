import { getIndex, getMedian } from "../utils";

/**
 * Aplica um filtro de mediana à imagem.
 * @param imageData - Dados da imagem a serem processados.
 * @returns Nova ImageData com o filtro de mediana aplicado.
 */
export function applyMedianFilter(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const newData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighborsR: number[] = [];
      const neighborsG: number[] = [];
      const neighborsB: number[] = [];

      // Coletar os valores dos vizinhos na vizinhança 3x3
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
            neighborsR.push(data[index]);
            neighborsG.push(data[index + 1]);
            neighborsB.push(data[index + 2]);
          }
        }
      }

      // Calcular a mediana para cada canal
      const medianR = getMedian(neighborsR);
      const medianG = getMedian(neighborsG);
      const medianB = getMedian(neighborsB);

      const currentIndex = getIndex(x, y, width);

      newData[currentIndex] = medianR;
      newData[currentIndex + 1] = medianG;
      newData[currentIndex + 2] = medianB;
      newData[currentIndex + 3] = data[currentIndex + 3]; // Manter a transparência original
    }
  }

  return new ImageData(newData, width, height);
}
