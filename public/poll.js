// Recupera votos do localStorage ou inicia zerado
let votos = JSON.parse(localStorage.getItem("votos")) || {
  Revisão: 0,
  Testes: 0,
  Docs: 0,
};

const select = document.getElementById("feature-select");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("vote-result");
const resultsDiv = document.getElementById("results");
const resultsBtn = document.getElementById("results-btn");

// Submeter voto
submitBtn.addEventListener("click", () => {
  const choice = select.value;

  if (choice) {
    votos[choice] = (votos[choice] || 0) + 1;
    localStorage.setItem("votos", JSON.stringify(votos));
    result.textContent = `Você votou em: ${choice}`;
  } else {
    result.textContent = "Por favor, selecione uma opção.";
  }

  result.style.display = "block";
  result.style.opacity = "1";

  setTimeout(() => {
    result.style.opacity = "0";
    setTimeout(() => {
      result.style.display = "none";
      result.textContent = "";
      select.value = "";
    }, 300);
  }, 2000);
});

// Ver resultados
resultsBtn.addEventListener("click", () => {
  resultsDiv.innerHTML = `
    <h3>Resultados da Enquete:</h3>
    <ul>
      <li>Revisão de Código: ${votos["Revisão"]}</li>
      <li>Testes Unitários: ${votos["Testes"]}</li>
      <li>Documentação Automática: ${votos["Docs"]}</li>
    </ul>
  `;
  resultsDiv.style.display =
    resultsDiv.style.display === "none" ? "block" : "none";
});

// Expose for tests (optional)
window.__poll__ = {
  get votos(){ return votos; },
  set votos(v){ votos = v; localStorage.setItem("votos", JSON.stringify(v)); },
};