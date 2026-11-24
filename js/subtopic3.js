/* Career Prep Hub - Interview page: STAR builder & practice questions with Local/Session Storage (ES6) */
document.addEventListener("DOMContentLoaded", () => {
  // ---------- STAR answer builder ----------
  const inputs = Array.from(document.querySelectorAll(".star-input"));
  const preview = document.getElementById("starPreview");
  const count = document.getElementById("starCount");
  const copyBtn = document.getElementById("starCopy");
  const clearBtn = document.getElementById("starClear");
  const msg = document.getElementById("starMsg");
  const placeholder = "Start typing above to see your answer here.";
  const STAR_KEY = "cph_star_answer";

  const buildAnswer = () =>
    inputs.map((i) => i.value.trim()).filter(Boolean).join(" ");

  const saveStar = () => {
    try {
      const data = {};
      inputs.forEach((i) => { data[i.id] = i.value; });
      const json = JSON.stringify(data);
      localStorage.setItem(STAR_KEY, json);
      sessionStorage.setItem(STAR_KEY, json);
    } catch (e) {}
  };

  const loadStar = () => {
    try {
      const raw = localStorage.getItem(STAR_KEY) || sessionStorage.getItem(STAR_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        inputs.forEach((i) => {
          if (typeof data[i.id] === "string") i.value = data[i.id];
        });
      }
    } catch (e) {}
  };

  const updateStar = (shouldSave = true) => {
    const text = buildAnswer();
    const words = text ? text.split(/\s+/).length : 0;
    preview.textContent = text || placeholder;
    count.textContent = `${words} word${words === 1 ? "" : "s"} (Saved in Local Storage). Aim for roughly 150 to 250 words, about one to two minutes when spoken.`;
    msg.textContent = "";
    if (shouldSave) saveStar();
  };

  if (inputs.length) {
    loadStar();
    updateStar(false);

    inputs.forEach((i) => i.addEventListener("input", () => updateStar(true)));

    clearBtn.addEventListener("click", () => {
      inputs.forEach((i) => { i.value = ""; });
      try {
        localStorage.removeItem(STAR_KEY);
        sessionStorage.removeItem(STAR_KEY);
      } catch (e) {}
      updateStar(false);
      msg.textContent = "Cleared from Local Storage.";
    });

    copyBtn.addEventListener("click", async () => {
      const text = buildAnswer();
      if (!text) { msg.textContent = "Write something first."; return; }
      saveStar();
      try {
        await navigator.clipboard.writeText(text);
        msg.textContent = "Saved & copied!";
      } catch (e) {
        msg.textContent = "Saved to Local Storage! Select the text to copy it.";
      }
    });
  }

  // ---------- Practice question generator ----------
  const questions = [
    { q: "Tell me about yourself.", tip: "Give a short summary: your studies, one or two relevant projects and why you want this role. Aim for about a minute." },
    { q: "Why do you want to work for us?", tip: "Mention something specific you learned about the organisation, then link it to your own interests and skills." },
    { q: "Tell me about a time you worked in a team.", tip: "Use STAR. Make clear what your own role was, and how you handled any disagreement or difficulty." },
    { q: "Describe a technical problem you could not solve straight away.", tip: "Show your process: how you investigated, what you tried, who you asked and what you learned." },
    { q: "Tell me about a mistake you made and what you did about it.", tip: "Choose a real but modest mistake. Spend most of the answer on how you fixed it and what you changed afterwards." },
    { q: "How do you keep your technical skills up to date?", tip: "Give real examples such as labs at home, online courses, reading security news or competitions." },
    { q: "Explain a technical topic to someone who is not technical.", tip: "Use plain words and an everyday comparison. Check that the listener follows you." },
    { q: "How do you handle a deadline when you have several tasks?", tip: "Describe how you prioritise, communicate early if there is a risk and ask for help when needed." },
    { q: "Where do you see yourself in a few years?", tip: "Be honest and positive: the skills you want to build, and how this role helps you build them." }
  ];

  const qEl = document.getElementById("practiceQ");
  const tipEl = document.getElementById("practiceTip");
  const newBtn = document.getElementById("practiceNew");
  const revealBtn = document.getElementById("practiceReveal");
  let current = -1;

  if (qEl && newBtn) {
    newBtn.addEventListener("click", () => {
      let next;
      do { next = Math.floor(Math.random() * questions.length); }
      while (next === current && questions.length > 1);
      current = next;
      qEl.textContent = questions[current].q;
      tipEl.textContent = "Tip: " + questions[current].tip;
      tipEl.classList.add("d-none");
      revealBtn.disabled = false;
      newBtn.textContent = "Next question";
    });

    revealBtn.addEventListener("click", () => {
      tipEl.classList.remove("d-none");
    });
  }
});
