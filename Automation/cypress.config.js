const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://7thsemesterproject.vercel.app",
    supportFile: "cypress/support/e2e.js",
    video:true,
    screenshotsFolder:"cypress/screenshots",
    videosFolder:"cypress/videos",
    defaultCommandTimeout: 9900,
    retries: {
      runMode: 3,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      
    },
  },
});
