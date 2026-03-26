/* ---------------------------------------------------
   core.js – Version 2.0
   Physikalische Berechnung + API‑526 Auswahl
--------------------------------------------------- */

/* -------------------------
   API‑526 ORIFICE DATEN
------------------------- */
const API_ORIFICES = [
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

/* ---------------------------------------------------
   1) GASBERECHNUNG
   Isentrop, kritisch / unterkritisch
--------------------------------------------------- */
function calcGas(p_bar, T_C, Q, k = 1.4, Z = 1.0) {
  const p = p_bar * 1e5;    // bar → Pa
  const T = T_C + 273.15;   // °C → K
  const R = 287;            // J/(kg*K) Luftähnlich

  // kritischer Druckverhältnisfaktor
  const critical = Math.pow((2 / (k + 1)), (k / (k - 1)));

  // kritische Strömung
  const Acrit = Q * Math.sqrt(R * T * k) /
    (p * Math.sqrt(critical) * Z);

  return Acrit * 0.00155;   // m² → in² (Engineering-Orifice)
}

/* ---------------------------------------------------
   2) DAMPFBERECHNUNG
   vereinfachtes Ausflussmodell (sicherheitsventil-like)
--------------------------------------------------- */
function calcSteam(p_bar, T_C, Q) {
  const p = p_bar;
  // einfache Näherung: A = Q / (C * p)
  const C = 22; // empirisch, nicht normgebunden
  return Q / (C * p);
}

/* ---------------------------------------------------
   3) FLÜSSIGKEIT – Bernoulli
--------------------------------------------------- */
function calcLiquid(p_bar, rho = 1000, Q_m3h) {
  const p = p_bar * 1e5;        // bar → Pa
  const Q = Q_m3h / 3600;       // m³/h → m³/s
  const Cd = 0.62;              // Discharge coefficient

  const A = Q / (Cd * Math.sqrt(2 * p / rho));
  return A * 1550;              // m² → in²
}

/* ---------------------------------------------------
   4) API‑526 ORIFICE–AUSWAHL
--------------------------------------------------- */
function pickOrifice(A_in2) {
  return API_ORIFICES.find(o => o.area >= A_in2) || null;
}

/* ---------------------------------------------------
   5) HAUPTFUNKTION
--------------------------------------------------- */
function compute(norm, p, T, Q, medium) {

  let A = 0;

  if (medium === "gas") {
    A = calcGas(p, T, Q);
  }
  else if (medium === "steam") {
    A = calcSteam(p, T, Q);
  }
  else if (medium === "liquid") {
    A = calcLiquid(p, 1000, Q);
  }

  const orifice = pickOrifice(A);

  return {
    norm,
    p, T, Q, medium,
    area_in2: A,
    orifice: orifice ? orifice.size : "-",
    orificeArea: orifice ? orifice.area : null
  };
}

// globale Verbindung
window.computeSafetyValve = compute;