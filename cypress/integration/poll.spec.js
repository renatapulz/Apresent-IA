/// <reference types="cypress" />

/**
 * Test framework: Cypress (E2E)
 * We validate the behavior of the poll UI logic:
 *  - Happy paths for each option
 *  - Edge case: no selection
 *  - Visibility and opacity transitions messaging
 *  - LocalStorage persistence and cumulative counts
 *  - Results rendering and toggling
 * We use a static HTML fixture and load the application logic from public/poll.js.
 */

const fixturePath = 'poll_fixture.html';

// Utility to visit the fixture file directly
function visitFixture() {
  // cy.visit can take a path relative to project root when running via file server;
  // Using fixtures path here. Cypress serves from project root by default in component tests,
  // for e2e we use the fixtures file via relative path:
  cy.visit(`cypress/fixtures/${fixturePath}`);
}

describe('Poll UI behavior', () => {
  beforeEach(() => {
    // Reset localStorage before each test to isolate state
    cy.clearLocalStorage();
    visitFixture();
  });

  it('shows error message when submitting without selection', () => {
    cy.get('#vote-result').should('have.css', 'display', 'none');

    cy.get('#submit-btn').click();

    cy.get('#vote-result')
      .should('be.visible')
      .and('contain.text', 'Por favor, selecione uma opção.');
  });

  it('submits a vote for "Revisão" and persists to localStorage', () => {
    cy.get('#feature-select').select('Revisão');
    cy.get('#submit-btn').click();

    cy.get('#vote-result')
      .should('be.visible')
      .and('contain.text', 'Você votou em: Revisão');

    cy.window().then((w) => {
      const votos = JSON.parse(w.localStorage.getItem('votos') || '{}');
      expect(votos).to.have.property('Revisão', 1);
      expect(votos).to.have.property('Testes', 0);
      expect(votos).to.have.property('Docs', 0);
    });
  });

  it('submits a vote for "Testes" and "Docs", increments cumulatively', () => {
    // First vote: Testes
    cy.get('#feature-select').select('Testes');
    cy.get('#submit-btn').click();

    cy.window().then((w) => {
      let votos = JSON.parse(w.localStorage.getItem('votos') || '{}');
      expect(votos.Testes).to.eq(1);
    });

    // Submit again for Docs
    // After timeout the select is cleared, so we re-select
    cy.wait(2500); // allow the message to auto-hide and select to reset
    cy.get('#feature-select').select('Docs');
    cy.get('#submit-btn').click();

    cy.window().then((w) => {
      const votos = JSON.parse(w.localStorage.getItem('votos') || '{}');
      expect(votos.Testes).to.eq(1);
      expect(votos.Docs).to.eq(1);
      expect(votos.Revisão).to.eq(0);
    });
  });

  it('auto-hides the result message after ~2.3s and clears select', () => {
    cy.get('#feature-select').select('Revisão');
    cy.get('#submit-btn').click();

    cy.get('#vote-result').should('be.visible').and('have.css', 'opacity', '1');

    // after 2s opacity 0, after another 300ms display none and text cleared
    cy.wait(2100);
    cy.get('#vote-result').should('have.css', 'opacity', '0');

    cy.wait(400);
    cy.get('#vote-result').should('have.css', 'display', 'none').and('have.text', '');
    cy.get('#feature-select').should('have.value', '');
  });

  it('renders results and toggles visibility correctly', () => {
    // Seed localStorage so results are non-zero in a predictable way
    cy.window().then((w) => {
      w.localStorage.setItem('votos', JSON.stringify({ Revisão: 2, Testes: 3, Docs: 1 }));
    });

    visitFixture(); // reload so script picks up seeded localStorage

    cy.get('#results').should('have.css', 'display', 'none');

    cy.get('#results-btn').click();
    cy.get('#results')
      .should('have.css', 'display', 'block')
      .and('contain.text', 'Resultados da Enquete:')
      .and('contain.text', 'Revisão de Código: 2')
      .and('contain.text', 'Testes Unitários: 3')
      .and('contain.text', 'Documentação Automática: 1');

    // Toggle off
    cy.get('#results-btn').click();
    cy.get('#results').should('have.css', 'display', 'none');

    // Toggle on again preserves the numbers (no mutation on toggle)
    cy.get('#results-btn').click();
    cy.get('#results')
      .should('have.css', 'display', 'block')
      .and('contain.text', 'Revisão de Código: 2')
      .and('contain.text', 'Testes Unitários: 3')
      .and('contain.text', 'Documentação Automática: 1');
  });

  it('handles unknown choice keys by initializing counts from 0', () => {
    // Simulate a situation where a non-standard value is in the select
    // We add a new option dynamically and vote
    cy.get('#feature-select').then(($select) => {
      const opt = document.createElement('option');
      opt.value = 'OutraCoisa';
      opt.text = 'OutraCoisa';
      $select[0].appendChild(opt);
    });

    cy.get('#feature-select').select('OutraCoisa');
    cy.get('#submit-btn').click();

    cy.window().then((w) => {
      const votos = JSON.parse(w.localStorage.getItem('votos') || '{}');
      expect(votos).to.have.property('OutraCoisa', 1);
    });
  });
});