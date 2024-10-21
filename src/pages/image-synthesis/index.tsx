import { ImageSynthesisCanvas } from "./components/canvas";
import { Container } from "./components/container";
import { FloatMenu } from "./components/float-menu";
import { drawNearestPoints } from "./components/float-menu/controls/bresenham/algorithms";
import { useImageSynthesis } from "./hooks/use-image-synthesis";

export function ImageSynthesisPage() {
  const {
    points,
    setPoints,
    algorithm,
    canvasDensity,
    cropWindowPoints,
    isCanvasClickDisabled,
  } = useImageSynthesis();

  return (
    <Container.Root>
      <Container.FloatMenu>
        <FloatMenu />
      </Container.FloatMenu>

      <ImageSynthesisCanvas
        points={[...cropWindowPoints, ...points]}
        onPointClick={(point) => {
          if (isCanvasClickDisabled) return;

          // restringe para um ponto em circulos e elipses
          if (algorithm === "circulos" || algorithm === "elipses") {
            setPoints([point]);
            return;
          }

          // restringe para até 4 pontos em bezier
          if (algorithm === "bezier") {
            if (points.length < 4) {
              setPoints([...points, point]);
            }
            return;
          }

          // restringe para 2 pontos em recorte de linha
          if (algorithm === "recorte-linha") {
            const newPoints = [...points, point];

            if (newPoints.length === 2) {
              // ja faz a rasterizacao da linha
              setPoints(drawNearestPoints(newPoints));
              return;
            } else if (newPoints.length > 2) {
              setPoints([point]);
              return;
            }

            setPoints(newPoints);

            return;
          }

          if (points.some((p) => p.x === point.x && p.y === point.y)) {
            setPoints(points.filter((p) => p.x !== point.x || p.y !== point.y));
            return;
          }

          setPoints([...points, point]);
        }}
        density={canvasDensity}
      />
    </Container.Root>
  );
}
