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
  Slider,
} from "@mui/material";

import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { drawCircle } from "./algorithms";

export function Circles() {
  const { setPoints, points } = useImageSynthesis();
  const [radius, setRadius] = useState(5);
  const [autoDraw, setAutoDraw] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const centerPoint = points[0] || { x: 0, y: 0 };

  function handleExecute() {
    if (!centerPoint) return;
    setIsProcessing(true);
    setTimeout(() => {
      setPoints([centerPoint, ...drawCircle(centerPoint, radius)]);
      setIsProcessing(false);
    }, 50);
  }

  useEffect(() => {
    if (autoDraw) {
      handleExecute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDraw, centerPoint, radius]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 400, margin: "auto", p: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel htmlFor="radius">Raio do círculo</InputLabel>
        <OutlinedInput
          id="radius"
          name="radius"
          label="Raio do círculo"
          type="number"
          inputProps={{ min: 1 }}
          value={radius}
          onChange={(e) => setRadius(Math.max(1, Number(e.target.value)))}
        />
      </FormControl>

      <Typography gutterBottom>Raio (ajuste visual)</Typography>
      <Slider
        value={radius}
        min={1}
        max={200}
        onChange={(_, value) => setRadius(value as number)}
        valueLabelDisplay="auto"
      />

      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel htmlFor="x">X</InputLabel>
          <OutlinedInput id="x" name="x" label="X" type="number" value={centerPoint.x} disabled />
        </FormControl>
        <FormControl size="small">
          <InputLabel htmlFor="y">Y</InputLabel>
          <OutlinedInput id="y" name="y" label="Y" type="number" value={centerPoint.y} disabled />
        </FormControl>
      </Stack>

      <Typography color="textSecondary" fontSize="0.875rem">
        Selecione um ponto para o centro do círculo ou use o primeiro ponto existente.
      </Typography>

      <FormControlLabel
        control={<Checkbox checked={autoDraw} onChange={(e) => setAutoDraw(e.target.checked)} />}
        label="Desenhar automaticamente"
      />

      <Button
        variant="contained"
        color={isProcessing ? "secondary" : "primary"}
        onClick={handleExecute}
        disabled={points.length > 1 || autoDraw || isProcessing}
      >
        {isProcessing ? "Desenhando..." : "Executar"}
      </Button>
    </Stack>
  );
}
