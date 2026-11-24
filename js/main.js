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

    // Auto-start educational carousel on home page
    const carouselEl = document.getElementById("careerCarousel");
    if (carouselEl && typeof bootstrap !== "undefined" && bootstrap.Carousel) {
      const carousel = new bootstrap.Carousel(carouselEl, {
        interval: 3500,
        ride: "carousel",
        pause: false,
        wrap: true
      });
      carousel.cycle();
    }

    // Registration form (home page only)
    const form = document.getElementById("registerForm");
    if (!form) return;

    const fields = Object.keys(validators).map((name) => document.getElementById(name));
    const successBox = document.getElementById("formSuccess");
    const errorBox = document.getElementById("formError");
    const savedPanel = document.getElementById("savedRegistrationPanel");
    const tableBody = document.getElementById("registrationsTableBody");
    const loadSavedBtn = document.getElementById("loadSavedBtn");
    const clearSavedBtn = document.getElementById("clearSavedBtn");
    const STORAGE_KEY = "cph_registrations";

    // Retrieve stored registrations from localStorage / sessionStorage
    const getStoredRegistrations = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        // Fallback if individual keys were stored
        const fn = localStorage.getItem("firstName") || sessionStorage.getItem("firstName");
        const ln = localStorage.getItem("lastName") || sessionStorage.getItem("lastName");
        const mb = localStorage.getItem("mobile") || sessionStorage.getItem("mobile");
        const em = localStorage.getItem("email") || sessionStorage.getItem("email");
        const dt = localStorage.getItem("registeredAt") || sessionStorage.getItem("registeredAt") || "Saved";
        if (fn && ln && mb && em) {
          return [{ firstName: fn, lastName: ln, mobile: mb, email: em, timestamp: dt }];
        }
      } catch (e) {}
      return [];
    };

    // Render stored registrations in the display table
    const renderStoredRegistrations = () => {
      if (!savedPanel || !tableBody) return;
      const list = getStoredRegistrations();
      tableBody.innerHTML = "";
      if (!list.length) {
        savedPanel.classList.add("d-none");
        return;
      }
      list.forEach((entry) => {
        const tr = document.createElement("tr");
        ["firstName", "lastName", "mobile", "email", "timestamp"].forEach((key) => {
          const td = document.createElement("td");
          td.textContent = entry[key] || "";
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
      savedPanel.classList.remove("d-none");
    };

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

    // Save valid submission to both localStorage and sessionStorage and display it
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      successBox.classList.add("d-none");
      errorBox.classList.add("d-none");

      const results = fields.map(checkField);
      if (results.every(Boolean)) {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const timestamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

        const newRecord = { firstName, lastName, mobile, email, timestamp };

        try {
          // Store individual keys (Unit 4 localStorage / sessionStorage format)
          localStorage.setItem("firstName", firstName);
          localStorage.setItem("lastName", lastName);
          localStorage.setItem("mobile", mobile);
          localStorage.setItem("email", email);
          localStorage.setItem("registeredAt", timestamp);

          sessionStorage.setItem("firstName", firstName);
          sessionStorage.setItem("lastName", lastName);
          sessionStorage.setItem("mobile", mobile);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("registeredAt", timestamp);

          // Also store complete list as JSON
          const list = getStoredRegistrations();
          list.unshift(newRecord);
          const jsonText = JSON.stringify(list);
          localStorage.setItem(STORAGE_KEY, jsonText);
          sessionStorage.setItem(STORAGE_KEY, jsonText);
        } catch (e) {}

        renderStoredRegistrations();

        successBox.textContent =
          `Thank you, ${firstName} ${lastName}! Your registration was saved to Local Storage & Session Storage and is displayed below (${timestamp}).`;
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

    // Show Saved User button: populates form inputs from localStorage / sessionStorage
    if (loadSavedBtn) {
      loadSavedBtn.addEventListener("click", () => {
        const list = getStoredRegistrations();
        if (!list.length) {
          errorBox.textContent = "No saved registration found in Local Storage or Session Storage yet.";
          errorBox.classList.remove("d-none");
          successBox.classList.add("d-none");
          return;
        }
        const latest = list[0];
        document.getElementById("firstName").value = latest.firstName || "";
        document.getElementById("lastName").value = latest.lastName || "";
        document.getElementById("mobile").value = latest.mobile || "";
        document.getElementById("email").value = latest.email || "";
        fields.forEach(checkField);
        errorBox.classList.add("d-none");
        successBox.textContent = `Loaded saved details for ${latest.firstName} ${latest.lastName} from Local Storage.`;
        successBox.classList.remove("d-none");
        renderStoredRegistrations();
      });
    }

    // Clear Stored Data button: removes registration data from localStorage & sessionStorage
    if (clearSavedBtn) {
      clearSavedBtn.addEventListener("click", () => {
        try {
          ["firstName", "lastName", "mobile", "email", "registeredAt", STORAGE_KEY].forEach((k) => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
          });
        } catch (e) {}
        form.reset();
        fields.forEach((f) => {
          f.classList.remove("is-valid", "is-invalid");
          f.removeAttribute("aria-invalid");
        });
        renderStoredRegistrations();
        errorBox.classList.add("d-none");
        successBox.textContent = "Stored registration data has been cleared from Local Storage and Session Storage.";
        successBox.classList.remove("d-none");
      });
    }

    // Automatically display any stored registrations on page load
    renderStoredRegistrations();
  });
}
