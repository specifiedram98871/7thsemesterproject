import './commands'

// to disable uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})
