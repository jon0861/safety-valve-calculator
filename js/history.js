/* ---------------------------------------------------
   history.js – Alle Berechnungen verwalten
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  loadHistoryTable();
});

function loadHistoryTable() {
  const tbody = document.querySelector("#history-table tbody");
  tbody.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");

  history.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="checkbox" data-index="${index}"></td>
      <td>${entry.timestamp}</td>
      <td>${entry.norm}</td>
      <td>${entry.p}</td>
      <td>${entry.T}</td>
      <td>${entry.Q}</td>
      <td>${entry.medium}</td>
      <td>${entry.area_in2.toFixed(4)}</td>
      <td>${entry.orifice}</td>
      <td>
        <button onclick="loadIntoForm(${index})">Öffnen</button>
        <button onclick="downloadHistoryPDF(${index})">PDF</button>
        <button onclick="deleteEntry(${index})" class="secondary">Löschen</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function deleteEntry(i) {
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  history.splice(i, 1);
  localStorage.setItem("calcHistory", JSON.stringify(history));
  loadHistoryTable();
}

function deleteAllHistory() {
  if (!confirm("Wirklich alle löschen?")) return;
  localStorage.removeItem("calcHistory");
  loadHistoryTable();
}

function loadIntoForm(i) {
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  const data = history[i];
  localStorage.setItem("lastCalc", JSON.stringify(data));
  window.location.href = "berechnung.html";
}

function downloadHistoryPDF(i) {
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  const c = history[i];

  const html = `
      <h1>History Export</h1>
      <table>
        <tr><td>Norm</td><td>${c.norm}</td></tr>
        <tr><td>Druck</td><td>${c.p}</td></tr>
        <tr><td>T</td><td>${c.T}</td></tr>
        <tr><td>Q</td><td>${c.Q}</td></tr>
        <tr><td>Medium</td><td>${c.medium}</td></tr>
        <tr><td>Fläche</td><td>${c.area_in2.toFixed(4)}</td></tr>
        <tr><td>Orifice</td><td>${c.orifice}</td></tr>
        <tr><td>Datum</td><td>${c.timestamp}</td></tr>
      </table>
  `;

  generatePDF(html, "History Eintrag");
}

function exportSelected() {
  const boxes = document.querySelectorAll("input[type='checkbox']:checked");
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");

  let html = `<h1>Mehrere Berechnungen</h1>`;

  boxes.forEach(box => {
    const i = parseInt(box.dataset.index);
    const c = history[i];
    html += `
      <h3>${c.timestamp}</h3>
      <table>
        <tr><td>Norm</td><td>${c.norm}</td></tr>
        <tr><td>Druck</td><td>${c.p}</td></tr>
        <tr><td>T</td><td>${c.T}</td></tr>
        <tr><td>Q</td><td>${c.Q}</td></tr>
        <tr><td>Medium</td><td>${c.medium}</td></tr>
        <tr><td>Fläche</td><td>${c.area_in2.toFixed(4)}</td></tr>
        <tr><td>Orifice</td><td>${c.orifice}</td></tr>
      </table>
      <hr>
    `;
  });

  generatePDF(html, "Mehrere Berechnungen");
}

/* Helper for history export */
function buildPDFContent(c) {
  return `
    <h2>Eintrag vom ${c.timestamp}</h2>
    <table>
      <tr><td>Norm</td><td>${c.norm}</td></tr>
      <tr><td>Druck</td><td>${c.p}</td></tr>
      <tr><td>T</td><td>${c.T}</td></tr>
      <tr><td>Q</td><td>${c.Q}</td></tr>
      <tr><td>Medium</td><td>${c.medium}</td></tr>
      <tr><td>Fläche</td><td>${c.area_in2.toFixed(4)}</td></tr>
      <tr><td>Orifice</td><td>${c.orifice}</td></tr>
    </table>
  `;
}