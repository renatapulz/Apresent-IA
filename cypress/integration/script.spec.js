/// <reference types="cypress" />

// These tests validate DOM behavior for:
// - Theme toggle button (#toggle-theme): toggles body.dark-mode and updates its text between 🌙 and ☀️
// - Newsletter form (#newsletter-form): shows feedback (#newsletter-feedback) and resets the form on submit
//
// Framework & library: Cypress (Mocha + Chai)
// Strategy: We visit about:blank, mount a minimal HTML fixture, then inject the app script as an inline <script>
// Focus: Happy paths, edge cases, and failure conditions (missing required elements)

describe('UI script behaviors', function () {
  // The exact script under test (copied from the original file content)
  const appScript = `
const body = document.body;
const toggleBtn = document.getElementById("toggle-theme");

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }
});

document.getElementById("newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletter-feedback").style.display = "block";
});

document.getElementById("newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletter-feedback").style.display = "block";
    e.target.reset();
});
`;

  const buildHtml = (opts = {}) => {
    const includeToggle = opts.includeToggle !== false;
    const includeFeedback = opts.includeFeedback !== false;

    return `
      ${includeToggle ? '<button id="toggle-theme" type="button">🌙</button>' : ''}
      <form id="newsletter-form">
        <input id="email" name="email" type="email" value="">
        <button id="submit" type="submit">Subscribe</button>
      </form>
      ${includeFeedback ? '<div id="newsletter-feedback" style="display: none;">Thanks for subscribing!</div>' : ''}
    `;
  };

  const mountApp = (doc, opts = {}) => {
    doc.body.innerHTML = buildHtml(opts);
    const script = doc.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = appScript;
    doc.body.appendChild(script);
  };

  context('happy paths', function () {
    beforeEach(function () {
      cy.visit('about:blank');
      cy.document().then((doc) => {
        mountApp(doc, {});
      });
    });

    it('toggles dark mode and updates toggle button text on each click', function () {
      cy.get('body').should('not.have.class', 'dark-mode');
      cy.get('#toggle-theme').should('have.text', '🌙');

      // First click -> enable dark mode and show sun
      cy.get('#toggle-theme').click();
      cy.get('body').should('have.class', 'dark-mode');
      cy.get('#toggle-theme').should('have.text', '☀️');

      // Second click -> disable dark mode and show moon
      cy.get('#toggle-theme').click();
      cy.get('body').should('not.have.class', 'dark-mode');
      cy.get('#toggle-theme').should('have.text', '🌙');
    });

    it('shows feedback and resets the form on newsletter submit', function () {
      cy.get('#email').type('user@example.com').should('have.value', 'user@example.com');

      // Trigger submit; the script prevents default, shows feedback, and resets the form
      cy.get('#newsletter-form').trigger('submit');

      // Assert feedback is visible via inline style applied by script
      cy.get('#newsletter-feedback').should(($el) => {
        expect($el[0].style.display).to.equal('block');
      });

      // Assert the form was reset (input cleared)
      cy.get('#email').should('have.value', '');
    });

    it('is idempotent across multiple submissions: feedback stays visible and form resets each time', function () {
      cy.get('#email').type('first@ex.com').should('have.value', 'first@ex.com');
      cy.get('#newsletter-form').trigger('submit');
      cy.get('#newsletter-feedback').should(($el) => {
        expect($el[0].style.display).to.equal('block');
      });
      cy.get('#email').should('have.value', '');

      // Submit again with a different value
      cy.get('#email').type('second@ex.com').should('have.value', 'second@ex.com');
      cy.get('#newsletter-form').trigger('submit');
      cy.get('#newsletter-feedback').should(($el) => {
        expect($el[0].style.display).to.equal('block');
      });
      cy.get('#email').should('have.value', '');
    });
  });

  context('edge and failure conditions', function () {
    it('throws an error when toggle button is missing at script initialization', function () {
      cy.visit('about:blank');

      // Expect an error due to toggleBtn being null -> .addEventListener access
      cy.on('uncaught:exception', (err) => {
        expect(err && (err.message || String(err))).to.match(/addEventListener/);
        // Prevent Cypress from failing the test because this exception is expected
        return false;
      });

      cy.document().then((doc) => {
        mountApp(doc, { includeToggle: false });
      });
    });

    it('throws an error when submitting if feedback element is missing', function () {
      cy.visit('about:blank');
      cy.document().then((doc) => {
        mountApp(doc, { includeFeedback: false });
      });

      // The error arises when the submit handler tries to access ...getElementById("newsletter-feedback").style
      cy.on('uncaught:exception', (err) => {
        expect(err && (err.message || String(err))).to.match(/style/);
        return false;
      });

      cy.get('#email').type('missing@feedback.com');
      cy.get('#newsletter-form').trigger('submit');
    });

    it('maintains correct toggle text regardless of initial dark-mode state', function () {
      // Mount and start in normal mode, then manually set dark-mode and verify clicking flips accordingly
      cy.visit('about:blank');
      cy.document().then((doc) => {
        mountApp(doc, {});
        doc.body.classList.add('dark-mode');
        const btn = doc.getElementById('toggle-theme');
        // Ensure text will update on next click
        btn.textContent = '☀️';
      });

      // Clicking should remove dark-mode and set text to moon
      cy.get('#toggle-theme').click();
      cy.get('body').should('not.have.class', 'dark-mode');
      cy.get('#toggle-theme').should('have.text', '🌙');
    });
  });
});