import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { drawNearestPoints } from "../bresenham/algorithms";
import { drawRecursiveFill, drawScanlineFill } from "./algorithms";
import { FILL_ALGORITHM_OPTIONS, FillAlgorithmType } from "./constants";
import { Point } from "../../../canvas/types";

export function Fill() {
  const { points, setPoints } = useImageSynthesis();
  const [isConcatenated, setIsConcatenated] = useState(false);
  const [fillingType, setFillingType] = useState<FillAlgorithmType>("recursive");
  const polygonPoints = useRef<Point[]>([]);

  function handleStorePolygonPoints() {
    polygonPoints.current = drawNearestPoints([...points, points[0]]);
    setPoints(polygonPoints.current);
  }

  useEffect(() => {
    if (!points.length) {
      polygonPoints.current = [];
      return;
    }

    const fillFunction = fillingType === "recursive" ? drawRecursiveFill : drawScanlineFill;

    const lastPoint = points[points.length - 1];
    const boundaryPoints = polygonPoints.current;
    const lastBoundaryPoint = boundaryPoints[boundaryPoints.length - 1];
    const isNotLastPoint = lastPoint !== lastBoundaryPoint;

    if (boundaryPoints.length && isNotLastPoint) {
      const newPoints = fillFunction(lastPoint, boundaryPoints);
      setPoints([...(isConcatenated ? points : boundaryPoints), ...newPoints]);
    }
  }, [points, setPoints, isConcatenated, fillingType]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 400, margin: "auto", p: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel htmlFor="fill-algorithm">Tipo de preenchimento</InputLabel>
        <Select
          id="fill-algorithm"
          name="fill-algorithm"
          value={fillingType}
          onChange={(e) => setFillingType(e.target.value as FillAlgorithmType)}
        >
          {FILL_ALGORITHM_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!polygonPoints.current.length && (
        <Stack spacing={2}>
          <Alert severity="info">
            Crie um polígono marcando pelo menos 3 vértices e depois clique em prosseguir.
          </Alert>

          <Button
            variant="contained"
            onClick={handleStorePolygonPoints}
            disabled={points.length < 3}
          >
            Prosseguir
          </Button>
        </Stack>
      )}

      {!!polygonPoints.current.length && (
        <Stack spacing={2}>
          <Alert severity="info">
            Clique em um ponto dentro do polígono para iniciar o preenchimento.
          </Alert>

          <FormControlLabel
            control={
              <Checkbox
                checked={isConcatenated}
                onChange={(e) => setIsConcatenated(e.target.checked)}
              />
            }
            label="Concatenar preenchimentos"
          />
        </Stack>
      )}
    </Stack>
  );
}
