import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import "@/common/styles/reset.css";
import "@/common/styles/global.css";
import { MainPage } from "./pages/main";

import { ImageSynthesisPage } from "./pages/image-synthesis";
import { ImageSynthesisProvider } from "./pages/image-synthesis/contexts/image-synthesis";
import { ImageProcessingPage } from "./pages/image-processing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/image-processing",
    element: <ImageProcessingPage />,
  },

  {
    path: "/image-synthesis",
    element: (
      <ImageSynthesisProvider>
        <ImageSynthesisPage />
      </ImageSynthesisProvider>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
