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

document.getElementById("submit-btn").addEventListener("click", () => {
    const select = document.getElementById("feature-select");
    const choice = select.value;
    const result = document.getElementById("vote-result");
  
    if (choice) {
      result.textContent = `Você escolheu: ${choice}`;
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

document.getElementById("newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletter-feedback").style.display = "block";
});

document.getElementById("newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletter-feedback").style.display = "block";
    e.target.reset();
});