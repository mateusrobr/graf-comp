import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { drawEllipse } from "./algorithms";

export function Ellipses() {
  const { setPoints, points } = useImageSynthesis();
  const [radiusX, setRadiusX] = useState(10);
  const [radiusY, setRadiusY] = useState(5);
  const [autoDraw, setAutoDraw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const centerPoint = points[0] || { x: 0, y: 0 };

  function handleExecute() {
    if (!centerPoint) return;
    setIsProcessing(true);
    setTimeout(() => {
      setPoints([centerPoint, ...drawEllipse(centerPoint, radiusX, radiusY)]);
      setIsProcessing(false);
    }, 50); // pequeno delay para feedback visual
  }

  useEffect(() => {
    if (autoDraw) {
      handleExecute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDraw, centerPoint, radiusX, radiusY]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 400, margin: "auto", p: 2 }}>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel htmlFor="radiusX">Raio horizontal</InputLabel>
          <OutlinedInput
            id="radiusX"
            label="Raio horizontal"
            type="number"
            inputProps={{ min: 1 }}
            value={radiusX}
            onChange={(e) => setRadiusX(Math.max(1, Number(e.target.value)))}
          />
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel htmlFor="radiusY">Raio vertical</InputLabel>
          <OutlinedInput
            id="radiusY"
            label="Raio vertical"
            type="number"
            inputProps={{ min: 1 }}
            value={radiusY}
            onChange={(e) => setRadiusY(Math.max(1, Number(e.target.value)))}
          />
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel htmlFor="x">X</InputLabel>
          <OutlinedInput id="x" label="X" type="number" value={centerPoint.x} disabled />
        </FormControl>

        <FormControl size="small">
          <InputLabel htmlFor="y">Y</InputLabel>
          <OutlinedInput id="y" label="Y" type="number" value={centerPoint.y} disabled />
        </FormControl>
      </Stack>

      <Typography color="textSecondary" fontSize="0.875rem">
        Selecione um ponto para o centro da elipse ou use o primeiro ponto existente.
      </Typography>

      <FormControlLabel
        control={<Checkbox checked={autoDraw} onChange={(e) => setAutoDraw(e.target.checked)} />}
        label="Desenhar automaticamente"
      />

      <Button
        variant="contained"
        color={isProcessing ? "secondary" : "primary"}
        onClick={handleExecute}
        disabled={isProcessing}
      >
        {isProcessing ? "Desenhando…" : "Executar"}
      </Button>
    </Stack>
  );
}
