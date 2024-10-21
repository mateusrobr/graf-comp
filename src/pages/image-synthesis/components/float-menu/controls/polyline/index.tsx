import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { Button } from "@mui/material";
import { drawNearestPoints } from "../bresenham/algorithms";

export function Polyline() {
  const { points, setPoints } = useImageSynthesis();

  function handleExecute() {
    // Vamos reutilizar a função drawNearestPoints para desenhar a polilinha
    // mas precisamos adicionar o primeiro ponto no final do array para fechar a figura
    const newPoints = drawNearestPoints([...points, points[0]]);
    setPoints(newPoints);
  }

  return (
    <Button
      variant="contained"
      onClick={handleExecute}
      disabled={points.length < 3}
    >
      Executar
    </Button>
  );
}
