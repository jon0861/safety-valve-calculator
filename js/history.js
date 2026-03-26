document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#history-table tbody");

  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");

  history.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.timestamp}</td>
      <td>${item.norm}</td>
      <td>${item.p}</td>
      <td>${item.T}</td>
      <td>${item.Q}</td>
      <td>${item.medium}</td>
      <td>${item.area_in2.toFixed(4)}</td>
      <td>${item.orifice}</td>
    `;

    tableBody.appendChild(row);
  });
});
