let products = [];
let editIndex = null;


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

const yarns = [];
const threshold = 0.5;

yarns.push({
  colour: "Wine Red",
  amount: 0.5
},
{
  colour: "Dark Green",
  amount: 1
},
{
  colour: "Red",
  amount: 1
})

// console.log(yarns)

const yarnTableBody = document.getElementById("yarnTableBody");

 console.log(yarnTableBody);

function renderYarnTable(){
  yarnTableBody.innerHTML = "";

  //For each syntax!!
  yarns.forEach((yarn) => {
    const row = document.createElement("tr");
    const colourCell = document.createElement("td");
    const amountCell = document.createElement("td");
    colourCell.textContent = yarn.colour;
    amountCell.textContent = yarn.amount;

    row.appendChild(colourCell);
    row.appendChild(amountCell);

    const statusCell = document.createElement("td");
    if (yarn.amount <= threshold){
      statusCell.textContent = "Low Stock!";
      statusCell.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    
    } else {
      statusCell.textContent = "Ok!";
      statusCell.style.backgroundColor = "rgba(0, 128, 0, 0.5)";
    }

    row.appendChild(statusCell);
    yarnTableBody.appendChild(row);



  });

}

renderYarnTable();












