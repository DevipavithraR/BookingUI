// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
 optimizeDeps: {
  exclude: ["arffy-react-api-library", "arffy-react-api-library/api"],
},

  server: {
    host: true,
  },
  resolve: {
    preserveSymlinks: true,
  },
});
