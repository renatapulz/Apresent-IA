describe('Demo CodeRabbit Test Suite', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Valida que o vídeo é carregado', () => {
        cy.get('video')
            .scrollIntoView()
            .should('be.visible')
            .and($el => {
                expect($el[0].readyState).to.be.greaterThan(2);
            });
    });

    it('Valida que "Saiba mais" direciona para Soluções', () => {
        cy.contains('a', 'Saiba mais').click();
        cy.get('#solucoes')
            .should('be.visible')
            .and('contain.text', 'Soluções');
    });

    it('Valida comportamento do select e submissão', () => {
        cy.get('#feature-select')
            .select('Testes Unitários')
            .should('have.value', 'Testes');
        cy.get('#submit-btn').click();
        cy.get('#vote-result')
            .should('be.visible')
            .and('contain.text', 'Você escolheu: Testes');
    });

    it('Valida que o campo email é obrigatório', () => {
        cy.get('#newsletter-form').find('button[type="submit"]').click();
        cy.get('input[type="email"]').then(($input) => {
            expect($input[0].checkValidity()).to.be.false;
            expect($input[0].validity.valueMissing).to.be.true;
        });
    });


    it('Valida newsletter com email inválido', () => {
        cy.get('input[type="email"]').type('teste@dominio_invalido');
        cy.get('#newsletter-form').find('button[type="submit"]').click();
        cy.get('input[type="email"]')
            .invoke('prop', 'validity')
            .its('typeMismatch')
            .should('be.true');
    });

    it('Valida newsletter com email válido', () => {
        cy.get('input[type="email"]').type('valido@teste.com');
        cy.contains('button', 'Inscreva se').click();
        cy.contains('Inscrição realizada com sucesso!').should('be.visible');
    });

    it('Valida alternância do tema claro/escuro', () => {
        cy.get('#toggle-theme').click();
        cy.get('body').should('have.class', 'dark-mode');
        cy.get('#toggle-theme').click();
        cy.get('body').should('not.have.class', 'dark-mode');
    });
});