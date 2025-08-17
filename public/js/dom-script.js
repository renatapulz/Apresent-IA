(function () {
  // Defensive: in case DOM is not ready, execute after DOMContentLoaded
  const init = function () {
    const body = document.body;
    const toggleBtn = document.getElementById("toggle-theme");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
          toggleBtn.textContent = "☀️";
        } else {
          toggleBtn.textContent = "🌙";
        }
      });
    }

    const form = document.getElementById("newsletter-form");
    if (form) {
      const onSubmit = (e) => {
        e.preventDefault();
        const feedback = document.getElementById("newsletter-feedback");
        if (feedback) {
          feedback.style.display = "block";
        }
        // Reset the form when the second listener runs (as in the snippet)
        // The original snippet registers two submit listeners that both preventDefault
        // and set feedback display; the second also resets the target.
      };

      const onSubmitWithReset = (e) => {
        e.preventDefault();
        const feedback = document.getElementById("newsletter-feedback");
        if (feedback) {
          feedback.style.display = "block";
        }
        if (e && e.target && typeof e.target.reset === "function") {
          e.target.reset();
        }
      };

      form.addEventListener("submit", onSubmit);
      form.addEventListener("submit", onSubmitWithReset);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();