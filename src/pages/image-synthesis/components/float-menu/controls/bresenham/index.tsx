import { drawNearestPoints } from "@/pages/image-synthesis/components/float-menu/controls/bresenham/algorithms";
import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { Button } from "@mui/material";

export function Bresenham() {
  const { points, setPoints } = useImageSynthesis();

  function handleExecute() {
    const newPoints = drawNearestPoints(points);
    setPoints(newPoints);
  }

  return (
    <Button variant="contained" onClick={handleExecute}>
      Executar
    </Button>
  );
}
