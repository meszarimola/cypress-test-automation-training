const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://ultimateqa.com/automation",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
