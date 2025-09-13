import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Slider,
  Typography,
} from "@mui/material";
import { drawBezierCurve } from "./algorithms";
import { useState } from "react";

export function BezierCurves() {
  const { points, setPoints } = useImageSynthesis();
  const [numSteps, setNumSteps] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleExecute() {
    if (points.length < 3) return;
    setIsProcessing(true);
    setTimeout(() => {
      setPoints(drawBezierCurve(points, numSteps));
      setIsProcessing(false);
    }, 50);
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 400, margin: "auto", p: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel htmlFor="steps">Precisão da curva</InputLabel>
        <OutlinedInput
          id="steps"
          type="number"
          value={numSteps}
          onChange={(e) => setNumSteps(Math.max(1, Number(e.target.value)))}
          inputProps={{ min: 1 }}
          label="Número de passos"
        />
        <FormHelperText>
          Número de pontos usados para desenhar a curva
        </FormHelperText>
      </FormControl>

      <Typography gutterBottom>
        Ajuste visual dos passos
      </Typography>
      <Slider
        value={numSteps}
        min={1}
        max={1000}
        onChange={(_, value) => setNumSteps(value as number)}
        valueLabelDisplay="auto"
      />

      <Button
        variant="contained"
        color={isProcessing ? "secondary" : "primary"}
        onClick={handleExecute}
        disabled={points.length < 3 || isProcessing}
      >
        {isProcessing ? "Processando..." : "Executar"}
      </Button>
    </Stack>
  );
}
