import { drawNearestPoints } from "./algorithms";
import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

export function Bresenham() {
  const { points, setPoints } = useImageSynthesis();
  const [isProcessing, setIsProcessing] = useState(false);

  function handleExecute() {
    if (points.length < 2) return;
    setIsProcessing(true);
    setTimeout(() => {
      setPoints(drawNearestPoints(points));
      setIsProcessing(false);
    }, 50);
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 300, margin: "auto", p: 2 }}>
      {points.length < 2 && (
        <Typography color="error" variant="body2">
          Adicione pelo menos 2 pontos para desenhar
        </Typography>
      )}
      <Button
        variant="contained"
        color={isProcessing ? "secondary" : "primary"}
        onClick={handleExecute}
        disabled={points.length < 2 || isProcessing}
      >
        {isProcessing ? "Processando..." : "Executar"}
      </Button>
    </Stack>
  );
}
