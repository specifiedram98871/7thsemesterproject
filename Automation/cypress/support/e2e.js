import 'cypress-mochawesome-reporter/register'; // Importing the mochawesome reporter for enhanced test reporting
import './commands'

// to disable uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})
