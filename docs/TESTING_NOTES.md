Testing Framework: Cypress

We added a Cypress spec in cypress/integration/script.spec.js to validate DOM behaviors:
- Theme toggling: button's text and body's dark-mode class
- Newsletter form submission: feedback visibility and form reset
- Defensive behavior when elements are missing

Because the file cypress/integration/script.spec.js previously contained app-side DOM manipulation code rather than Cypress tests, we preserved it as cypress/integration/script.spec.js.orig and moved the DOM code into public/js/dom-script.js. Tests use a minimal HTML fixture at cypress/fixtures/theme_newsletter.html to run in Cypress without a running server.

These tests aim to cover happy paths, edge cases, and failure conditions, and they follow the repository's Cypress-based testing conventions.