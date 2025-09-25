import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://ultimateqa.com",
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
  },
});
