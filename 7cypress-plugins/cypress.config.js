const { defineConfig } = require("cypress");
const {
  addMatchImageSnapshotPlugin,
} = require("cypress-image-snapshot/plugin");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports/html",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: false,
    html: true,
    // FONTOS: ne legyen html:false; maradjon alapértelmezett (HTML készül)
    // json true maradhat, az kell az összefésüléshez is
    json: true,
  },
  e2e: {
    specPattern: ["cypress/e2e/**/*.cy.{js,ts}", "cypress/e2e/**/*.feature"],
    baseUrl: "https://deals.androidauthority.com",
    defaultCommandTimeout: 6000,
    viewportWidth: 1366,
    viewportHeight: 768,

    async setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      require("cypress-mochawesome-reporter/plugin")(on);
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // --- ÚJ: social logins task ---
      const { GoogleSocialLogin } = require("cypress-social-logins").plugins;
      on("task", {
        GoogleSocialLogin, // most elég a Google; más providert később bővíthetsz
        log(message) {
          console.log(message);
          return null;
        },
      });

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
