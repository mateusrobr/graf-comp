import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { drawNearestPoints } from "../bresenham/algorithms";
import { cohenSutherlandClip } from "./algorithms";

export function LineCropWindow() {
  const { setCropWindowPoints, points, setPoints } = useImageSynthesis();

  const [controls, setControls] = useState({
    height: 25,
    width: 40,
    x: 55,
    y: 25,
  });

  useEffect(() => {
    const { height, width, x, y } = controls;
    const halfHeight = height / 2;
    const halfWidth = width / 2;

    const points = drawNearestPoints([
      { x: Math.round(x - halfWidth), y: Math.round(y - halfHeight) },
      { x: Math.round(x + halfWidth), y: Math.round(y - halfHeight) },
      { x: Math.round(x + halfWidth), y: Math.round(y + halfHeight) },
      { x: Math.round(x - halfWidth), y: Math.round(y + halfHeight) },
      { x: Math.round(x - halfWidth), y: Math.round(y - halfHeight) },
    ]);

    setCropWindowPoints(points.map((p) => ({ ...p, color: "red" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  function handleExecute() {
    const p1 = points[0];
    const p2 = points[points.length - 1];
    const newPoints = cohenSutherlandClip([p1, p2], {
      min: {
        x: controls.x - controls.width / 2 + 1,
        y: controls.y - controls.height / 2 + 1,
      },
      max: {
        x: controls.x + controls.width / 2 - 1,
        y: controls.y + controls.height / 2 - 1,
      },
    });

    const roundedPoints = newPoints.map((p) => ({
      x: Math.round(p.x),
      y: Math.round(p.y),
    }));

    setPoints(drawNearestPoints(roundedPoints));
  }

  return (
    <Stack spacing={2}>
      <Typography>Janela de corte</Typography>
      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel htmlFor="height">Altura</InputLabel>
          <OutlinedInput
            id="height"
            name="height"
            label="Altura"
            type="number"
            value={controls.height}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, height: +e.target.value }))
            }
          />
        </FormControl>
        <FormControl size="small">
          <InputLabel htmlFor="width">Largura</InputLabel>
          <OutlinedInput
            id="width"
            name="width"
            label="Largura"
            type="number"
            value={controls.width}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, width: +e.target.value }))
            }
          />
        </FormControl>
      </Stack>
      <Typography>Posição (centro)</Typography>
      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel htmlFor="x">X</InputLabel>
          <OutlinedInput
            id="x"
            name="x"
            label="X"
            type="number"
            value={controls.x}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, x: +e.target.value }))
            }
          />
        </FormControl>
        <FormControl size="small">
          <InputLabel htmlFor="y">Y</InputLabel>
          <OutlinedInput
            id="y"
            name="y"
            label="Y"
            type="number"
            value={controls.y}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, y: +e.target.value }))
            }
          />
        </FormControl>
      </Stack>
      <Alert severity="info">
        Marque os vértices para formar a figura que será recortada.
      </Alert>
      <Button variant="contained" onClick={handleExecute}>
        Executar
      </Button>
    </Stack>
  );
}
