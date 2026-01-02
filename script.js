


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
    addedColours.innerText = "Selected Colours:" + colours.join(", ");
});
