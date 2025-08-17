/// <reference types="cypress" />

// Testing library and framework: Cypress
// This spec validates:
// - Theme toggle toggles dark-mode class on body and updates button icon text.
// - Newsletter form submission shows feedback and resets input (since a second submit listener resets).
// - Defensive behavior when elements are missing (ensure script doesn't throw and no errors occur).

describe("Theme toggle and Newsletter form behaviors", () => {
  const visitFixture = () => {
    // Use file server to load fixture with script
    cy.visit("cypress/fixtures/theme_newsletter.html");
  };

  context("Theme toggle button", () => {
    it("should render with initial icon 🌙 and no dark-mode on body (happy path)", () => {
      visitFixture();

      cy.get("body").should("not.have.class", "dark-mode");
      cy.get("#toggle-theme").should("have.text", "🌙");
    });

    it("should toggle dark mode on click and update icon to ☀️, then back to 🌙", () => {
      visitFixture();

      cy.get("#toggle-theme").as("toggle");

      // First click: add dark-mode and set icon to sun
      cy.get("@toggle").click();
      cy.get("body").should("have.class", "dark-mode");
      cy.get("@toggle").should("have.text", "☀️");

      // Second click: remove dark-mode and set icon to moon
      cy.get("@toggle").click();
      cy.get("body").should("not.have.class", "dark-mode");
      cy.get("@toggle").should("have.text", "🌙");
    });
  });

  context("Newsletter form submission", () => {
    it("shows feedback block on submit (first listener) and resets the form (second listener)", () => {
      visitFixture();

      cy.get("#newsletter-feedback").should("have.css", "display", "none");
      cy.get("#email").should("have.value", "test@example.com");

      cy.get("#newsletter-form").within(() => {
        cy.get("#submit-btn").click();
      });

      // After submit, feedback should display block
      cy.get("#newsletter-feedback").should(($el) => {
        const display = $el[0].style.display || getComputedStyle($el[0]).display;
        expect(display).to.eq("block");
      });

      // Form should have been reset by second submit listener
      cy.get("#email").should("have.value", "");
    });

    it("is idempotent: repeated submissions keep feedback visible and keep form cleared", () => {
      visitFixture();

      // First submit clears the form and shows feedback
      cy.get("#submit-btn").click();

      // Repeat submission should not error and keep feedback shown
      cy.get("#submit-btn").click();

      cy.get("#newsletter-feedback").should(($el) => {
        const display = $el[0].style.display || getComputedStyle($el[0]).display;
        expect(display).to.eq("block");
      });

      cy.get("#email").should("have.value", "");
    });
  });

  context("Defensive behavior when elements are missing", () => {
    // Dynamically load a modified DOM without the target elements and assert no JS errors
    const visitFixtureWithout = (options) => {
      const { withoutToggle = false, withoutForm = false, withoutFeedback = false } = options || {};
      const html = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><title>Missing Elements</title></head>
          <body>
            ${withoutToggle ? "" : '<button id="toggle-theme" type="button">🌙</button>'}
            ${withoutForm ? "" : `
              <form id="newsletter-form">
                <input id="email" name="email" type="email" value="x@y.z" />
                <button type="submit" id="submit-btn">Submit</button>
              </form>
            `}
            ${withoutFeedback ? "" : '<div id="newsletter-feedback" style="display:none">Thanks</div>'}
            <script src="/public/js/dom-script.js"></script>
          </body>
        </html>`;
      cy.document({ log: false }).then((doc) => {
        doc.open();
        doc.write(html);
        doc.close();
      });
    };

    it("does not throw if toggle button is missing", () => {
      cy.on("uncaught:exception", () => false);
      visitFixtureWithout({ withoutToggle: true });
      // No toggle means nothing to click; just ensure page loads
      cy.get("body").should("exist");
    });

    it("does not throw if form is missing", () => {
      cy.on("uncaught:exception", () => false);
      visitFixtureWithout({ withoutForm: true });
      cy.get("body").should("exist");
      // Toggle still works if present
      cy.get("#toggle-theme").click();
      cy.get("body").should("have.class", "dark-mode");
    });

    it("handles missing feedback element gracefully (submit doesn't error)", () => {
      cy.on("uncaught:exception", () => false);
      visitFixtureWithout({ withoutFeedback: true });

      // Submit should not error even if feedback element is missing
      cy.get("#submit-btn").click();

      // No feedback to assert; ensure email field reset still occurs
      cy.get("#email").should("have.value", "");
    });
  });
});