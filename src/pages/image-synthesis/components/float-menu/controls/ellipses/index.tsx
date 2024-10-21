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

  const centerPoint = points[0] || { x: 0, y: 0 };

  function handleExecute() {
    setPoints([centerPoint, ...drawEllipse(centerPoint, radiusX, radiusY)]);
  }

  useEffect(() => {
    if (autoDraw) {
      handleExecute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDraw, centerPoint, radiusX, radiusY]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel htmlFor="radius">Raio horizontal</InputLabel>
          <OutlinedInput
            id="radius"
            name="radius"
            inputProps={{ min: 1 }}
            label="Raio horizontal"
            type="number"
            value={radiusX}
            onChange={(e) => setRadiusX(Number(e.target.value))}
          />
        </FormControl>
        <FormControl size="small">
          <InputLabel htmlFor="radius">Raio vertical</InputLabel>
          <OutlinedInput
            id="radius"
            name="radius"
            inputProps={{ min: 1 }}
            label="Raio vertical"
            type="number"
            value={radiusY}
            onChange={(e) => setRadiusY(Number(e.target.value))}
          />
        </FormControl>
      </Stack>
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
        Escolha um ponto para o centro da elipse.
      </Typography>

      <FormControlLabel
        control={<Checkbox onChange={(e) => setAutoDraw(e.target.checked)} />}
        label="Desenhar automaticamente"
      />

      <Button variant="contained" onClick={handleExecute}>
        Executar
      </Button>
    </Stack>
  );
}
