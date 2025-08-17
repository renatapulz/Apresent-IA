import asyncio
from dotenv import load_dotenv
load_dotenv()
from browser_use import Agent, BrowserSession
from langchain_openai import ChatOpenAI

async def main():
        browser_session = BrowserSession()
        agent = Agent(
            task="""
Teste o código abaixo e corrija os erros. No fim, me entregue o código corrigido em Cypress. 
describe('Demo CodeRabbit Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://demo-coderabbit.netlify.app');
  });

  it('Valida que o vídeo é carregado', () => {
    cy.get('[data-cy="video-element"]')
      .should('be.visible')
      .and($el => {
        expect($el[0].readyState).to.be.greaterThan(2);
      });
  });

  it('Valida que "Saiba mais" direciona para Soluções', () => {
    cy.get('[aria-label="Saiba mais"]').click();
    cy.url().should('include', '/solucoes');
  });

  it('Valida comportamento do select', () => {
    cy.get('[data-cy="feature-preference"]')
      .select('Geração de Testes Unitários')
      .should('have.value', 'unit-test-generation');
  });

  it('Valida newsletter sem email', () => {
    cy.get('[data-cy="newsletter-subscription"]').click();
    cy.contains('Por favor, insira um email.').should('be.visible');
  });

  it('Valida newsletter com email inválido', () => {
  cy.get('input[type="email"]').type('teste@dominio_invalido');
  cy.get('#newsletter-form > .btn').click();
  cy.get('input[type="email"]')
    .invoke('prop', 'validationMessage')
    .should('contain', 'A parte depois de '@' não deve conter o símbolo '_'.');
  });

  it('Valida newsletter com email válido', () => {
    cy.get('input[type="email"]').type('valido@teste.com');
    cy.get('[data-cy="newsletter-subscription"]').click();
    cy.contains('Inscrição realizada com sucesso!').should('be.visible');
  });

  it('Valida tema claro/escuro e persistência', () => {
    cy.get('[aria-label="Alternar tema"]').click();
    cy.get('body').should('have.class', 'dark-mode');
    cy.reload();
    cy.get('body').should('have.class', 'dark-mode');
  });
});
""",
            llm=ChatOpenAI(model="gpt-4o"),
            browser_session=browser_session,
        )
        await agent.run()

asyncio.run(main())