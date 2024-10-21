import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { ALGORITHM_OPTIONS } from "./constants";

import { Bresenham } from "./controls/bresenham";
import { Circles } from "./controls/circles";
import { Ellipses } from "./controls/ellipses";
import { BezierCurves } from "./controls/bezier";
import { Polyline } from "./controls/polyline";
import { Fill } from "./controls/fill";
import { LineCropWindow } from "./controls/line-crop-window";
import { PolygonCropWindow } from "./controls/polygon-crop-window";
import { Transformations } from "./controls/transformations";
import { Projections } from "./controls/projections";

import { useImageSynthesis } from "../../hooks/use-image-synthesis";

import { Algorithms } from "../../types";

export function FloatMenu() {
  const {
    setAlgorithm,
    algorithm,
    setPoints,
    canvasDensity,
    setCanvasDensity,
    setCropWindowPoints,
    setIsCanvasClickDisabled,
  } = useImageSynthesis();

  return (
    <Card
      variant="elevation"
      style={{ borderRadius: "8px", overflowY: "auto" }}
    >
      <Box padding={2} width={250}>
        <form>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Menu de ações
            </Typography>

            <Stack spacing={2}>
              <FormControl size="small">
                <InputLabel htmlFor="algorithm">
                  Escolha um algoritmo
                </InputLabel>
                <Select
                  id="algorithm"
                  name="algorithm"
                  label="Escolha um algoritmo"
                  defaultValue="bresenham"
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value as Algorithms);
                    setPoints([]);
                    setCropWindowPoints([]);
                  }}
                >
                  {ALGORITHM_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel htmlFor="density">Densidade de pontos</InputLabel>
                <OutlinedInput
                  id="density"
                  name="density"
                  label="Densidade de pontos"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={canvasDensity}
                  onChange={(e) => setCanvasDensity(Number(e.target.value))}
                />
              </FormControl>

              {algorithm === "bresenham" && <Bresenham />}
              {algorithm === "circulos" && <Circles />}
              {algorithm === "elipses" && <Ellipses />}
              {algorithm === "bezier" && <BezierCurves />}
              {algorithm === "polilinha" && <Polyline />}
              {algorithm === "preenchimento" && <Fill />}
              {algorithm === "recorte-linha" && <LineCropWindow />}
              {algorithm === "recorte-poligonos" && <PolygonCropWindow />}
              {algorithm === "transformacoes" && <Transformations />}
              {algorithm === "projecoes" && <Projections />}
            </Stack>

            <Button
              variant="outlined"
              onClick={() => {
                setPoints([]);
                setIsCanvasClickDisabled(false);
              }}
            >
              Limpar canvas
            </Button>
          </Stack>
        </form>
      </Box>
    </Card>
  );
}
