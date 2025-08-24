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