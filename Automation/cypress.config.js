const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:`${Cypress.env('frontendUrl')}`,
    supportFile: "cypress/support/e2e.js",
    video:true,
    screenshotsFolder:"cypress/screenshots",
    videosFolder:"cypress/videos",
    setupNodeEvents(on, config) {
      
    },
  },
});
