/**
 * Aplica um filtro de escala de cinza à imagem.
 * @param imageData - Dados da imagem a serem processados.
 * @returns Nova ImageData com o filtro aplicado.
 */
export function applyGrayScaleFilter(imageData: ImageData) {
  // Obter os dados da imagem
  const data = imageData.data;

  // Percorrer os pixels da imagem e calcular a média dos canais RGB
  for (let i = 0; i < data.length; i += 4) {
    // Calcular a média dos canais RGB
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Atribuir o valor médio a cada canal
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  return imageData;
}
