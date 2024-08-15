const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: 'https://gorest.co.in/public/v2',
    specPattern: '**/**/*.cy.js',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)

          return null
        },
      })
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
