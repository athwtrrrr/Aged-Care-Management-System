// Sample inventory data
let inventory = [
    { name: "Paracetamol", category: "Medication", quantity: 120, expiry: "2025-01-12", restock: 50 },
    { name: "Disposable Gloves", category: "General Goods", quantity: 20, expiry: "-", restock: 100 },
    { name: "Antibiotic Cream", category: "Medication", quantity: 10, expiry: "2023-11-30", restock: 30 },
    { name: "Scissors", category: "General Goods", quantity: 5, expiry: "-", restock: 10 },
    { name: "Cotton Balls", category: "General Goods", quantity: 200, expiry: "-", restock: 100 }
  ];
  
  const tableBody = document.querySelector("tbody");
  const searchInput = document.querySelector("input[type='text']");
  const categoryFilter = document.querySelector("select");
  
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Inventory Item</h2>
      <label>Item Name</label>
      <input type="text" id="itemName" required>
      <label>Category</label>
      <select id="itemCategory">
        <option value="Medication">Medication</option>
        <option value="General Goods">General Goods</option>
      </select>
      <label>Quantity</label>
      <input type="number" id="itemQty" required>
      <label>Expiry Date</label>
      <input type="date" id="itemExpiry">
      <label>Restock Level</label>
      <input type="number" id="itemRestock" required>
      <div class="modal-actions">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  function getStatus(item) {
    if (item.category === "Medication" && new Date(item.expiry) < new Date()) return "expired";
    if (item.quantity < item.restock) return "low";
    return "ok";
  }
  
  function renderTable(items) {
    tableBody.innerHTML = "";
    items.forEach(item => {
      const row = document.createElement("tr");
      const status = getStatus(item);
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>${item.expiry}</td>
        <td>${item.restock}</td>
        <td class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
        <td class="actions">
          <i class="fas fa-edit"></i>
          <i class="fas fa-trash-alt"></i>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function filterInventory() {
    const searchText = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const filtered = inventory.filter(item => {
      const matchesName = item.name.toLowerCase().includes(searchText);
      const matchesCategory = category ? item.category === category : true;
      return matchesName && matchesCategory;
    });
    renderTable(filtered);
  }
  
  // Event listeners
  searchInput.addEventListener("input", filterInventory);
  categoryFilter.addEventListener("change", filterInventory);
  
  document.querySelector(".add-btn").addEventListener("click", () => {
    modal.style.display = "flex";
  });
  
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  modal.querySelector(".save-btn").addEventListener("click", () => {
    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("itemCategory").value;
    const quantity = parseInt(document.getElementById("itemQty").value);
    const expiry = document.getElementById("itemExpiry").value || "-";
    const restock = parseInt(document.getElementById("itemRestock").value);
  
    if (!name || isNaN(quantity) || isNaN(restock)) {
      alert("Please fill in all required fields.");
      return;
    }
  
    inventory.push({ name, category, quantity, expiry, restock });
    modal.style.display = "none";
    renderTable(inventory);
    searchInput.value = "";
    categoryFilter.value = "";
  });
  
  // Initial render
  renderTable(inventory);
  