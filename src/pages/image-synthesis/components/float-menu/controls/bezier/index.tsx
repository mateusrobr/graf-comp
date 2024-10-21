import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { drawBezierCurve } from "./algorithms";
import { useState } from "react";

export function BezierCurves() {
  const { points, setPoints } = useImageSynthesis();
  const [numSteps, setNumSteps] = useState(200);

  function handleExecute() {
    if (points.length < 3) return;

    const newP = drawBezierCurve(points, numSteps);

    setPoints(newP);
  }

  return (
    <Stack spacing={2}>
      <FormControl size="small">
        <InputLabel htmlFor="steps">Número de passos</InputLabel>
        <OutlinedInput
          id="steps"
          name="steps"
          label="Número de passos"
          type="number"
          inputProps={{ min: 1 }}
          value={numSteps}
          onChange={(e) => setNumSteps(Number(e.target.value))}
        />
        <FormHelperText>
          Define a quantidade de pontos calculados ao longo da curva
        </FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleExecute}
        disabled={points.length < 3}
      >
        Executar
      </Button>
    </Stack>
  );
}
