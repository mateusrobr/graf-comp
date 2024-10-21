/* eslint-disable react-hooks/exhaustive-deps */
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
import { Point } from "../../../canvas/types";
import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { drawNearestPoints } from "../bresenham/algorithms";
import { applyRotation, applyScale, applyTranslation } from "./algorithms";
import { DEFAULT_CONTROL_VALUES } from "./constants";

export function Transformations() {
  const { points, setPoints, setIsCanvasClickDisabled } = useImageSynthesis();

  const [originalVertices, setOriginalVertices] = useState<Point[]>([]);
  const [controls, setControls] = useState(DEFAULT_CONTROL_VALUES);

  function handleStorePolygonPoints() {
    if (points.length < 3) return;
    setOriginalVertices([...points]);
    setIsCanvasClickDisabled(true);
  }

  function applyAllTransformations() {
    let transformed = [...originalVertices];

    transformed = applyScale(
      transformed,
      {
        xPercent: controls.scale.x / 100,
        yPercent: controls.scale.y / 100,
      },
      controls.scale.fixPoint
    );

    transformed = applyRotation(
      transformed,
      controls.rotation.angle,
      controls.rotation.fixPoint
    );

    transformed = applyTranslation(transformed, {
      x: controls.translation.x,
      y: controls.translation.y,
    });

    const finalPoints = drawNearestPoints([...transformed, transformed[0]]);

    if (controls.rotation.fixPoint.x || controls.rotation.fixPoint.y) {
      finalPoints.push({
        x: controls.rotation.fixPoint.x,
        y: controls.rotation.fixPoint.y,
        color: "blue",
      });
    }

    if (controls.scale.fixPoint.x || controls.scale.fixPoint.y) {
      finalPoints.push({
        x: controls.scale.fixPoint.x,
        y: controls.scale.fixPoint.y,
        color: "red",
      });
    }

    setPoints(finalPoints);
  }

  useEffect(() => {
    if (originalVertices.length > 0) {
      applyAllTransformations();
    }
  }, [controls, originalVertices]);

  useEffect(() => {
    if (!points.length) {
      setOriginalVertices([]);
      setControls(DEFAULT_CONTROL_VALUES);
    }
  }, [points]);

  return (
    <Stack spacing={2}>
      {!originalVertices.length ? (
        <>
          <Alert severity="info">
            Crie um polígono marcando os vértices e depois clique em prosseguir.
          </Alert>

          <Button
            variant="contained"
            onClick={handleStorePolygonPoints}
            disabled={points.length < 3}
          >
            Prosseguir
          </Button>
        </>
      ) : (
        <>
          <Typography>Rotação</Typography>
          <FormControl size="small">
            <InputLabel htmlFor="rotation">
              Ângulo de rotação (graus)
            </InputLabel>
            <OutlinedInput
              id="rotation"
              type="number"
              label="Ângulo de rotação (graus)"
              value={controls.rotation.angle}
              inputProps={{ min: 0, max: 360 }}
              onChange={(e) => {
                const angle = Number(e.target.value);
                setControls((prev) => ({
                  ...prev,
                  rotation: { ...prev.rotation, angle },
                }));
              }}
            />
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <InputLabel htmlFor="pivotX">Pivô X</InputLabel>
              <OutlinedInput
                id="pivotX"
                type="number"
                label="Pivô X"
                value={controls.rotation.fixPoint.x}
                inputProps={{ min: 0 }}
                onChange={(e) => {
                  const x = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    rotation: {
                      ...prev.rotation,
                      fixPoint: { ...prev.rotation.fixPoint, x },
                    },
                  }));
                }}
              />
            </FormControl>
            <FormControl size="small">
              <InputLabel htmlFor="pivotY">Pivô Y</InputLabel>
              <OutlinedInput
                id="pivotY"
                type="number"
                label="Pivô Y"
                value={controls.rotation.fixPoint.y}
                inputProps={{ min: 0 }}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    rotation: {
                      ...prev.rotation,
                      fixPoint: { ...prev.rotation.fixPoint, y },
                    },
                  }));
                }}
              />
            </FormControl>
          </Stack>

          <Typography color="info" fontSize={14}>
            Posicione o ponto azul no gráfico
          </Typography>

          <Typography>Translação</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel htmlFor="translationX">X</InputLabel>
              <OutlinedInput
                id="translationX"
                type="number"
                label="X"
                value={controls.translation.x}
                onChange={(e) => {
                  const x = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    translation: { ...prev.translation, x },
                  }));
                }}
              />
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel htmlFor="translationY">Y</InputLabel>
              <OutlinedInput
                id="translationY"
                type="number"
                label="Y"
                value={controls.translation.y}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    translation: { ...prev.translation, y },
                  }));
                }}
              />
            </FormControl>
          </Stack>

          <Typography>Escala</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel htmlFor="scaleX">X (%)</InputLabel>
              <OutlinedInput
                id="scaleX"
                type="number"
                label="X (%)"
                value={controls.scale.x}
                inputProps={{ min: 0, max: 200 }}
                onChange={(e) => {
                  const x = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    scale: { ...prev.scale, x },
                  }));
                }}
              />
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel htmlFor="scaleY">Y (%)</InputLabel>
              <OutlinedInput
                id="scaleY"
                type="number"
                label="Y (%)"
                value={controls.scale.y}
                inputProps={{ min: 0, max: 200 }}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    scale: { ...prev.scale, y },
                  }));
                }}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel htmlFor="fixPointX">Ponto fixo X</InputLabel>
              <OutlinedInput
                id="fixPointX"
                type="number"
                label="Ponto fixo X"
                value={controls.scale.fixPoint.x}
                inputProps={{ min: 0, max: 360 }}
                onChange={(e) => {
                  const x = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    scale: {
                      ...prev.scale,
                      fixPoint: { ...prev.scale.fixPoint, x },
                    },
                  }));
                }}
              />
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel htmlFor="fixPointY">Ponto fixo Y</InputLabel>
              <OutlinedInput
                id="fixPointY"
                type="number"
                label="Ponto fixo Y"
                value={controls.scale.fixPoint.y}
                inputProps={{ min: 0, max: 360 }}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setControls((prev) => ({
                    ...prev,
                    scale: {
                      ...prev.scale,
                      fixPoint: { ...prev.scale.fixPoint, y },
                    },
                  }));
                }}
              />
            </FormControl>
          </Stack>

          <Typography color="error" fontSize={14}>
            Posicione o ponto vermelho no gráfico
          </Typography>
        </>
      )}
    </Stack>
  );
}
