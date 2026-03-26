/* ---------------------------------------------------
   ui.js – Version 2.0.1
   Navigation, Dark-Mode, Berechnung, History
--------------------------------------------------- */

/* ---------------------------------------
   DARK MODE: speichern + laden
---------------------------------------- */
function initDarkMode() {
  const saved = localStorage.getItem("darkmode");
  if (saved === "true") {
    document.body.classList.add("dark-mode");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkmode",
    document.body.classList.contains("dark-mode")
  );
}

/* ---------------------------------------
   NAVIGATION ACTIVE-HIGHLIGHT
---------------------------------------- */
function setActiveNav() {
  const path = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) {
      a.classList.add("active");
    }
  });
}

/* ---------------------------------------
   FORMULAR: ERGEBNIS ANZEIGEN
---------------------------------------- */
function displayResult(result) {
  const box = document.getElementById("result");
  if (!box) return;

  let html = `
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

  box.innerHTML = html;

  // Session-Speicher (sofort verfügbar)
  window.lastCalc = result;

  // Persistenter Speicher (Seitenübergreifend)
  localStorage.setItem("lastCalc", JSON.stringify(result));
}

/* ---------------------------------------
   HISTORY SPEICHERN
---------------------------------------- */
function saveHistory(result) {
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");

  history.push({
    ...result,
    timestamp: new Date().toLocaleString()
  });

  localStorage.setItem("calcHistory", JSON.stringify(history));
}

/* ---------------------------------------
   FORMULAR: BERECHNUNG AUSLÖSEN
---------------------------------------- */
function runCalculation() {
  const norm = document.getElementById("norm").value;
  const p = parseFloat(document.getElementById("pressure").value);
  const T = parseFloat(document.getElementById("temperature").value);
  const Q = parseFloat(document.getElementById("flow").value);
  const medium = document.getElementById("medium").value;

  if (isNaN(p) || isNaN(T) || isNaN(Q)) {
    alert("Bitte alle Eingabefelder korrekt ausfüllen.");
    return;
  }

  const result = window.computeSafetyValve(norm, p, T, Q, medium);

  displayResult(result);
  saveHistory(result);
}

/* ---------------------------------------
   INITIALISIERUNG
---------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  setActiveNav();

  // Dark Mode Button
  const nav = document.querySelector(".navbar");
  if (nav) {
    const btn = document.createElement("button");
    btn.className = "dark-toggle";
    btn.innerText = "Dark Mode";
    btn.onclick = toggleDarkMode;
    nav.appendChild(btn);
  }

  // Berechnen-Button
  const calcBtn = document.querySelector(".calc-button");
  if (calcBtn) calcBtn.addEventListener("click", runCalculation);
});
