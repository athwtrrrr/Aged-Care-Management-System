document.addEventListener("DOMContentLoaded", () => {
    // 1) Grab elements
    const resultsDiv   = document.getElementById("results");
    const searchInput  = document.getElementById("searchInput");
    const roomFilter   = document.getElementById("roomFilter");
    const reasonFilter = document.getElementById("reasonFilter");
  
    // Bail out if any are missing
    if (!resultsDiv || !searchInput || !roomFilter || !reasonFilter) return;
  
    // 2) Your resident data
    const residents = [
      { id: "R001", name: "John Carter",     age: 85, room: "A204", admitDate: "2025-03-01", reason: "Dementia" },
      { id: "R002", name: "Emma Davis",      age: 78, room: "A101", admitDate: "2025-02-15", reason: "Dementia" },
      { id: "R003", name: "Michael Brown",   age: 82, room: "B302", admitDate: "2025-01-10", reason: "Arthritis" }
    ];
  
    // 3) Date formatter helper
    function formatDate(iso) {
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    }
  
    // 4) Render function
    function renderResidents() {
      const q  = searchInput.value.trim().toLowerCase();
      const r  = roomFilter.value;
      const rs = reasonFilter.value;
  
      // Filter logic
      const filtered = residents.filter(res =>
        (res.name.toLowerCase().includes(q) || res.id.toLowerCase().includes(q)) &&
        (r  ? res.room   === r  : true) &&
        (rs ? res.reason === rs : true)
      );
  
      // Clear previous
      resultsDiv.innerHTML = "";
  
      if (filtered.length === 0) {
        resultsDiv.innerHTML = `<p class="text-center text-muted">No residents found.</p>`;
        return;
      }
  
      // Build Bootstrap accordion
      const acc = document.createElement("div");
      acc.className = "accordion";
      acc.id = "residentAccordion";
  
      filtered.forEach((res, i) => {
        const itemId = `resident-${i}`;
        const html = `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${itemId}">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse-${itemId}"
                aria-expanded="false"
                aria-controls="collapse-${itemId}"
              >
                ${res.name} (${res.id})
              </button>
            </h2>
            <div
              id="collapse-${itemId}"
              class="accordion-collapse collapse"
              aria-labelledby="heading-${itemId}"
              data-bs-parent="#residentAccordion"
            >
              <div class="accordion-body">
                <p><strong>Age:</strong> ${res.age}</p>
                <p><strong>Room:</strong> ${res.room}</p>
                <p><strong>Date Admitted:</strong> ${formatDate(res.admitDate)}</p>
                <p><strong>Reason for Stay:</strong> ${res.reason}</p>
              </div>
            </div>
          </div>
        `;
        acc.insertAdjacentHTML("beforeend", html);
      });
  
      resultsDiv.appendChild(acc);
    }
  
    // 5) Wire up events
    searchInput.addEventListener("input", renderResidents);
    roomFilter.addEventListener("change", renderResidents);
    reasonFilter.addEventListener("change", renderResidents);
  
    // 6) Initial render
    renderResidents();
  });
  