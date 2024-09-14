// export default defin
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [tsconfigPaths(), svelte()],

  server: {
    port: 4200,
    host: '0.0.0.0'
  }
});
