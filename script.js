


// Help button
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
    modal.classList.add("open");
})
closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
})


// Adding colours
let colours = [];
const selectColour = document.getElementById("yarnNeeded");
const addColourBtn = document.getElementById("addColour");
const addedColours = document.getElementById("addedColours");

addColourBtn.addEventListener("click", () => {
    const selectedColour = selectColour.options[selectColour.selectedIndex].text;
    if (selectedColour === "Yarn"){
        return;
    }
    if (colours.includes(selectedColour)){
        return;
    }
    colours.push(selectedColour);
   showColours();
});

function showColours(){
    addedColours.innerHTML = "";

    colours.forEach((colour, index) => {
        const span = document.createElement("span");

        span.innerText = colour + "     ✖ ";


        span.addEventListener("click", () =>{
            //removes 1 element FROM position index
            colours.splice(index, 1);
            showColours();
        })


        span.style.cursor = "pointer";
        addedColours.appendChild(span);
    })
}


// ADD PRODUCT

function addProduct(){
    const prodName = document.getElementById("productName").value.trim();
    const category = document.getElementById("categoryType").value;
    
    if (prodName === ""){
        alert("Please enter a product name!");
        return;
    }


    if (rowBeingEdited){
        rowBeingEdited.children[0].textContent = prodName;
        rowBeingEdited.children[1].textContent = category;
        rowBeingEdited.children[2].textContent = colours.join(", ");

       exitEditMode();
        return;

    }



    //get table body
    const tableBody = document.getElementById("productTable").querySelector("tbody");

    //create row
    const row = document.createElement("tr");

    //create cells
    const prodNameCell = document.createElement("td");
    const categoryCell = document.createElement("td");
    const colourCell = document.createElement("td");
    const editRow = document.createElement("td");
    const editBtn = document.createElement("button");

    

    prodNameCell.textContent = prodName;
    categoryCell.textContent = category;
    colourCell.textContent = colours.join(", ");
    editBtn.textContent = "✎";

    editBtn.classList.add("editBtn");

    editBtn.addEventListener("click", () => edit(editBtn));



    editRow.appendChild(editBtn);
    row.appendChild(prodNameCell);
    row.appendChild(categoryCell);
    row.appendChild(colourCell);
    row.appendChild(editRow);

    addedColours.innerText = "";

   

    tableBody.appendChild(row);

    document.getElementById("productName").value = "";
    document.getElementById("categoryType").value = "Category";
    exitEditMode();
}


// Editing product entry

let rowBeingEdited = null;

function edit(button){
    let row = button.closest('tr');
    rowBeingEdited = row;

    document.getElementById("productName").value = row.children[0].textContent;
    document.getElementById("categoryType").value = row.children[1].textContent;
   
    colours = row.children[2].textContent ? row.children[2].textContent.split("; ") : [];

    showColours();

    document.getElementById("addProduct").textContent = "Save";
    


}

function exitEditMode(){

    rowBeingEdited = null;
    
    document.getElementById("productName").value = "";
    document.getElementById("categoryType").value = "Category";
    colours = [];
    showColours();
    document.getElementById("addProduct").textContent = "Add Product"

}


//edit();


//adding an event listner for typing
let searchInput = document.getElementById("searchBar");
searchInput.addEventListener("input" , searchProducts);

function searchProducts(){

     console.log("search running"); 
    const searchValue = document.getElementById("searchBar").value.toLowerCase();

    const rows = document.querySelectorAll("#productTable tbody tr");

    rows.forEach(row => {
        const prodName = row.children[0].textContent.toLowerCase();

        row.style.display = prodName.includes(searchValue) ? "" : "none";
        
    });
}
//adding the filter by feature
const selectCategory = document.getElementById("filters");
selectCategory.addEventListener("change" , filterBy);

function filterBy(){
    const category = selectCategory.value;
      const rows = document.querySelectorAll("#productTable tbody tr");

      rows.forEach(row => {
        const categorySelect = row.children[1].textContent;

        if (category === "All" || categorySelect === category){
            row.style.display = '';
        } else {
            row.style.display = "none";
        }
      })
}