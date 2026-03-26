/* ---------------------------------------------------
   export.js – PDF Export (Kurz + Detail)
--------------------------------------------------- */

function ensureLastCalc() {
  if (!window.lastCalc) {
    const saved = localStorage.getItem("lastCalc");
    if (!saved) return null;
    window.lastCalc = JSON.parse(saved);
  }
  return window.lastCalc;
}

/* --- Kurz-PDF --- */
function downloadPDF() {
  const c = ensureLastCalc();
  if (!c) return alert("Keine Berechnung gespeichert.");

  const html = `
      <h1>Kurzbericht</h1>
      <table>
        <tr><th>Feld</th><th>Wert</th></tr>
        <tr><td>Norm</td><td>${c.norm}</td></tr>
        <tr><td>Druck</td><td>${c.p} bar</td></tr>
        <tr><td>T</td><td>${c.T} °C</td></tr>
        <tr><td>Q</td><td>${c.Q}</td></tr>
        <tr><td>Medium</td><td>${c.medium}</td></tr>
        <tr><td>Fläche</td><td>${c.area_in2.toFixed(4)}</td></tr>
        <tr><td>Orifice</td><td>${c.orifice}</td></tr>
      </table>
  `;

  generatePDF(html, "Kurzbericht");
}

/* --- Detail-PDF --- */
function downloadPDFDetailed() {
  const c = ensureLastCalc();
  if (!c) return alert("Keine Berechnung gespeichert.");

  const html = `
      <h1>Ausführlicher Bericht</h1>
      <h2>Prozessdaten</h2>
      <table>
        <tr><td>Norm</td><td>${c.norm}</td></tr>
        <tr><td>Druck</td><td>${c.p} bar</td></tr>
        <tr><td>T</td><td>${c.T} °C</td></tr>
        <tr><td>Q</td><td>${c.Q}</td></tr>
        <tr><td>Medium</td><td>${c.medium}</td></tr>
      </table>

      <h2>Berechnungsergebnis</h2>
      <table>
        <tr><td>Fläche</td><td>${c.area_in2.toFixed(4)} in²</td></tr>
        <tr><td>Orifice</td><td>${c.orifice}</td></tr>
      </table>

      <h2>Physikalische Grundlagen</h2>
      <ul>
        <li>Isentrope Gasströmung</li>
        <li>Bernoulli Gleichung</li>
        <li>Dampfausfluss Näherung</li>
      </ul>
  `;

  generatePDF(html, "Detailbericht");
}

window.downloadPDF = downloadPDF;
window.downloadPDFDetailed = downloadPDFDetailed;