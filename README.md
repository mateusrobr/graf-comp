# Comp Gráfica - Trabalho Final da Disciplina

Neste trabalho final da disciplina de Computação Gráfica, foi proposto a criação de uma aplicação que permitisse a geração de figuras em um plano 2D, com a possibilidade de realizar transformações geométricas nessas figuras. A aplicação foi desenvolvida em React, utilizando os algoritmos de rasterização de retas e círculos, e as transformações geométricas de translação, rotação e escala.

![Image processing](https://i.imgur.com/jEktEhb.png)
![Projection](https://i.imgur.com/5uR98tF.png)

## Como rodar a aplicação

Para rodar a aplicação, é necessário ter o Node.js instalado. Com o Node.js instalado, basta rodar os seguintes comandos:

```bash
npm install
npm run dev
```

Após rodar esses comandos, a aplicação estará disponível em `http://localhost:5173/`.

## Funcionalidades

### Geração de figuras

1. **Reta**: Para gerar uma reta, basta clicar em dois pontos no plano 2D. A reta será gerada utilizando o algoritmo de Bresenham.
2. **Círculo**: Para gerar um círculo, basta informar o raio e clicar em um ponto no plano 2D.
3. **Elipse**: Para gerar uma elipse, basta informar os raios `rx` e `ry` e clicar em um ponto no plano 2D.
4. **Polígono**: Para gerar um polígono, basta clicar em vários pontos no plano 2D.

### Transformações geométricas

1. **Translação**: Para transladar uma figura, basta informar os valores de transladação e clicar no botão "Executar".
2. **Rotação**: Para rotacionar uma figura, basta informar o ângulo de rotação e clicar no botão "Executar".
3. **Escala**: Para escalar uma figura, basta informar os valores de escala e clicar no botão "Executar".

### Projeções

Neste projeto também foram implementadas as projeções ortográficas, obliquas e perspectivas. Para utilizar as projeções, basta escolher a opção "Projeções" e escolher a projeção desejada.

### Processamento de Imagens

Na parte de processamento de imagens, é possível validar os filtros para a mudança de cor de uma imagem, bem como a aplicação de filtros de suavização e detecção de bordas. Os algoritmos utilizados estão listados abaixo:

1. **Escala de Cinza**: O filtro de escala de cinza é utilizado para transformar uma imagem colorida em uma imagem em tons de cinza.
2. **Binário**: O filtro binário é utilizado para transformar uma imagem colorida em uma imagem preto e branco.
3. **Desfoque de Média**: O filtro de desfoque de média é utilizado para suavizar uma imagem. O algoritmo consiste em substituir o valor de cada pixel pela média dos valores dos pixels vizinhos.
4. **Desfoque de Mediana**: O filtro de desfoque de mediana é utilizado para suavizar uma imagem. O algoritmo consiste em substituir o valor de cada pixel pela mediana dos valores dos pixels vizinhos.
5. **Desfoque Gaussiano**: O filtro de desfoque gaussiano é utilizado para suavizar uma imagem. O algoritmo consiste em aplicar um filtro gaussiano na imagem.
6. **Filtro de Sobel**: O filtro de Sobel é utilizado para detectar bordas em uma imagem. O algoritmo consiste em aplicar duas máscaras de convolução na imagem.
7. **Filtro de Prewitt**: O filtro de Prewitt é utilizado para detectar bordas em uma imagem. O algoritmo consiste em aplicar duas máscaras de convolução na imagem (uma para a direção horizontal e outra para a direção vertical).
8. **Filtro de Canny**: O filtro de Canny é utilizado para detectar bordas em uma imagem. O algoritmo consiste em aplicar um detector de bordas baseado no gradiente da imagem.

### Colaboradores

- [Victor Gonçalves](https://github.com/victorhhugo128)
- [Jonathas Andrade](https://github.com/eljonathas)
