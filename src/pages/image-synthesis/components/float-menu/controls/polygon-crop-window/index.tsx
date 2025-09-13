import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { drawNearestPoints } from "../bresenham/algorithms";
import { sutherlandHodgmanClip } from "./algorithms";

export function PolygonCropWindow() {
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

    const cropPoints = drawNearestPoints([
      { x: Math.round(x - halfWidth), y: Math.round(y - halfHeight) },
      { x: Math.round(x + halfWidth), y: Math.round(y - halfHeight) },
      { x: Math.round(x + halfWidth), y: Math.round(y + halfHeight) },
      { x: Math.round(x - halfWidth), y: Math.round(y + halfHeight) },
      { x: Math.round(x - halfWidth), y: Math.round(y - halfHeight) },
    ]);

    setCropWindowPoints(cropPoints.map((p) => ({ ...p, color: "red" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  function handleExecute() {
    if (points.length < 3) return;

    const newPoints = sutherlandHodgmanClip(points, {
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

    setPoints(drawNearestPoints([...roundedPoints, roundedPoints[0]]));
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 400, margin: "auto", p: 2 }}>
      <Typography variant="h6">Janela de corte</Typography>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel htmlFor="height">Altura</InputLabel>
          <OutlinedInput
            id="height"
            type="number"
            inputProps={{ min: 1 }}
            value={controls.height}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, height: Math.max(1, +e.target.value) }))
            }
          />
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel htmlFor="width">Largura</InputLabel>
          <OutlinedInput
            id="width"
            type="number"
            inputProps={{ min: 1 }}
            value={controls.width}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, width: Math.max(1, +e.target.value) }))
            }
          />
        </FormControl>
      </Stack>

      <Typography>Posição do centro</Typography>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel htmlFor="x">X</InputLabel>
          <OutlinedInput
            id="x"
            type="number"
            value={controls.x}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, x: +e.target.value }))
            }
          />
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel htmlFor="y">Y</InputLabel>
          <OutlinedInput
            id="y"
            type="number"
            value={controls.y}
            onChange={(e) =>
              setControls((prev) => ({ ...prev, y: +e.target.value }))
            }
          />
        </FormControl>
      </Stack>

      <Alert severity="info">
        Marque os vértices do polígono que será recortado.
      </Alert>

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
