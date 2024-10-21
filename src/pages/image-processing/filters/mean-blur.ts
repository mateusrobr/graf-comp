import { applyConvolutionFilter } from "../utils";

/**
 * Aplica um filtro de média à imagem.
 * @param imageData - Dados da imagem a serem processados.
 * @returns Nova ImageData com o filtro de média aplicado.
 */
export function applyMeanFilter(imageData: ImageData): ImageData {
  // Definição do kernel de média 3x3 (todos os pesos iguais a 1)
  const meanKernel = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const meanWeight = meanKernel.flat().reduce((a, b) => a + b); // Soma dos elementos do kernel

  return applyConvolutionFilter(imageData, meanKernel, meanWeight);
}
