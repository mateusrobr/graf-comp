/**
 * Aplica um filtro binário à imagem.
 * @param imageData - Dados da imagem a serem processados.
 * @returns - Nova ImageData com o filtro aplicado.
 */
export function applyBinaryFilter(imageData: ImageData) {
  // Obter os dados da imagem
  const data = imageData.data;

  // Percorrer os pixels da imagem e calcular a média dos canais RGB
  for (let i = 0; i < data.length; i += 4) {
    // Calcular a média dos canais RGB
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Atribuir um valor binário com base na média
    const binaryValue = avg > 128 ? 255 : 0;

    // Atribuir o valor binário a cada canal
    data[i] = binaryValue;
    data[i + 1] = binaryValue;
    data[i + 2] = binaryValue;
  }

  return imageData;
}
