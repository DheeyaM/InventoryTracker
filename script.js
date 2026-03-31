let products = [];
let editIndex = null;

const swatchMap = {
  "Wine Red": "#722f37",
  "Dark Green": "#2d6a4f",
  "Purple": "#7b2d8b",
  "Pink": "#e91e8c",
};

let settings = {
  theme: "light",
  yarnThreshold: 0.5,
  materialThreshold: 5,
};

// ------------------- Settings -------------------

function saveSettings() {
  localStorage.setItem("settings", JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem("settings");
  if (saved) {
    settings = JSON.parse(saved);
  }
}

function applySettings() {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(settings.theme);
}

loadSettings();
applySettings();

let toggle = document.getElementById("toggleTheme");
toggle.checked = settings.theme === "dark";
toggle.addEventListener("change", () => {
  settings.theme = toggle.checked ? "dark" : "light";
  applySettings();
  saveSettings();
});

const yarnThresholdInput = document.getElementById("yarnThresholdInput");
const materialThresholdInput = document.getElementById("materialThresholdInput");

function loadThresholdInputs() {
  yarnThresholdInput.value = settings.yarnThreshold;
  materialThresholdInput.value = settings.materialThreshold;
}
loadThresholdInputs();

const saveThresholdsBtn = document.getElementById("saveThresholds");
saveThresholdsBtn.addEventListener("click", () => {
  const newYarnThreshold = parseFloat(yarnThresholdInput.value);
  const newMaterialThreshold = parseInt(materialThresholdInput.value);

  if (!isNaN(newYarnThreshold)) settings.yarnThreshold = newYarnThreshold;
  if (!isNaN(newMaterialThreshold)) settings.materialThreshold = newMaterialThreshold;

  saveSettings();
  renderYarnTable();
  renderMaterialTable();
  alert("Thresholds updated!");
});

// ------------------- Help Modal -------------------

const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => modal.classList.add("open"));
closeBtn.addEventListener("click", () => modal.classList.remove("open"));

// ------------------- Products -------------------

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts() {
  const saved = localStorage.getItem("products");
  if (saved) {
    products = JSON.parse(saved);
  }
  renderTable();
}

function renderTable() {
  const tableBody = document.querySelector("#productTable tbody");
  tableBody.innerHTML = "";

  products.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.colours.join(", ")}</td>
      <td><button class="editBtn">✎</button></td>
    `;
    row.querySelector(".editBtn").addEventListener("click", () => editProduct(index));
    tableBody.appendChild(row);
  });
}

function addProduct() {
  const prodName = document.getElementById("productName").value.trim();
  const category = document.getElementById("categoryType").value;

  if (prodName === "") {
    alert("Please enter a product name!");
    return;
  }

  if (editIndex != null) {
    products[editIndex] = { name: prodName, category: category, colours: [...colours] };
    saveProducts();
    renderTable();
    exitEditMode();
    return;
  }

  products.push({ name: prodName, category: category, colours: [...colours] });
  saveProducts();
  renderTable();
  exitEditMode();
}

function editProduct(index) {
  editIndex = index;
  const product = products[index];
  document.getElementById("productName").value = product.name;
  document.getElementById("categoryType").value = product.category;
  colours = [...product.colours];
  showColours();
  document.getElementById("addProduct").textContent = "Save";
}

function exitEditMode() {
  editIndex = null;
  document.getElementById("productName").value = "";
  document.getElementById("categoryType").value = "Category";
  colours = [];
  showColours();
  document.getElementById("addProduct").textContent = "Add Product";
}

let searchInput = document.getElementById("searchBar");
searchInput.addEventListener("input", searchProducts);

function searchProducts() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#productTable tbody tr");
  rows.forEach((row) => {
    const prodName = row.children[0].textContent.toLowerCase();
    row.style.display = prodName.includes(searchValue) ? "" : "none";
  });
}

const selectCategory = document.getElementById("filters");
selectCategory.addEventListener("change", filterBy);

function filterBy() {
  const category = selectCategory.value;
  const rows = document.querySelectorAll("#productTable tbody tr");
  rows.forEach((row) => {
    const categorySelect = row.children[1].textContent;
    row.style.display = category === "All" || categorySelect === category ? "" : "none";
  });
}

loadProducts();

// ------------------- Colours (product form) -------------------

let colours = [];
const selectColour = document.getElementById("yarnNeeded");
const addColourBtn = document.getElementById("addColour");
const addedColours = document.getElementById("addedColours");

addColourBtn.addEventListener("click", () => {
  const selectedColour = selectColour.options[selectColour.selectedIndex].text;
  if (selectedColour === "Yarn" || colours.includes(selectedColour)) return;
  colours.push(selectedColour);
  showColours();
});

function showColours() {
  addedColours.innerHTML = "";
  colours.forEach((colour, index) => {
    const span = document.createElement("span");
    span.innerText = colour + "  ✖ ";
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
      colours.splice(index, 1);
      showColours();
    });
    addedColours.appendChild(span);
  });
}

// ------------------- Yarn -------------------

let yarns = [];

function saveYarns() {
  localStorage.setItem("yarns", JSON.stringify(yarns));
}

function loadYarns() {
  const saved = localStorage.getItem("yarns");
  if (saved) {
    yarns = JSON.parse(saved);
  } else {
    // Only seed default data if nothing is saved yet
    yarns = [
      { colour: "Wine Red", amount: 0.5 },
      { colour: "Dark Green", amount: 1 },
      { colour: "Purple", amount: 0.5 },
      { colour: "Pink", amount: 1 },
    ];
    saveYarns();
  }
  renderYarnTable();
}

const yarnTableBody = document.getElementById("yarnTableBody");

function renderYarnTable() {
  yarnTableBody.innerHTML = "";
  const select = document.getElementById("yarnNeeded");
  select.innerHTML = '<option value="" disabled selected>Yarn</option>';

  const lowCount = yarns.filter((y) => y.amount <= settings.yarnThreshold).length;
  const totalAmount = yarns.reduce((s, y) => s + y.amount, 0);

  document.getElementById("yarnStats").innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total colours</div>
      <div class="stat-value">${yarns.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Low stock</div>
      <div class="stat-value ${lowCount > 0 ? "warn" : ""}">${lowCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total skeins</div>
      <div class="stat-value">${totalAmount.toFixed(2)}</div>
    </div>
  `;

  yarns.forEach((yarn) => {
    const col = document.createElement("option");
    col.textContent = yarn.colour;
    col.value = yarn.colour;
    select.appendChild(col);

    const isLow = yarn.amount <= settings.yarnThreshold;
    const barPct = Math.min(100, (yarn.amount / 5) * 100).toFixed(0);
    const swatch = swatchMap[yarn.colour] || "#888";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="colour-swatch" style="background:${swatch}"></span>${yarn.colour}</td>
      <td>
        <div class="amount-ctrl">
          <button class="ctrl-btn minus">−</button>
          <span class="amount-val">${yarn.amount.toFixed(2)}</span>
          <button class="ctrl-btn plus">+</button>
        </div>
      </td>
      <td>
        <div class="bar-wrap">
          <div class="bar-fill ${isLow ? "bar-low" : "bar-ok"}" style="width:${barPct}%"></div>
        </div>
      </td>
      <td>
        <span class="badge ${isLow ? "badge-low" : "badge-ok"}">
          <span class="badge-dot ${isLow ? "dot-low" : "dot-ok"}"></span>
          ${isLow ? "Low stock" : "OK"}
        </span>
      </td>
    `;

    row.querySelectorAll(".ctrl-btn")[0].addEventListener("click", () => {
      yarn.amount = Math.max(0, yarn.amount - 0.25);
      saveYarns();
      renderYarnTable();
    });
    row.querySelectorAll(".ctrl-btn")[1].addEventListener("click", () => {
      yarn.amount += 0.25;
      saveYarns();
      renderYarnTable();
    });

    yarnTableBody.appendChild(row);
  });
}

function addYarn(colVar, amountVar) {
  yarns.push({ colour: colVar, amount: amountVar });
  saveYarns();
  renderYarnTable();
}

loadYarns();

// ------------------- Materials -------------------

let materials = [];

function saveMaterials() {
  localStorage.setItem("materials", JSON.stringify(materials));
}

function loadMaterials() {
  const saved = localStorage.getItem("materials");
  if (saved) {
    materials = JSON.parse(saved);
  } else {
    // Only seed default data if nothing is saved yet
    materials = [
      { material: "Glue Sticks", amount: 50 },
      { material: "Skewers", amount: 40 },
      { material: "Key Rings", amount: 20 },
    ];
    saveMaterials();
  }
  renderMaterialTable();
}

const materialTableBody = document.getElementById("materialTableBody");

function renderMaterialTable() {
  materialTableBody.innerHTML = "";

  const lowCount = materials.filter((m) => m.amount < settings.materialThreshold).length;
  const totalAmount = materials.reduce((s, m) => s + m.amount, 0);

  document.getElementById("materialStats").innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total materials</div>
      <div class="stat-value">${materials.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Low stock</div>
      <div class="stat-value ${lowCount > 0 ? "warn" : ""}">${lowCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total units</div>
      <div class="stat-value">${totalAmount}</div>
    </div>
  `;

  materials.forEach((material) => {
    const isLow = material.amount < settings.materialThreshold;
    const barPct = Math.min(100, (material.amount / 100) * 100).toFixed(0);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${material.material}</td>
      <td>
        <div class="amount-ctrl">
          <button class="ctrl-btn minus">−</button>
          <span class="amount-val">${material.amount}</span>
          <button class="ctrl-btn plus">+</button>
        </div>
      </td>
      <td>
        <div class="bar-wrap">
          <div class="bar-fill ${isLow ? "bar-low" : "bar-ok"}" style="width:${barPct}%"></div>
        </div>
      </td>
      <td>
        <span class="badge ${isLow ? "badge-low" : "badge-ok"}">
          <span class="badge-dot ${isLow ? "dot-low" : "dot-ok"}"></span>
          ${isLow ? "Low stock" : "OK"}
        </span>
      </td>
    `;

    row.querySelectorAll(".ctrl-btn")[0].addEventListener("click", () => {
      material.amount = Math.max(0, material.amount - 1);
      saveMaterials();
      renderMaterialTable();
    });
    row.querySelectorAll(".ctrl-btn")[1].addEventListener("click", () => {
      material.amount += 1;
      saveMaterials();
      renderMaterialTable();
    });

    materialTableBody.appendChild(row);
  });
}

loadMaterials();