/* ---------------------------------------------------
   ui.js – UI Steuerung + Form-Füllung + History Save
--------------------------------------------------- */

/* --- Dark Mode --- */
function initDarkMode() {
  const saved = localStorage.getItem("darkmode");
  if (saved === "true") document.body.classList.add("dark-mode");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkmode",
    document.body.classList.contains("dark-mode")
  );
}

/* --- Navigation highlighten --- */
function setActiveNav() {
  const path = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === path) {
      a.classList.add("active");
    }
  });
}

/* --- Ergebnis anzeigen --- */
function displayResult(result) {
  const box = document.getElementById("result");
  if (!box) return;

  box.innerHTML = `
      <h3>Berechnungsergebnis</h3>
      <p><b>Norm:</b> ${result.norm}</p>
      <p><b>Druck:</b> ${result.p} bar</p>
      <p><b>Temperatur:</b> ${result.T} °C</p>
      <p><b>Durchsatz:</b> ${result.Q}</p>
      <p><b>Medium:</b> ${result.medium}</p>
      <hr>
      <p><b>Benötigte Fläche:</b> ${result.area_in2.toFixed(4)} in²</p>
      <p><b>Orifice:</b> ${result.orifice}</p>
  `;

  // Sofort verfügbar
  window.lastCalc = result;

  // Persistent speichern
  localStorage.setItem("lastCalc", JSON.stringify(result));

  // History speichern
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  history.push({ ...result, timestamp: new Date().toLocaleString() });
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

/* --- Berechnung ausführen --- */
function runCalculation() {
  const norm = document.getElementById("norm").value;
  const p = parseFloat(document.getElementById("pressure").value);
  const T = parseFloat(document.getElementById("temperature").value);
  const Q = parseFloat(document.getElementById("flow").value);
  const medium = document.getElementById("medium").value;

  if (isNaN(p) || isNaN(T) || isNaN(Q)) {
    alert("Bitte Felder korrekt ausfüllen.");
    return;
  }

  const result = window.computeSafetyValve(norm, p, T, Q, medium);
  displayResult(result);
}

/* --- Formular automatisch aus localStorage füllen --- */
function restoreFormFromLastCalc() {
  const saved = localStorage.getItem("lastCalc");
  if (!saved) return;

  const c = JSON.parse(saved);

  document.getElementById("norm").value = c.norm;
  document.getElementById("pressure").value = c.p;
  document.getElementById("temperature").value = c.T;
  document.getElementById("flow").value = c.Q;
  document.getElementById("medium").value = c.medium;

  const result = window.computeSafetyValve(c.norm, c.p, c.T, c.Q, c.medium);
  displayResult(result);

  window.lastCalc = result;
}

/* --- Initialisierung --- */
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  setActiveNav();
  restoreFormFromLastCalc();

  const nav = document.querySelector(".navbar");
  if (nav) {
    const btn = document.createElement("button");
    btn.className = "dark-toggle";
    btn.innerText = "Dark Mode";
    btn.onclick = toggleDarkMode;
    nav.appendChild(btn);
  }

  const calcBtn = document.querySelector(".calc-button");
  if (calcBtn) calcBtn.addEventListener("click", runCalculation);
});
