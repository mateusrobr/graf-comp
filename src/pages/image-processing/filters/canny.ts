/**
 * Função para aplicar o algoritmo de Canny na detecção de bordas em uma imagem.
 * @param imageData - Objeto ImageData contendo os dados da imagem.
 * @param options - Opções para configuração do algoritmo.
 * @returns Novo objeto ImageData com as bordas detectadas.
 */
export function applyCannyFilter(
  imageData: ImageData,
  options: {
    gaussianKernelSize?: number;
    gaussianSigma?: number;
    lowThreshold?: number;
    highThreshold?: number;
  } = {}
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // Definição de parâmetros padrão
  const kernelSize = options.gaussianKernelSize || 5;
  const sigma = options.gaussianSigma || 1.4;
  const lowThreshold = options.lowThreshold || 20;
  const highThreshold = options.highThreshold || 50;

  // 1. Conversão para Tons de Cinza
  const gray = toGrayscale(data, width, height);

  // 2. Aplicação do Filtro Gaussiano para suavizar a imagem
  const blurred = gaussianBlur(gray, width, height, kernelSize, sigma);

  // 3. Detecção de Gradientes utilizando os operadores Sobel
  const { gradient, direction } = computeGradients(blurred, width, height);

  // 4. Supressão Não-Máxima para refinar as bordas
  const nonMax = nonMaximumSuppression(gradient, direction, width, height);

  // 5. Aplicação de Limiar Duplo para classificar os pixels
  const thresholded = doubleThreshold(
    nonMax,
    lowThreshold,
    highThreshold,
    width,
    height
  );

  // 6. Rastreamento por Histerese para conectar bordas fracas às fortes
  const edges = hysteresis(thresholded, width, height);

  // Preparação do ImageData de saída com as bordas detectadas
  const output = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < edges.length; i++) {
    const pixel = edges[i] ? 255 : 0; // Branco para bordas, preto para fundo
    output[i * 4] = pixel; // Canal R
    output[i * 4 + 1] = pixel; // Canal G
    output[i * 4 + 2] = pixel; // Canal B
    output[i * 4 + 3] = 255; // Canal A (opacidade total)
  }

  return new ImageData(output, width, height);
}

/**
 * Converte os dados da imagem para escala de cinza.
 * @param data - Dados RGBA da imagem.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @returns Array de valores em escala de cinza.
 */
function toGrayscale(
  data: Uint8ClampedArray,
  width: number,
  height: number
): number[] {
  const gray: number[] = new Array(width * height);
  // Percorre todos os pixels da imagem
  for (let i = 0; i < width * height; i++) {
    // Extração dos canais de cor
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // Fórmula de luminosidade para conversão (ref: https://en.wikipedia.org/wiki/Grayscale)
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return gray;
}

/**
 * Gera um kernel Gaussiano para a convolução.
 * @param size - Tamanho do kernel (deve ser ímpar).
 * @param sigma - Desvio padrão da distribuição Gaussiana.
 * @returns Array representando o kernel Gaussiano.
 */
function generateGaussianKernel(size: number, sigma: number): number[] {
  const kernel = [];
  // Cálculo do raio do kernel
  const half = Math.floor(size / 2);
  let sum = 0;

  for (let y = -half; y <= half; y++) {
    for (let x = -half; x <= half; x++) {
      // Fórmula da distribuição Gaussiana
      const exponent = -(x * x + y * y) / (2 * sigma * sigma);
      // Cálculo do valor do kernel
      const value = (1 / (2 * Math.PI * sigma * sigma)) * Math.exp(exponent);
      // Armazenamento do valor no kernel e soma total
      kernel.push(value);
      // Soma total para normalização
      sum += value;
    }
  }

  // Normalização do kernel para que a soma seja 1
  return kernel.map((v) => v / sum);
}

/**
 * Aplica uma operação de convolução com o kernel especificado na imagem.
 * @param input - Array de valores da imagem.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @param kernel - Kernel de convolução.
 * @param kernelSize - Tamanho do kernel.
 * @returns Array de valores resultantes da convolução.
 */
function convolve(
  input: number[],
  width: number,
  height: number,
  kernel: number[],
  kernelSize: number
): number[] {
  const half = Math.floor(kernelSize / 2);
  const output = new Array(width * height).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          // Posição do pixel no kernel
          const posY = y + ky;
          const posX = x + kx;
          // Verifica se a posição está dentro dos limites da imagem
          if (posY >= 0 && posY < height && posX >= 0 && posX < width) {
            // Índice do pixel na imagem
            const idx = posY * width + posX;
            // Índice do pixel no kernel
            const kIdx = (ky + half) * kernelSize + (kx + half);
            // Soma ponderada dos valores
            sum += input[idx] * kernel[kIdx];
          }
        }
      }
      output[y * width + x] = sum;
    }
  }

  return output;
}

/**
 * Aplica o desfoque Gaussiano na imagem para reduzir o ruído.
 * @param gray - Array de valores em escala de cinza.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @param kernelSize - Tamanho do kernel Gaussiano.
 * @param sigma - Desvio padrão da distribuição Gaussiana.
 * @returns Array de valores suavizados.
 */
function gaussianBlur(
  gray: number[],
  width: number,
  height: number,
  kernelSize: number,
  sigma: number
): number[] {
  // Geração do kernel Gaussiano
  const kernel = generateGaussianKernel(kernelSize, sigma);
  // Aplicação da convolução
  return convolve(gray, width, height, kernel, kernelSize);
}

/**
 * Calcula os gradientes de intensidade e direção utilizando os operadores Sobel.
 * @param blurred - Array de valores suavizados pela convolução Gaussiana.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @returns Objeto contendo a magnitude dos gradientes e suas direções.
 */
function computeGradients(
  blurred: number[],
  width: number,
  height: number
): { gradient: number[]; direction: number[] } {
  // Definição dos operadores Sobel para as direções X e Y
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [1, 2, 1, 0, 0, 0, -1, -2, -1];

  const gradient = new Array(width * height).fill(0);
  const direction = new Array(width * height).fill(0);
  const half = 1; // Kernel 3x3

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      // Inicialização dos valores dos gradientes
      let gx = 0;
      let gy = 0;
      // Aplica os operadores Sobel
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          // Índice do pixel no kernel
          const idx = (y + ky) * width + (x + kx);
          // Peso dos operadores Sobel
          const weightX = sobelX[(ky + half) * 3 + (kx + half)];
          const weightY = sobelY[(ky + half) * 3 + (kx + half)];
          // Soma ponderada dos gradientes
          gx += blurred[idx] * weightX;
          gy += blurred[idx] * weightY;
        }
      }
      // Calcula a magnitude do gradiente
      const mag = Math.hypot(gx, gy);
      // Armazena a magnitude e a direção do gradiente
      gradient[y * width + x] = mag;
      // Calcula a direção do gradiente em graus
      direction[y * width + x] = Math.atan2(gy, gx) * (180 / Math.PI);
    }
  }

  return { gradient, direction };
}

/**
 * Realiza a Supressão Não-Máxima para refinar as bordas detectadas.
 * @param gradient - Array de magnitudes dos gradientes.
 * @param direction - Array de direções dos gradientes.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @returns Array com os valores após a supressão não-máxima.
 */
function nonMaximumSuppression(
  gradient: number[],
  direction: number[],
  width: number,
  height: number
): number[] {
  const suppressed = new Array(width * height).fill(0);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Índice do pixel atual
      const idx = y * width + x;
      const angle = direction[idx];

      // Vizinhos para a supressão não-máxima
      let neighbor1 = 0;
      let neighbor2 = 0;

      // Ajusta o ângulo para um dos quatro casos principais
      const normalizedAngle = (angle + 180) % 180; // Normaliza para [0,180)

      if (
        (normalizedAngle >= 0 && normalizedAngle < 22.5) ||
        (normalizedAngle >= 157.5 && normalizedAngle < 180)
      ) {
        // Horizontal (0°)
        neighbor1 = gradient[y * width + (x + 1)];
        neighbor2 = gradient[y * width + (x - 1)];
      } else if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) {
        // Diagonal 45°
        neighbor1 = gradient[(y - 1) * width + (x + 1)];
        neighbor2 = gradient[(y + 1) * width + (x - 1)];
      } else if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) {
        // Vertical (90°)
        neighbor1 = gradient[(y - 1) * width + x];
        neighbor2 = gradient[(y + 1) * width + x];
      } else if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) {
        // Diagonal 135°
        neighbor1 = gradient[(y - 1) * width + (x - 1)];
        neighbor2 = gradient[(y + 1) * width + (x + 1)];
      }

      // Supressão Não-Máxima: mantém o pixel se for maior ou igual aos vizinhos
      if (gradient[idx] >= neighbor1 && gradient[idx] >= neighbor2) {
        suppressed[idx] = gradient[idx];
      } else {
        suppressed[idx] = 0;
      }
    }
  }

  return suppressed;
}

/**
 * Aplica o limiar duplo para classificar os pixels em fortes, fracos ou não bordas.
 * @param suppressed - Array após a supressão não-máxima.
 * @param lowThreshold - Limiar baixo para bordas fracas.
 * @param highThreshold - Limiar alto para bordas fortes.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @returns Array com os pixels classificados.
 */
function doubleThreshold(
  suppressed: number[],
  lowThreshold: number,
  highThreshold: number,
  width: number,
  height: number
): number[] {
  // Valores para classificação dos pixels
  const strong = 255; // Valor para bordas fortes
  const weak = 75; // Valor para bordas fracas
  const result = new Array(width * height).fill(0);

  for (let i = 0; i < suppressed.length; i++) {
    // Classificação dos pixels
    const val = suppressed[i];
    if (val >= highThreshold) {
      result[i] = strong;
    } else if (val >= lowThreshold) {
      result[i] = weak;
    } else {
      result[i] = 0;
    }
  }

  return result;
}

/**
 * Realiza o Rastreamento por Histerese para conectar bordas fracas às fortes.
 * @param thresholded - Array após a aplicação do limiar duplo.
 * @param width - Largura da imagem.
 * @param height - Altura da imagem.
 * @returns Array booleano indicando a presença de bordas.
 */
function hysteresis(
  thresholded: number[],
  width: number,
  height: number
): boolean[] {
  const strong = 255;
  const weak = 75;
  const edges = new Array(width * height).fill(false);
  const stack: number[] = [];

  // Inicializa a pilha com todos os pixels fortes
  for (let i = 0; i < thresholded.length; i++) {
    if (thresholded[i] === strong) {
      edges[i] = true;
      stack.push(i);
    }
  }

  // Direções para a vizinhança 8
  const directions = [
    -width - 1,
    -width,
    -width + 1,
    -1,
    /* pixel atual */ 1,
    width - 1,
    width,
    width + 1,
  ];

  // Processa a pilha para conectar bordas fracas às fortes
  while (stack.length > 0) {
    const idx = stack.pop()!;
    for (const dir of directions) {
      const neighbor = idx + dir;
      // Verifica se o vizinho está dentro dos limites da imagem
      if (neighbor >= 0 && neighbor < thresholded.length) {
        if (thresholded[neighbor] === weak && !edges[neighbor]) {
          // Marca o pixel como borda forte
          edges[neighbor] = true;
          stack.push(neighbor);
        }
      }
    }
  }

  return edges;
}
