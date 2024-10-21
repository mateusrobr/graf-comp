/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import {
  cavalierProjection,
  orthographicProjection,
  perspectiveProjection,
} from "./algorithms";
import { useImageSynthesis } from "@/pages/image-synthesis/hooks/use-image-synthesis";
import { drawNearestPoints } from "../bresenham/algorithms";
import { Point3D, ProjectionTypes } from "./types";
import { PROJECTION_OPTIONS } from "./constants";
import { Point } from "../../../canvas/types";

export function Projections() {
  const { setPoints } = useImageSynthesis();

  const [projectionType, setProjectionType] =
    useState<ProjectionTypes>("orthographic");

  const [points3D, setPoints3D] = useState<Point3D[]>([
    { x: 50, y: 10, z: 30 },
    { x: 70, y: 10, z: 30 },
    { x: 70, y: 30, z: 30 },
    { x: 50, y: 30, z: 30 },
    { x: 50, y: 10, z: 50 },
    { x: 70, y: 10, z: 50 },
    { x: 70, y: 30, z: 50 },
    { x: 50, y: 30, z: 50 },
  ]);

  const [controls, setControls] = useState({
    perspective: {
      d: 100,
    },
    cavalier: {
      angle: 20,
      scale: 0.25,
    },
  });

  function handleExecute() {
    let projectedPoints: Point[] = [];

    if (projectionType === "orthographic") {
      projectedPoints = points3D.map((p) => orthographicProjection(p));
    }

    if (projectionType === "oblique") {
      projectedPoints = points3D.map((p) =>
        cavalierProjection(p, controls.cavalier.angle, controls.cavalier.scale)
      );
    }

    if (projectionType === "perspective") {
      projectedPoints = points3D.map((p) =>
        perspectiveProjection(p, controls.perspective.d)
      );
    }

    const edges: [Point, Point][] = [
      // Frente
      [projectedPoints[0], projectedPoints[1]],
      [projectedPoints[1], projectedPoints[2]],
      [projectedPoints[2], projectedPoints[3]],
      [projectedPoints[3], projectedPoints[0]],
      // Trás
      [projectedPoints[4], projectedPoints[5]],
      [projectedPoints[5], projectedPoints[6]],
      [projectedPoints[6], projectedPoints[7]],
      [projectedPoints[7], projectedPoints[4]],
      // Conectando frente e trás
      [projectedPoints[0], projectedPoints[4]],
      [projectedPoints[1], projectedPoints[5]],
      [projectedPoints[2], projectedPoints[6]],
      [projectedPoints[3], projectedPoints[7]],
    ];

    projectedPoints = edges.reduce(
      (acc, pts) => [...acc, ...drawNearestPoints(pts)],
      [] as Point[]
    );

    setPoints(projectedPoints);
  }

  useEffect(() => {
    handleExecute();
  }, [controls, projectionType]); // Adicionado projectionType às dependências

  return (
    <Stack spacing={2}>
      <FormControl size="small">
        <InputLabel htmlFor="projection-type">Tipo de projeção</InputLabel>
        <Select
          id="projection-type"
          name="projection-type"
          label="Tipo de projeção"
          value={projectionType}
          onChange={(e) => setProjectionType(e.target.value as ProjectionTypes)}
        >
          {PROJECTION_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {projectionType === "perspective" && (
        <Stack spacing={2}>
          <Typography>Distância focal</Typography>
          <Slider
            value={controls.perspective.d}
            onChange={(_, value) =>
              setControls({ ...controls, perspective: { d: value as number } })
            }
            min={0}
            max={400}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}u`}
          />
        </Stack>
      )}

      {projectionType === "oblique" && (
        <Stack spacing={2}>
          <Typography>Ângulo</Typography>
          <Slider
            value={controls.cavalier.angle}
            onChange={(_, value) =>
              setControls({
                ...controls,
                cavalier: { ...controls.cavalier, angle: value as number },
              })
            }
            min={0}
            max={360}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}°`}
          />

          <Typography>Escala</Typography>
          <Slider
            value={controls.cavalier.scale}
            onChange={(_, value) =>
              setControls({
                ...controls,
                cavalier: { ...controls.cavalier, scale: value as number },
              })
            }
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}`}
          />
        </Stack>
      )}

      {points3D.map((p, i) => (
        <Stack spacing={2} key={i}>
          <Typography>Ponto {i + 1}</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <InputLabel htmlFor={`x-${i}`}>X</InputLabel>
              <OutlinedInput
                id={`x-${i}`}
                name={`x-${i}`}
                label="X"
                type="number"
                value={p.x}
                onChange={(e) => {
                  const newPoints = [...points3D];
                  newPoints[i].x = Number(e.target.value);
                  setPoints3D(newPoints);
                }}
              />
            </FormControl>
            <FormControl size="small">
              <InputLabel htmlFor={`y-${i}`}>Y</InputLabel>
              <OutlinedInput
                id={`y-${i}`}
                name={`y-${i}`}
                label="Y"
                type="number"
                value={p.y}
                onChange={(e) => {
                  const newPoints = [...points3D];
                  newPoints[i].y = Number(e.target.value);
                  setPoints3D(newPoints);
                }}
              />
            </FormControl>
            <FormControl size="small">
              <InputLabel htmlFor={`z-${i}`}>Z</InputLabel>
              <OutlinedInput
                id={`z-${i}`}
                name={`z-${i}`}
                label="Z"
                type="number"
                value={p.z}
                onChange={(e) => {
                  const newPoints = [...points3D];
                  newPoints[i].z = Number(e.target.value);
                  setPoints3D(newPoints);
                }}
              />
            </FormControl>
          </Stack>
        </Stack>
      ))}

      <Button variant="contained" onClick={handleExecute}>
        Projetar
      </Button>
    </Stack>
  );
}
