# IA e Possibilidades com CodeRabbit 🚀

Demo interativa para explorar o **CodeRabbit**, uma IA de revisão e validação de código. O projeto também integra outras IAs para testar funcionalidades, automatizar tarefas e enriquecer a aplicação.

---

## Objetivo

Testar ferramentas de IA em um fluxo de desenvolvimento:

- **CodeRabbit** – Principal: revisa e valida código, sugere melhorias, documentação técnica e testes unitários.  
- **Browser-Use** – Geração automática de testes E2E em Cypress, com suporte da OpenAI.  
- **ChatGPT** – Auxílio na criação da aplicação, dúvidas e elaboração de casos de teste "pegadinhas" para o CodeRabbit.

---

## Status do Projeto

[![CI/CD](https://img.shields.io/github/actions/workflow/status/renatapulz/Apresent-IA/cypress.yml?branch=main&style=flat-square)](https://img.shields.io/github/actions/workflow/status/<USUARIO>/<REPO>/cypress.yml?branch=main&style=flat-square)
[![Deploy](https://img.shields.io/badge/Netlify-Deploy-blue?style=flat-square)](https://demo-coderabbit.netlify.app)
![Cypress Tests](https://img.shields.io/badge/Cypress-E2E-green?style=flat-square)
![Jest Tests](https://img.shields.io/badge/Jest-Unit-blue?style=flat-square)

---

## Funcionalidades estudadas

- Revisão de código e pull requests com CodeRabbit (sugestão de testes unitários, validação de esquemas, chat no PR, documentação técnica).  
- Automação prática com Browser-Use: execução de testes via comandos de linguagem natural (detalhes e setup em [browseruse-ia-automation](https://github.com/renatapulz/browseruse-ia-automation)).  
- Implementação de **CI/CD** com testes automatizados e deploy.

---

## Como rodar localmente

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor local:

```bash
npm start
```

3. Abra no navegador: http://localhost:3000

## Testes
 - E2E (Cypress):

```bash
npm test
# ou
npm run cypress:open
```
 - Unitários (Jest):
```bash
npm run unit
```

## Automação de Browser-Use
Script no browser-use/main.py usam IA (via LangChain) para gerar e corrigir testes Cypress automaticamente.

## CI/CD
Testes e deploy automatizados via GitHub Actions a cada push na branch principal.

## Deploy
Deploy automático no Netlify após atualizações na branch principal.

## Minhas impressões sobre a versão free (14 dias):

- **Facilita muito o dia a dia:** traz resumos claros e valiosos sobre o código.  
- **Diagramas explicativos:** ajudam pessoas sem conhecimento prévio a entender a lógica e a estrutura do projeto.  
- **Validação de segurança:** identificou pontos importantes como `rel="noopener noreferrer"`, inspeção da árvore do DOM e cuidados ao salvar dados no `localStorage`.  
- **Correções automáticas úteis:** sugeriu mudanças como uso correto de `async` dentro de loops (`forEach`), e implementou respostas de fallback para usuários quando APIs não respondem.  
- **Boas práticas de UX:** cuidou do retorno ao usuário, mostrando mensagens de erro ou fallback de forma adequada.  
- **Limitações:** não cobriu ajustes no dark mode ou responsividade, mas validou itens de segurança e problemas claros e críticos.  

⚠️ Apesar do suporte, o **CodeRabbit não substitui a validação humana**, mas adianta bastante o dia a dia de desenvolvedores, especialmente ao validar código **antes mesmo de subir um PR**.  

Estudar e aplicar a ferramenta foi uma experiência muito bacana! Mesmo sendo apenas uma demo, me permitiu explorar conceitos que até então não tinha tido oportunidade de praticar, como testes unitários com Jest.

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/63ca4f07-0470-425f-93d0-6ddaf17129b3" alt="Captura de Tela" width="700" style="box-shadow: 4px 4px 10px rgba(0,0,0,0.3);" />
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/640e3725-c177-45f5-94bb-7b6a0cd72fc0" alt="Captura de Tela" width="700" style="box-shadow: 4px 4px 10px rgba(0,0,0,0.3);" />
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/e15f5aa0-44bd-47e0-aa5a-56fcc28f4cb6" alt="Captura de Tela" width="700" style="box-shadow: 4px 4px 10px rgba(0,0,0,0.3);" />
</div>


## Créditos
Desenvolvido por Renata Pulz.
