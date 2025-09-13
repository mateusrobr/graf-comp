import { useRef, useEffect } from "react";
import { Canvas } from "./styles";
import { ImageSynthesisCanvasProps } from "./types";

export function ImageSynthesisCanvas({
  density,
  onPointClick,
  points,
}: ImageSynthesisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // fundo escuro
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellSize = density;
    const numCols = Math.floor(canvas.width / cellSize);
    const numRows = Math.floor(canvas.height / cellSize);

    // grid mais suave
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= numCols; x++) {
      const canvasX = x * cellSize;
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, canvas.height);
    }

    for (let y = 0; y <= numRows; y++) {
      const canvasY = y * cellSize;
      ctx.moveTo(0, canvasY);
      ctx.lineTo(canvas.width, canvasY);
    }

    ctx.stroke();

    // pontos preenchendo a célula inteira (como no seu original)
    points.forEach((point) => {
      const canvasX = point.x * cellSize;
      const canvasY = point.y * cellSize;
      ctx.fillStyle = point.color || "#38bdf8"; // azul padrão
      ctx.fillRect(canvasX, canvasY, cellSize, cellSize);
    });
  }, [density, points]);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const cellSize = density;
    const gridX = Math.floor(canvasX / cellSize);
    const gridY = Math.floor(canvasY / cellSize);

    const alreadyExists = points.some(
      (point) => point.x === gridX && point.y === gridY
    );

    if (alreadyExists) return;

    onPointClick({ x: gridX, y: gridY });
  }

  return <Canvas ref={canvasRef} onClick={handleClick} />;
}
