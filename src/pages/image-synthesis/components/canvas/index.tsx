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
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const context = canvas.getContext("2d");

      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const cellSize = density;

      const numCols = Math.floor(canvas.width / cellSize);
      const numRows = Math.floor(canvas.height / cellSize);

      context.beginPath();
      context.strokeStyle = "rgba(0, 0, 0, 0.2)";

      for (let x = 0; x <= numCols; x++) {
        const canvasX = x * cellSize;
        context.moveTo(canvasX, 0);
        context.lineTo(canvasX, canvas.height);
      }

      for (let y = 0; y <= numRows; y++) {
        const canvasY = y * cellSize;
        context.moveTo(0, canvasY);
        context.lineTo(canvas.width, canvasY);
      }

      context.stroke();

      points.forEach((point) => {
        const canvasX = point.x * cellSize;
        const canvasY = point.y * cellSize;
        context.fillStyle = point.color || "black";
        context.fillRect(canvasX, canvasY, cellSize, cellSize);
      });
    }
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
