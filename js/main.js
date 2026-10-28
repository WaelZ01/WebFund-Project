/* Career Prep Hub - shared JavaScript (ES6) */

// Pure validation functions (kept separate so they can be tested without a browser)
const validators = {
  firstName: (v) => v.trim().length >= 3
    ? "" : "First name must be at least 3 characters.",
  lastName: (v) => v.trim().length >= 3
    ? "" : "Last name must be at least 3 characters.",
  mobile: (v) => /^\d{8}$/.test(v.trim())
    ? "" : "Mobile number must be exactly 8 digits (numbers only, no spaces).",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
    ? "" : "Please enter a valid email address, e.g. name@example.com."
};

if (typeof module !== "undefined") {
  module.exports = { validators };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    document.querySelectorAll(".js-year").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    // Registration form (home page only)
    const form = document.getElementById("registerForm");
    if (!form) return;

    const fields = Object.keys(validators).map((name) => document.getElementById(name));
    const successBox = document.getElementById("formSuccess");
    const errorBox = document.getElementById("formError");

    const checkField = (input) => {
      const message = validators[input.id](input.value);
      const feedback = document.getElementById(input.id + "Error");
      input.classList.toggle("is-invalid", message !== "");
      input.classList.toggle("is-valid", message === "");
      input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
      feedback.textContent = message;
      return message === "";
    };

    // Keep mobile field digits-only before running live validation
    const mobileInput = document.getElementById("mobile");
    if (mobileInput) {
      mobileInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
    }

    // Live feedback once a field has been touched
    fields.forEach((input) => {
      input.addEventListener("blur", () => checkField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
          checkField(input);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      successBox.classList.add("d-none");
      errorBox.classList.add("d-none");

      const results = fields.map(checkField);
      if (results.every(Boolean)) {
        const name = document.getElementById("firstName").value.trim();
        successBox.textContent =
          `Thank you, ${name}! Your registration was received. (Demo only: no data is stored or sent.)`;
        successBox.classList.remove("d-none");
        form.reset();
        fields.forEach((f) => {
          f.classList.remove("is-valid", "is-invalid");
          f.removeAttribute("aria-invalid");
        });
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        errorBox.textContent = "Please fix the highlighted fields and try again.";
        errorBox.classList.remove("d-none");
        const firstBad = fields.find((f) => f.classList.contains("is-invalid"));
        if (firstBad) firstBad.focus();
      }
    });
  });
}
