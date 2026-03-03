const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "http://localhost:5173",
    supportFile: "cypress/support/e2e.js",
    video:true,
    screenshotsFolder:"cypress/screenshots",
    videosFolder:"cypress/videos",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
