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
  Paper,
} from "@mui/material";
import {
  cavalierProjection,
  orthographicProjection,
  perspectiveProjection,
  cabinetProjection,
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
    perspective: { d: 100 },
    cavalier: { angle: 20, scale: 0.25 },
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

    if (projectionType === "cabinet") {
      projectedPoints = points3D.map((p) =>
        cabinetProjection(p, controls.cavalier.angle)
      );
    }

    const edges: [Point, Point][] = [
      [projectedPoints[0], projectedPoints[1]],
      [projectedPoints[1], projectedPoints[2]],
      [projectedPoints[2], projectedPoints[3]],
      [projectedPoints[3], projectedPoints[0]],
      [projectedPoints[4], projectedPoints[5]],
      [projectedPoints[5], projectedPoints[6]],
      [projectedPoints[6], projectedPoints[7]],
      [projectedPoints[7], projectedPoints[4]],
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
  }, [controls, projectionType]);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#f1f5f9",
        fontFamily: "Inter, sans-serif",
        width: 320,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#38bdf8" }}>
          Configurações de Projeção
        </Typography>

        {/* Tipo de projeção */}
        <FormControl size="small" fullWidth>
          <InputLabel sx={{ color: "#38bdf8" }}>Tipo de projeção</InputLabel>
          <Select
            value={projectionType}
            onChange={(e) => setProjectionType(e.target.value as ProjectionTypes)}
            sx={{
              bgcolor: "#0f172a",
              color: "white",
              borderRadius: 2,
              "& .MuiSvgIcon-root": { color: "#38bdf8" },
            }}
          >
            {PROJECTION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Perspective controls */}
        {projectionType === "perspective" && (
          <Stack spacing={1}>
            <Typography variant="body2">Distância focal</Typography>
            <Slider
              value={controls.perspective.d}
              onChange={(_, value) =>
                setControls({ ...controls, perspective: { d: value as number } })
              }
              min={0}
              max={400}
              step={1}
              valueLabelDisplay="auto"
              sx={{ color: "#38bdf8" }}
            />
          </Stack>
        )}

        {/* Oblique controls */}
        {projectionType === "oblique" && (
          <Stack spacing={2}>
            <div>
              <Typography variant="body2">Ângulo</Typography>
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
                sx={{ color: "#38bdf8" }}
              />
            </div>

            <div>
              <Typography variant="body2">Escala</Typography>
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
                sx={{ color: "#38bdf8" }}
              />
            </div>
          </Stack>
        )}

        {/* Pontos 3D */}
        <Stack spacing={2}>
          <Typography variant="subtitle2" sx={{ color: "#38bdf8" }}>
            Coordenadas dos pontos
          </Typography>
          {points3D.map((p, i) => (
            <Stack spacing={1} key={i}>
              <Typography variant="caption">Ponto {i + 1}</Typography>
              <Stack direction="row" spacing={1}>
                {["x", "y", "z"].map((axis) => (
                  <FormControl size="small" key={axis}>
                    <InputLabel>{axis.toUpperCase()}</InputLabel>
                    <OutlinedInput
                      type="number"
                      value={p[axis as keyof Point3D]}
                      onChange={(e) => {
                        const newPoints = [...points3D];
                        newPoints[i][axis as keyof Point3D] = Number(
                          e.target.value
                        );
                        setPoints3D(newPoints);
                      }}
                      sx={{
                        bgcolor: "#0f172a",
                        color: "white",
                        borderRadius: 2,
                      }}
                    />
                  </FormControl>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>

        {/* Botão */}
        <Button
          variant="contained"
          onClick={handleExecute}
          sx={{
            mt: 2,
            bgcolor: "#38bdf8",
            color: "black",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": { bgcolor: "#0ea5e9", color: "white" },
          }}
        >
          Projetar
        </Button>
      </Stack>
    </Paper>
  );
}
