import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { Button, Stack, Typography } from "@mui/material";
import { drawNearestPoints } from "../bresenham/algorithms";

export function Polyline() {
  const { points, setPoints } = useImageSynthesis();

  function handleExecute() {
    if (points.length < 3) return;

    // Desenha a polilinha e fecha a figura adicionando o primeiro ponto no final
    const newPoints = drawNearestPoints([...points, points[0]]);
    setPoints(newPoints);
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 300, margin: "auto", p: 2, textAlign: "center" }}>
      <Typography variant="subtitle1">
        Desenhar polilinha fechando automaticamente
      </Typography>

      <Button
        variant="contained"
        onClick={handleExecute}
        disabled={points.length < 3}
      >
        Executar
      </Button>
    </Stack>
  );
}
