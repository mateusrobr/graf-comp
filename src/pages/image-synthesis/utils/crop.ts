export enum RegionCode {
  INSIDE = 0, // 0000
  LEFT = 1, // 0001
  RIGHT = 2, // 0010
  BOTTOM = 4, // 0100
  TOP = 8, // 1000
}

/**
 * Verifica a região de um ponto em relação a uma janela de recorte
 * @param x - Coordenada x do ponto
 * @param y - Coordenada y do ponto
 * @param xMin - Coordenada x mínima da janela
 * @param xMax - Coordenada x máxima da janela
 * @param yMin - Coordenada y mínima da janela
 * @param yMax - Coordenada y máxima da janela
 * @returns - Código da região do ponto
 */
export function computeCode(
  x: number,
  y: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): number {
  let code = RegionCode.INSIDE;

  if (x < xMin) code |= RegionCode.LEFT;
  else if (x > xMax) code |= RegionCode.RIGHT;
  if (y < yMin) code |= RegionCode.BOTTOM;
  else if (y > yMax) code |= RegionCode.TOP;

  return code;
}
