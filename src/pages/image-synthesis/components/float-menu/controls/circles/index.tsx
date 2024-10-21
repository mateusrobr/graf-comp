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
import { drawCircle } from "./algorithms";

export function Circles() {
  const { setPoints, points } = useImageSynthesis();
  const [radius, setRadius] = useState(5);
  const [autoDraw, setAutoDraw] = useState(false);

  const centerPoint = points[0] || { x: 0, y: 0 };

  function handleExecute() {
    setPoints([centerPoint, ...drawCircle(centerPoint, radius)]);
  }

  useEffect(() => {
    if (autoDraw) {
      handleExecute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDraw, centerPoint, radius]);

  return (
    <Stack spacing={2}>
      <FormControl size="small">
        <InputLabel htmlFor="radius">Raio</InputLabel>
        <OutlinedInput
          id="radius"
          name="radius"
          label="Raio"
          type="number"
          inputProps={{ min: 1 }}
          value={radius}
          onChange={(e) => {
            const value = e.target.value;
            setRadius(Number(value));
          }}
        />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel htmlFor="radius">X</InputLabel>
          <OutlinedInput
            id="x"
            name="x"
            label="X"
            type="number"
            value={centerPoint.x}
            disabled
          />
        </FormControl>
        <FormControl size="small">
          <InputLabel htmlFor="radius">Y</InputLabel>
          <OutlinedInput
            id="y"
            name="y"
            label="Y"
            type="number"
            disabled
            value={centerPoint.y}
          />
        </FormControl>
      </Stack>

      <Typography color="textSecondary" fontSize="0.875rem">
        Escolha um ponto para o centro do círculo.
      </Typography>

      <FormControlLabel
        control={<Checkbox onChange={(e) => setAutoDraw(e.target.checked)} />}
        label="Desenhar automaticamente"
      />

      <Button
        variant="contained"
        onClick={handleExecute}
        disabled={points.length > 1 || autoDraw}
      >
        Executar
      </Button>
    </Stack>
  );
}
