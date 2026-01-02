


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
    //get table body
    const tableBody = document.getElementById("productTable").querySelector("tbody");

    //create row
    const row = document.createElement("tr");

    //create cells
    const prodNameCell = document.createElement("td");
    const categoryCell = document.createElement("td");
    const colourCell = document.createElement("td");

    prodNameCell.textContent = prodName;
    categoryCell.textContent = category;
    colourCell.textContent = colours.join(", ");

    row.appendChild(prodNameCell);
    row.appendChild(categoryCell);
    row.appendChild(colourCell);

    tableBody.appendChild(row);

    document.getElementById("productName").value = "";
}



