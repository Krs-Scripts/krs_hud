import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import App from "./App";
import { isEnvBrowser } from "./utils/misc";
import { debugData } from "./utils/debugData";
import { theme } from "./theme";
import { MantineProvider } from "@mantine/core";

debugData([
  {
    action: "setVisible",
    data: "show-ui",
  },
]);

if (isEnvBrowser()) {
  const root = document.getElementById("root");

  if (root) {
    root.style.backgroundImage = "url('https://www.wikigta6.com/wp-content/uploads/2025/09/GTA-6-Wallpapers-Trailer-2-23.jpg')";
    // root.style.backgroundColor = "#333333"; 
    root.style.backgroundSize = "cover";
    root.style.backgroundRepeat = "no-repeat";
    root.style.backgroundPosition = "center";
  }
}

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <MantineProvider theme={{ ...theme }}>
      <App></App>
    </MantineProvider>
  </React.StrictMode>,
);
