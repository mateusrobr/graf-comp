import { Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export function MainPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography textAlign="center" variant="h4" component="h1" gutterBottom>
        Computação Gráfica - Geração e Processamento de Imagens
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
        Escolha uma das opções abaixo para começar:
      </Typography>
      <Stack spacing={2} direction="column" alignItems="center">
        <Button
          variant="contained"
          component={Link}
          to="/image-synthesis"
          sx={{ width: "100%" }}
        >
          Geração de Imagens
        </Button>
      </Stack>
    </Container>
  );
}
