/**
 * E2E/UI tests for index page.
 * Framework: Cypress (Mocha + Chai)
 * Focus: Validate key UI behaviors and elements based on PR diff contents.
 * Notes:
 * - Tests assume the app serves index.html at root ("/") or configured baseUrl.
 * - Where duplicate IDs exist (e.g., #vote-result appears twice), tests target the first instance to be resilient.
 */

describe('Index page - IA e Possibilidades com CodeRabbit', () => {
  // Utility to visit home respecting baseUrl if configured
  const visitHome = () => {
    // If baseUrl is set in Cypress config, cy.visit('/') will work.
    // Otherwise, try to open the local static index.html relative path if present.
    try {
      cy.visit('/');
    } catch (e) {
      // Fall back to index.html if needed
      cy.visit('index.html');
    }
  };

  beforeEach(() => {
    visitHome();
  });

  it('renders critical hero section and key elements', () => {
    cy.title().should('match', /CodeRabbit/i);
    cy.get('header.hero').should('exist').and('be.visible');

    cy.get('video.background-video').should('have.attr', 'autoplay');
    cy.get('video.background-video').should('have.attr', 'muted');
    cy.get('video.background-video').should('have.attr', 'loop');
    cy.get('video.background-video source').should('have.length.at.least', 1);

    cy.contains('h1', /Futuro da Revisão de Código/i).should('be.visible');
    cy.contains('a.btn', /Saiba mais/i)
      .should('have.attr', 'href', '#solucoes')
      .click({ force: true });
    cy.location('hash').should('eq', '#solucoes');
    cy.get('#solucoes').should('be.visible');
  });

  it('has a theme toggle button with proper aria-label and toggles a class on body', () => {
    // Validate element presence and accessibility label
    cy.get('button#toggle-theme')
      .should('exist')
      .and('have.attr', 'aria-label')
      .and('match', /Alternar tema/i);

    // Snapshot body class before
    cy.get('body')
      .then(($bodyBefore) => $bodyBefore.attr('class') || '')
      .then((initialClass) => {
        cy.get('#toggle-theme').click({ force: true });
        // Expect body to have some class change. We check that class attribute changed or a common "dark" token appears.
        cy.get('body').invoke('attr', 'class').then(afterClass => {
          const changed = (initialClass || '') !== (afterClass || '');
          const containsDark = (afterClass || '').includes('dark');
          expect(changed || containsDark, 'body class should change or include "dark" after toggle').to.eq(true);
        });

        // Toggle back
        cy.get('#toggle-theme').click({ force: true });
        cy.get('body').invoke('attr', 'class').then(afterSecondToggle => {
          const backToStart = (initialClass || '') === (afterSecondToggle || '');
          expect(backToStart, 'second toggle should revert class or state').to.eq(true);
        });
      });
  });

  it('renders "Soluções" cards with expected headings', () => {
    cy.get('#solucoes').within(() => {
      cy.contains('h2', /^Soluções$/).should('be.visible');
      const expectedCards = [
        'Revisão de Pull Requests',
        'Geração de Testes Unitários',
        'Documentação Automática',
        'Sugestões de Refatoração',
      ];
      expectedCards.forEach((title) => {
        cy.contains('.card h3', new RegExp(title, 'i')).should('be.visible');
      });
    });
  });

  it('feature select and submit validation - prevents submit when no option selected', () => {
    // There is a required select; clicking Enviar without selection should not proceed.
    cy.get('#feature-select').should('have.attr', 'required');
    cy.get('#submit-btn').click({ force: true });

    // When HTML5 validation is active, the browser may prevent form submit.
    // We assert select is still in invalid state.
    cy.get('#feature-select').then($select => {
      // checkValidity() is not directly exposed; infer by property 'validationMessage' or 'required' plus value
      expect($select.val(), 'no selection should keep value empty').to.satisfy(v => v === '' || v === null);
    });
  });

  it('allows voting when an option is selected and shows a vote result message', () => {
    cy.get('#feature-select').select('Revisão', { force: true });
    cy.get('#submit-btn').click({ force: true });

    // There are duplicate #vote-result IDs in markup; select the first occurrence to avoid ambiguity
    cy.get('#vote-result').first().should('exist').and(($p) => {
      // After voting, it should become visible or have content updated by js/poll.js
      const display = $p.css('display');
      const hasText = ($p.text() || '').trim().length > 0;
      expect(display === 'block' || hasText, 'vote result should be visible or contain a message').to.eq(true);
    });
  });

  it('shows results when clicking "Ver Resultados"', () => {
    cy.get('#results-btn').click({ force: true });
    cy.get('#results').should('exist').and(($div) => {
      const isVisible = $div.css('display') !== 'none';
      expect(isVisible, '#results should be shown after clicking "Ver Resultados"').to.eq(true);
    });
  });

  it('newsletter form requires valid email and shows success feedback upon submission', () => {
    // Attempt submit without email -> expect validation to prevent submission
    cy.get('#newsletter-form').within(() => {
      cy.get('input[type="email"]').as('email');
      cy.get('button[type="submit"]').as('submit');
      cy.get('@email').should('have.attr', 'required');
      cy.get('@submit').click({ force: true });
    });

    // Provide invalid email then submit
    cy.get('#newsletter-form input[type="email"]').clear().type('invalid-email', { delay: 0 });
    cy.get('#newsletter-form button[type="submit"]').click({ force: true });
    // HTML5 validation usually prevents submission for invalid emails
    cy.get('#newsletter-form input[type="email"]').then($email => {
      const validity = $email[0].checkValidity ? $email[0].checkValidity() : false;
      expect(validity, 'invalid email should not pass validation').to.eq(false);
    });

    // Provide valid email then submit and expect feedback message becomes visible
    cy.get('#newsletter-form input[type="email"]').clear().type('user@example.com', { delay: 0 });
    cy.get('#newsletter-form button[type="submit"]').click({ force: true });

    cy.get('#newsletter-feedback').should('exist').and(($p) => {
      const style = $p.css('display');
      expect(style !== 'none', 'newsletter success feedback should be visible').to.eq(true);
      expect(($p.text() || '').toLowerCase()).to.include('sucesso');
    });
  });

  it('testimonials section renders three blockquotes', () => {
    cy.get('#testimonials').within(() => {
      cy.contains('h2', /O que dizem nossos clientes/i).should('be.visible');
      cy.get('.testimonial-grid blockquote').should('have.length.at.least', 3);
      cy.contains('blockquote', /CodeRabbit/i).should('exist');
    });
  });

  it('footer renders author credit and current year-like text', () => {
    cy.get('footer').should('exist').within(() => {
      cy.contains(/IA e Possibilidades/i).should('be.visible');
      cy.contains(/Renata Pulz/i).should('be.visible');
      // Basic year assertion: contains a number like 2024/2025
      cy.contains(/\b20\d{2}\b/).should('exist');
    });
  });

  context('Robustness checks and accessibility hints', () => {
    it('has a unique or first-usable vote result node despite duplicate IDs', () => {
      cy.document().then(doc => {
        const all = doc.querySelectorAll('#vote-result');
        expect(all.length).to.be.gte(1);
        // Prefer first
        const firstText = (all[0].textContent || '').trim();
        // Accept empty text initially; main assertion is that at least one exists
        expect(all[0]).to.exist;
      });
    });

    it('select has a disabled default option', () => {
      cy.get('#feature-select').find('option[disabled][selected]').should('exist');
    });
  });
});