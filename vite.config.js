const { defineConfig } = require("vite");
const path = require("path");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        client: "./src/client.ts",
        background: "./src/background.ts",
        options: "./src/options.ts",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        sourcemap: "inline",
      },
    },
  },
});
