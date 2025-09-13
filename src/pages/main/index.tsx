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
        fontFamily: "'Poppins', sans-serif", // fonte moderna e limpa
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1976d2",
          padding: 4,
          borderRadius: 3,
          width: "100%",
          textAlign: "center",
          marginBottom: 5,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ color: "#fff", marginBottom: 1.5, fontWeight: 700 }}
        >
          Computação Gráfica
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{ color: "#e0e0e0", marginBottom: 0.5 }}
        >
          Trabalho Prático
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ color: "#fff", marginTop: 1 }}
        >
          Luiz Mateus Pereira da Conceição &bull; Fellipe Machado Castro
        </Typography>
      </Box>

      <Stack spacing={3} direction="column" alignItems="center" sx={{ width: "100%" }}>
        <Button
          variant="contained"
          component={Link}
          to="/image-synthesis"
          sx={{
            width: "100%",
            paddingY: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: 2,
            backgroundColor: "#ff5722",
            "&:hover": {
              backgroundColor: "#e64a19",
            },
          }}
        >
          Criar Imagens
        </Button>
      </Stack>
    </Container>
  );
}
