document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("residentForm");
  const tableBody = document.querySelector("table tbody");
  let residentCount = tableBody.rows.length;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const age = formData.get("age");
    const room = formData.get("room");
    const carer = formData.get("carer");
    const admitDate = formData.get("admitDate");
    const reason = formData.get("reason");

    residentCount++;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${String(residentCount).padStart(2, '0')}</td>
      <td>${name}</td>
      <td>${age}</td>
      <td>${room}</td>
      <td>${carer}</td>
      <td>${formatDate(admitDate)}</td>
      <td>${reason}</td>
    `;

    tableBody.appendChild(newRow);

    // Close the modal
    bootstrap.Modal.getInstance(document.getElementById("addResidentModal")).hide();
    form.reset();
  });

  function formatDate(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
});







