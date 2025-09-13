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
    <Stack spacing={3} sx={{ maxWidth: 450, margin: "auto", p: 2 }}>
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
          <Typography variant="h6">Rotação</Typography>
          <FormControl fullWidth size="small">
            <InputLabel htmlFor="rotation">Ângulo de rotação (°)</InputLabel>
            <OutlinedInput
              id="rotation"
              type="number"
              inputProps={{ min: 0, max: 360 }}
              value={controls.rotation.angle}
              onChange={(e) =>
                setControls((prev) => ({
                  ...prev,
                  rotation: { ...prev.rotation, angle: Number(e.target.value) },
                }))
              }
            />
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="pivotX">Pivô X</InputLabel>
              <OutlinedInput
                id="pivotX"
                type="number"
                inputProps={{ min: 0 }}
                value={controls.rotation.fixPoint.x}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    rotation: {
                      ...prev.rotation,
                      fixPoint: { ...prev.rotation.fixPoint, x: Number(e.target.value) },
                    },
                  }))
                }
              />
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="pivotY">Pivô Y</InputLabel>
              <OutlinedInput
                id="pivotY"
                type="number"
                inputProps={{ min: 0 }}
                value={controls.rotation.fixPoint.y}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    rotation: {
                      ...prev.rotation,
                      fixPoint: { ...prev.rotation.fixPoint, y: Number(e.target.value) },
                    },
                  }))
                }
              />
            </FormControl>
          </Stack>

          <Typography color="info.main" fontSize={14}>
            Ponto azul indica pivô de rotação
          </Typography>

          <Typography variant="h6">Translação</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="translationX">X</InputLabel>
              <OutlinedInput
                id="translationX"
                type="number"
                value={controls.translation.x}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    translation: { ...prev.translation, x: Number(e.target.value) },
                  }))
                }
              />
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="translationY">Y</InputLabel>
              <OutlinedInput
                id="translationY"
                type="number"
                value={controls.translation.y}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    translation: { ...prev.translation, y: Number(e.target.value) },
                  }))
                }
              />
            </FormControl>
          </Stack>

          <Typography variant="h6">Escala</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="scaleX">X (%)</InputLabel>
              <OutlinedInput
                id="scaleX"
                type="number"
                inputProps={{ min: 0, max: 200 }}
                value={controls.scale.x}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    scale: { ...prev.scale, x: Number(e.target.value) },
                  }))
                }
              />
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="scaleY">Y (%)</InputLabel>
              <OutlinedInput
                id="scaleY"
                type="number"
                inputProps={{ min: 0, max: 200 }}
                value={controls.scale.y}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    scale: { ...prev.scale, y: Number(e.target.value) },
                  }))
                }
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="fixPointX">Ponto fixo X</InputLabel>
              <OutlinedInput
                id="fixPointX"
                type="number"
                inputProps={{ min: 0, max: 360 }}
                value={controls.scale.fixPoint.x}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    scale: {
                      ...prev.scale,
                      fixPoint: { ...prev.scale.fixPoint, x: Number(e.target.value) },
                    },
                  }))
                }
              />
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="fixPointY">Ponto fixo Y</InputLabel>
              <OutlinedInput
                id="fixPointY"
                type="number"
                inputProps={{ min: 0, max: 360 }}
                value={controls.scale.fixPoint.y}
                onChange={(e) =>
                  setControls((prev) => ({
                    ...prev,
                    scale: {
                      ...prev.scale,
                      fixPoint: { ...prev.scale.fixPoint, y: Number(e.target.value) },
                    },
                  }))
                }
              />
            </FormControl>
          </Stack>

          <Typography color="error.main" fontSize={14}>
            Ponto vermelho indica pivô de escala
          </Typography>
        </>
      )}
    </Stack>
  );
}
