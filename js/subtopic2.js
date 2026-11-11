/* Career Prep Hub - CV Advice page: self-check checklist (ES6) */
document.addEventListener("DOMContentLoaded", () => {
  const boxes = Array.from(document.querySelectorAll(".cv-check"));
  const bar = document.getElementById("cvProgressBar");
  const wrap = document.getElementById("cvProgress");
  const status = document.getElementById("cvStatus");
  const reset = document.getElementById("cvReset");
  if (!boxes.length || !bar) return;

  const update = () => {
    const done = boxes.filter((b) => b.checked).length;
    const pct = Math.round((done / boxes.length) * 100);
    bar.style.width = pct + "%";
    wrap.setAttribute("aria-valuenow", pct);
    status.textContent = done === boxes.length
      ? "All 8 complete. Your CV looks ready to send!"
      : `${done} of ${boxes.length} complete.`;
  };

  boxes.forEach((b) => b.addEventListener("change", update));
  reset.addEventListener("click", () => {
    boxes.forEach((b) => { b.checked = false; });
    update();
  });
  update();
});
