import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Stack,
} from "@mui/material";
import { applyPrewittFilter, applySobelFilter } from "./filters/sobel-prewitt";
import { applyGrayScaleFilter } from "./filters/grayscale";
import { applyBinaryFilter } from "./filters/binary";
import { applyMeanFilter } from "./filters/mean-blur";
import { applyMedianFilter } from "./filters/median-blur";
import { applyGaussianFilter } from "./filters/gaussian-blur";
import { FilterType } from "./types";
import { applyCannyFilter } from "./filters/canny";

export function ImageProcessingPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [filter, setFilter] = useState<FilterType>("none");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);

  function resetForm() {
    window.location.reload();
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current && processedCanvasRef.current) {
          const aspectRatio = img.width / img.height;
          const width = canvasRef.current.width;
          const height = width / aspectRatio;
          canvasRef.current.height = height;
          processedCanvasRef.current.width = width;
          processedCanvasRef.current.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          setImage(img);
        }
      };
    }
  }

  function applyFilter() {
    if (!image || !canvasRef.current || !processedCanvasRef.current) return;
    const originalCtx = canvasRef.current.getContext("2d");
    const processedCtx = processedCanvasRef.current.getContext("2d");

    let imageData = originalCtx!.getImageData(0, 0, image.width, image.height);

    switch (filter) {
      case "grayScale":
        imageData = applyGrayScaleFilter(imageData);
        break;
      case "binary":
        imageData = applyBinaryFilter(imageData);
        break;
      case "mean":
        imageData = applyMeanFilter(imageData);
        break;
      case "median":
        imageData = applyMedianFilter(imageData);
        break;
      case "gaussian":
        imageData = applyGaussianFilter(imageData);
        break;
      case "sobel":
        imageData = applySobelFilter(imageData);
        break;
      case "prewitt":
        imageData = applyPrewittFilter(imageData);
        break;
      case "canny":
        imageData = applyCannyFilter(imageData);
        break;
      default:
        break;
    }

    processedCtx!.putImageData(imageData, 0, 0);
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Typography variant="h6" mt={2}>
        Escolha um filtro para aplicar
      </Typography>
      <RadioGroup
        row
        value={filter}
        onChange={(e) => setFilter(e.target.value as FilterType)}
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: 800,
          flexWrap: "wrap",
        }}
      >
        <FormControlLabel value="none" control={<Radio />} label="Nenhum" />
        <FormControlLabel
          value="grayScale"
          control={<Radio />}
          label="Tons de Cinza"
        />
        <FormControlLabel value="binary" control={<Radio />} label="Binária" />
        <FormControlLabel
          value="mean"
          control={<Radio />}
          label="Desfoque de Média"
        />
        <FormControlLabel
          value="median"
          control={<Radio />}
          label="Desfoque de Mediana"
        />
        <FormControlLabel
          value="gaussian"
          control={<Radio />}
          label="Desfoque Gaussiano"
        />
        <FormControlLabel
          value="sobel"
          control={<Radio />}
          label="Filtro de Sobel"
        />
        <FormControlLabel
          value="prewitt"
          control={<Radio />}
          label="Filtro de Prewitt"
        />
        <FormControlLabel
          value="canny"
          control={<Radio />}
          label="Filtro de Canny"
        />
      </RadioGroup>
      <Stack mt={2} direction="row" spacing={2}>
        <Button variant="contained" onClick={applyFilter}>
          Aplicar filtro
        </Button>
        <Button variant="contained" onClick={resetForm}>
          Reiniciar
        </Button>
      </Stack>
      <Box display="flex" gap={2} mt={4}>
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid black", width: "100%" }}
        />
        <canvas
          ref={processedCanvasRef}
          style={{ border: "1px solid black", width: "100%" }}
        />
      </Box>
    </Box>
  );
}
