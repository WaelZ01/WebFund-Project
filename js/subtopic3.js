/* Career Prep Hub - Interview page: STAR builder and practice questions (ES6) */
document.addEventListener("DOMContentLoaded", () => {
  // ---------- STAR answer builder ----------
  const inputs = Array.from(document.querySelectorAll(".star-input"));
  const preview = document.getElementById("starPreview");
  const count = document.getElementById("starCount");
  const copyBtn = document.getElementById("starCopy");
  const clearBtn = document.getElementById("starClear");
  const msg = document.getElementById("starMsg");
  const placeholder = "Start typing above to see your answer here.";

  const buildAnswer = () =>
    inputs.map((i) => i.value.trim()).filter(Boolean).join(" ");

  const updateStar = () => {
    const text = buildAnswer();
    const words = text ? text.split(/\s+/).length : 0;
    preview.textContent = text || placeholder;
    count.textContent = `${words} word${words === 1 ? "" : "s"}. Aim for roughly 150 to 250 words, about one to two minutes when spoken.`;
    msg.textContent = "";
  };

  if (inputs.length) {
    inputs.forEach((i) => i.addEventListener("input", updateStar));

    clearBtn.addEventListener("click", () => {
      inputs.forEach((i) => { i.value = ""; });
      updateStar();
    });

    copyBtn.addEventListener("click", async () => {
      const text = buildAnswer();
      if (!text) { msg.textContent = "Write something first."; return; }
      try {
        await navigator.clipboard.writeText(text);
        msg.textContent = "Copied!";
      } catch (e) {
        msg.textContent = "Copy is not available. Please select the text and copy it.";
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
