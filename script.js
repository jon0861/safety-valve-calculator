/* --- API‑526 Tabelle --- */
const apiOrifices = [
  { size: "D", area: 0.110 },
  { size: "E", area: 0.196 },
  { size: "F", area: 0.307 },
  { size: "G", area: 0.503 },
  { size: "H", area: 0.785 },
  { size: "J", area: 1.287 },
  { size: "K", area: 1.838 },
  { size: "L", area: 2.853 },
  { size: "M", area: 3.600 }
];

/* --- Berechnung --- */
function calculate() {
  const norm = document.getElementById("norm").value;
  const p = parseFloat(document.getElementById("pressure").value);
  const T = parseFloat(document.getElementById("temperature").value);
  const Q = parseFloat(document.getElementById("flow").value);
  const medium = document.getElementById("medium").value;

  let A = 0;
  let info = "";

  if (norm === "ad2000") {
    A = Q / (p * 10);
    info = "AD 2000 – Beispielhafte symbolische Berechnung.";
  }
  if (norm === "iso4126") {
    A = Q / (p * 12);
    info = "ISO 4126 – Beispielhafte symbolische Berechnung.";
  }
  if (norm === "asme") {
    A = Q / (p * 15);
    info = "ASME VIII – Beispielhafte symbolische Berechnung.";
  }
  if (norm === "api526") {
    A = Q / (p * 20);
    info = "API‑526 – Orifice-Auswahl basierend auf Fläche.";
  }

  let selected = null;
  if (norm === "api526") {
    selected = apiOrifices.find(v => v.area >= A);
  }

  let resultHTML = `<h3>${info}</h3>
                    <p><b>Erforderliche Fläche A:</b> ${A.toFixed(4)} in²</p>`;

  if (selected) {
    resultHTML += `<p><b>API‑526 Orifice:</b> ${selected.size}</p>`;
  }

  document.getElementById("result").innerHTML = resultHTML;

  window.lastCalc = { norm, p, T, Q, medium, A, selected };
}

/* --- PDF Download (Basic Template) --- */
function downloadPDF() {
  const c = window.lastCalc;
  if (!c) return alert("Bitte zuerst berechnen!");

  const PDF = `
Sicherheitsventil Berechnung
----------------------------

Norm: ${c.norm}
Druck: ${c.p} bar
Temperatur: ${c.T} °C
Durchsatz: ${c.Q}
Medium: ${c.medium}

Erforderliche Fläche A: ${c.A.toFixed(4)} in²
Orifice: ${c.selected ? c.selected.size : "-"}

Datum: ${new Date().toLocaleString()}
`;

  const blob = new Blob([PDF], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "berechnung.txt";
  link.click();
}

/* --- JSON Export --- */
function downloadJSON() {
  const c = window.lastCalc;
  if (!c) return alert("Bitte zuerst berechnen!");

  const blob = new Blob([JSON.stringify(c, null, 2)], {
    type: "application/json"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "berechnung.json";
  link.click();
}
``