let products = [];
let editIndex = null;

let settings = {
  theme: "light",
  yarnThreshold: 0.5,
  materialThreshold: 5
};


// Help button
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
  modal.classList.add("open");
});
closeBtn.addEventListener("click", () => {
  modal.classList.remove("open");
});

// Adding colours
let colours = [];
const selectColour = document.getElementById("yarnNeeded");
const addColourBtn = document.getElementById("addColour");
const addedColours = document.getElementById("addedColours");

addColourBtn.addEventListener("click", () => {
  const selectedColour = selectColour.options[selectColour.selectedIndex].text;
  if (selectedColour === "Yarn") {
    return;
  }
  if (colours.includes(selectedColour)) {
    return;
  }
  colours.push(selectedColour);
  showColours();
});

function showColours() {
  addedColours.innerHTML = "";

  colours.forEach((colour, index) => {
    const span = document.createElement("span");

    span.innerText = colour + "     ✖ ";

    span.addEventListener("click", () => {
      //removes 1 element FROM position index
      colours.splice(index, 1);
      showColours();
    });

    span.style.cursor = "pointer";
    addedColours.appendChild(span);
  });
}

// ADD PRODUCT
//saving the products
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts() {
  const saved = localStorage.getItem("products");
  if (saved) {
    products = JSON.parse(saved);
    renderTable();
  }
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
    row
      .querySelector(".editBtn")
      .addEventListener("click", () => editProduct(index));
    tableBody.appendChild(row);
  });
}

//add to table
function addProduct() {
  const prodName = document.getElementById("productName").value.trim();
  const category = document.getElementById("categoryType").value;

  if (prodName === "") {
    alert("Please enter a product name!");
    return;
  }

  //edit mode
  if (editIndex != null) {
    products[editIndex] = {
      name: prodName,
      category: category,
      colours: [...colours],
    };
    saveProducts();
    renderTable();
    exitEditMode();
    return;
  }

  //add mode

  products.push({
      name: prodName,
      category: category,
      colours: [...colours],
    });
     saveProducts();
    renderTable();
    exitEditMode();


  document.getElementById("productName").value = "";
  document.getElementById("categoryType").value = "Category";
}
function editProduct(index){
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

//edit();

//adding an event listner for typing
let searchInput = document.getElementById("searchBar");
searchInput.addEventListener("input", searchProducts);

function searchProducts() {
  console.log("search running");
  const searchValue = document.getElementById("searchBar").value.toLowerCase();

  const rows = document.querySelectorAll("#productTable tbody tr");

  rows.forEach((row) => {
    const prodName = row.children[0].textContent.toLowerCase();

    row.style.display = prodName.includes(searchValue) ? "" : "none";
  });
}
//adding the filter by feature
const selectCategory = document.getElementById("filters");
selectCategory.addEventListener("change", filterBy);

function filterBy() {
  const category = selectCategory.value;
  const rows = document.querySelectorAll("#productTable tbody tr");

  rows.forEach((row) => {
    const categorySelect = row.children[1].textContent;

    if (category === "All" || categorySelect === category) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

loadProducts();

let yarns = [];
const threshold = 0.5;

 yarns.push({
  colour: "Wine Red",
  amount: 0.5
},
{
  colour: "Dark Green",
  amount: 1
});
 console.log(yarns)

const yarnTableBody = document.getElementById("yarnTableBody");


 function saveYarns(){
  localStorage.setItem("yarns", JSON.stringify(yarns));
 }

 function loadYarns(){
  const saved = localStorage.getItem("yarns");
  if (saved){
    yarns = JSON.parse(saved);
  }
  renderYarnTable();
 }

function renderYarnTable(){
  yarnTableBody.innerHTML = "";
const select = document.getElementById("yarnNeeded");
select.innerHTML = '<option value="" disabled selected>Yarn</option>'; 
  yarns.forEach((yarn) => {
    const col = document.createElement("option");
    col.textContent = yarn.colour;
    col.value = yarn.colour;
    select.appendChild(col);
    // Adding the colours to the select
    
    
// Buttons for amount col
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-0.25";
    minusBtn.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
    minusBtn.style.border = "0";
    minusBtn.style.cursor = "pointer";
    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+0.25";
    plusBtn.style.backgroundColor = "rgba(0, 128, 0, 0.25)";
    plusBtn.style.border = "0";
   plusBtn.style.cursor = "pointer";

    minusBtn.addEventListener("click", () =>{
     yarn.amount = Math.max(0, yarn.amount - 0.25); 
      saveYarns();
      renderYarnTable();
    })

    plusBtn.addEventListener("click", () => {
      yarn.amount = yarn.amount + 0.25;
      saveYarns();
      renderYarnTable();
    })
    
    const row = document.createElement("tr");
    const colourCell = document.createElement("td");
    colourCell.style.width = "300px";
    const amountCell = document.createElement("td");
     amountCell.style.width = "300px";

    const amountSpan = document.createElement("span");
    amountSpan.classList.add("amount");
    amountSpan.textContent = `${yarn.amount}`;

    colourCell.textContent = yarn.colour;
    amountCell.appendChild(minusBtn);
    amountCell.appendChild(amountSpan);
    amountCell.appendChild(plusBtn);

    row.appendChild(colourCell);
    row.appendChild(amountCell);

    const statusCell = document.createElement("td");
    if (yarn.amount <= settings.yarnThreshold){
      statusCell.textContent = "Low Stock!";
      statusCell.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      statusCell.style.width = "275px";
    
    } else {
      statusCell.textContent = "Ok";
      statusCell.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
      statusCell.style.width = "275px";
    }

    row.appendChild(statusCell);
    yarnTableBody.appendChild(row);


  });

}
function addyarn(colVar, amountVar){
  yarns.push({colour: colVar, amount: amountVar});
    saveYarns();        
  renderYarnTable();  
}

addyarn("Purple", 0.5);
addyarn("Pink", 1)

//loadYarns();
let materials = [];
let thresholdMaterial = 5;

materials.push({
  material: "Glue Sticks",
  amount: 50
},
{
  material: "Skewers",
  amount: 40
},
{
  material: "Key Rings",
  amount: 20
});



const materialTableBody = document.getElementById("materialTableBody");
function renderMaterialTable(){
  materialTableBody.innerHTML = "";

  materials.forEach((material) => {


    // Buttons
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-1";
    minusBtn.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
    minusBtn.style.border = "0";
    minusBtn.style.cursor = "pointer";
    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+1";
    plusBtn.style.backgroundColor = "rgba(0, 128, 0, 0.25)";
    plusBtn.style.border = "0";
   plusBtn.style.cursor = "pointer";

   minusBtn.addEventListener("click", () => {
    material.amount = Math.max(0, material.amount - 1);
    saveMaterials(); 
    renderMaterialTable();
   });


   plusBtn.addEventListener("click", () => {
    material.amount = material.amount + 1;
    saveMaterials(); 
    renderMaterialTable();
   })

 minusBtn.classList.add("btn-minus");
plusBtn.classList.add("btn-plus");

    const row = document.createElement("tr");
    const materialCell = document.createElement("td");
    const amountCell = document.createElement("td");
    materialCell.textContent = material.material;
   

      const amountSpan = document.createElement("span");
      amountSpan.classList.add("amount");
      amountSpan.textContent = `${material.amount}`;
      amountCell.appendChild(minusBtn);
      amountCell.appendChild(amountSpan);
      amountCell.appendChild(plusBtn);


    row.appendChild(materialCell);
    row.appendChild(amountCell);
       const statusCell = document.createElement("td");
    if (material.amount < settings.materialThreshold){
      statusCell.textContent = "Low Stock!";
      statusCell.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      statusCell.style.width = "275px";
    } else {
      statusCell.textContent = "Ok";
      statusCell.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
      statusCell.style.width = "275px";
    }

    row.appendChild(statusCell);
    materialTableBody.appendChild(row);
  })
}


renderMaterialTable();

// -------------------Settings page ------------------




function saveSettings(){
  localStorage.setItem("settings", JSON.stringify(settings));
}

function loadSettings(){
  const saved = localStorage.getItem("settings");
  if (saved){
    settings = JSON.parse(saved);
  }
}

function applySettings(){
  document.body.classList.remove("light", "dark");
  document.body.classList.add(settings.theme);
}

let toggle = document.getElementById("toggleTheme");
toggle.addEventListener("change", () => {

  settings.theme = toggle.checked ? "dark" : "light";
  applySettings();
  saveSettings();
});

loadSettings();
applySettings();

toggle.checked = settings.theme === "dark";


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

  saveSettings();       // persist to localStorage
  renderYarnTable();    // re-render tables to apply new thresholds
  renderMaterialTable();
  alert("Thresholds updated!");
});



function saveMaterials() {
  localStorage.setItem("materials", JSON.stringify(materials));
}

function loadMaterials() {
  const saved = localStorage.getItem("materials");
  if (saved) materials = JSON.parse(saved);
  renderMaterialTable();
}