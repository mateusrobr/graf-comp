import { Container, Typography, Button, Stack, Box } from "@mui/material";
import { Link } from "react-router-dom";

export function MainPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        paddingTop: 6,
      }}
    >
      <Box
        sx={{
          backgroundColor: "primary.main",
          padding: 3,
          borderRadius: 2,
          width: "100%",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#fff", marginBottom: 1 }}
        >
          Computação Gráfica - Trabalho Prático
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ color: "#fff" }}
        >
          Luiz Mateus Pereira da Conceição
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ color: "#fff" }}
        >
          Fellipe Machado Castro
        </Typography>
      </Box>

      <Stack spacing={2} direction="column" alignItems="center" sx={{ width: "100%" }}>
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
