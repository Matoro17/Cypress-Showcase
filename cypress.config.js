const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    experimentalSessionAndOrigin: true,
  },
  reporterOptions: {
    reportFilename: "[status]_[datetime]-[name]-report",
    quiet: true,
    overwrite: false,
  },
});
