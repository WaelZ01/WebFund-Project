/* Career Prep Hub - CV Advice page: self-check checklist with Local & Session Storage (ES6) */
document.addEventListener("DOMContentLoaded", () => {
  const boxes = Array.from(document.querySelectorAll(".cv-check"));
  const bar = document.getElementById("cvProgressBar");
  const wrap = document.getElementById("cvProgress");
  const status = document.getElementById("cvStatus");
  const reset = document.getElementById("cvReset");
  if (!boxes.length || !bar) return;

  const STORAGE_KEY = "cph_cv_checklist";

  const saveState = () => {
    try {
      const checkedIds = boxes.filter((b) => b.checked).map((b) => b.id);
      const json = JSON.stringify(checkedIds);
      localStorage.setItem(STORAGE_KEY, json);
      sessionStorage.setItem(STORAGE_KEY, json);
    } catch (e) {}
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const checkedIds = JSON.parse(raw);
      if (Array.isArray(checkedIds)) {
        boxes.forEach((b) => { b.checked = checkedIds.includes(b.id); });
      }
    } catch (e) {}
  };

  const update = (shouldSave = true) => {
    const done = boxes.filter((b) => b.checked).length;
    const pct = Math.round((done / boxes.length) * 100);
    bar.style.width = pct + "%";
    wrap.setAttribute("aria-valuenow", pct);
    status.textContent = done === boxes.length
      ? "All 8 complete (Saved in Local Storage). Your CV looks ready to send!"
      : `${done} of ${boxes.length} complete (Progress saved in Local Storage).`;
    if (shouldSave) saveState();
  };

  boxes.forEach((b) => b.addEventListener("change", () => update(true)));
  reset.addEventListener("click", () => {
    boxes.forEach((b) => { b.checked = false; });
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    update(false);
  });

  loadState();
  update(false);
});
