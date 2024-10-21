import { applyConvolutionFilter } from "../utils";

/**
 * Aplica um filtro Gaussiano à imagem.
 * @param imageData - Dados da imagem a serem processados.
 * @returns Nova ImageData com o filtro Gaussiano aplicado.
 */
export function applyGaussianFilter(imageData: ImageData): ImageData {
  // Definição do kernel Gaussiano 3x3
  const gaussianKernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ];

  const gaussianWeight = gaussianKernel.flat().reduce((a, b) => a + b); // Soma dos elementos do kernel

  return applyConvolutionFilter(imageData, gaussianKernel, gaussianWeight);
}
