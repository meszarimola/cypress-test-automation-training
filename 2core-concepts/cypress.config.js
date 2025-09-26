const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://deals.androidauthority.com",
    defaultCommandTimeout: 6000,
    viewportWidth: 1366,
    viewportHeight: 768,

    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push(
            "--disable-blink-features=AutomationControlled"
          );
          launchOptions.args.push("--lang=hu-HU");
        }
        return launchOptions;
      });

      on("task", {
        log(message) {
          console.log(message);

          return null;
        },
      });

      return config;
    },
  },
});
