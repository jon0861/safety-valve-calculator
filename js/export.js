/* ---------------------------------------------------
   export.js – Version 2.0
   PDF- und JSON-Export für Safety Valve Calculator
--------------------------------------------------- */

/* ---------------------------------------------------
   1) JSON EXPORT
--------------------------------------------------- */
function downloadJSON() {
  if (!window.lastCalc) {
    alert("Bitte zuerst eine Berechnung durchführen.");
    return;
  }

  const data = JSON.stringify(window.lastCalc, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const link = document.createElement("a");
  const ts = new Date().toISOString().replace(/[:.]/g, "-");

  link.href = URL.createObjectURL(blob);
  link.download = `safety_valve_calculation_${ts}.json`;
  link.click();
}

/* ---------------------------------------------------
   2) PDF EXPORT (TXT-BASED FOR MAX COMPATIBILITY)
   GitHub Pages erlaubt keine Libraries → daher Plain Text
--------------------------------------------------- */
function downloadPDF() {
  if (!window.lastCalc) {
    alert("Bitte zuerst eine Berechnung durchführen.");
    return;
  }

  const c = window.lastCalc;
  const ts = new Date().toLocaleString();

  const pdfText = `
Safety Valve Calculator – PDF Export (Version 2.0)
===================================================

DATEN
-----
Norm:             ${c.norm}
Druck:            ${c.p} bar
Temperatur:       ${c.T} °C
Durchsatz:        ${c.Q}
Medium:           ${c.medium}

ERGEBNIS
--------
Benötigte Fläche: ${c.area_in2.toFixed(4)} in²
API-526 Orifice:  ${c.orifice}
Orifice Fläche:   ${c.orificeArea ? c.orificeArea + " in²" : "-"}

SYSTEM
------
Erstellt am:      ${ts}




HINWEIS:
Dies ist die einfache PDF/Textversion für maximale Browser-Kompatibilität.
Eine "echte" PDF mit Layout kann später integriert werden.
`;

  // TXT-basierter PDF-Ersatz (Browser save)
  const blob = new Blob([pdfText], { type: "text/plain" });
  const link = document.createElement("a");
  const fname = "safety_valve_calculation.txt";

  link.href = URL.createObjectURL(blob);
  link.download = fname;
  link.click();
}

// export global
window.downloadJSON = downloadJSON;
window.downloadPDF = downloadPDF;
