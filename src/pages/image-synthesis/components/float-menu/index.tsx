import { useState } from "react";
import {
  Button,
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const renderAlgorithmControl = () => {
    switch (algorithm) {
      case "bresenham":
        return <Bresenham />;
      case "circulos":
        return <Circles />;
      case "elipses":
        return <Ellipses />;
      case "bezier":
        return <BezierCurves />;
      case "polilinha":
        return <Polyline />;
      case "preenchimento":
        return <Fill />;
      case "recorte-linha":
        return <LineCropWindow />;
      case "recorte-poligonos":
        return <PolygonCropWindow />;
      case "transformacoes":
        return <Transformations />;
      case "projecoes":
        return <Projections />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        width: 300,
        maxHeight: "80vh",
        overflowY: "auto",
        borderRadius: 3,
        p: 2,
        background:
          "linear-gradient(180deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.95) 100%)",
        color: "#f1f5f9",
      }}
    >
      <Stack spacing={2}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "#38bdf8", textAlign: "center" }}
        >
          Painel de Ações
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel>Selecionar Algoritmo</InputLabel>
          <Select
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

        <FormControl fullWidth size="small">
          <InputLabel htmlFor="density">Quantidade de Pontos</InputLabel>
          <OutlinedInput
            id="density"
            type="number"
            inputProps={{ min: 1 }}
            value={canvasDensity}
            onChange={(e) => setCanvasDensity(Number(e.target.value))}
            label="Densidade de pontos"
          />
        </FormControl>

        <Accordion
          expanded={expanded === "algorithm-settings"}
          onChange={handleAccordionChange("algorithm-settings")}
          sx={{
            backgroundColor: "rgba(255,255,255,0.05)",
            color: "#f1f5f9",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#38bdf8" }} />}
          >
            <Typography sx={{ fontWeight: 600 }}>Configurações Avançadas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>{renderAlgorithmControl()}</Stack>
          </AccordionDetails>
        </Accordion>

        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setPoints([]);
            setIsCanvasClickDisabled(false);
          }}
        >
          Resetar Desenho
        </Button>
      </Stack>
    </Paper>
  );
}
