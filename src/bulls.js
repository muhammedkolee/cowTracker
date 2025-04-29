const menuButton = document.getElementById("btn-menu");
const titleBull = document.getElementById("titleBull");
const bullTableBody = document.getElementById("bullTableBody");
const addBullButton = document.getElementById("btn-add-bull");

menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

addBullButton.addEventListener("click", () => {
    window.electronAPI.openAddAnimalMenu("bull");
});

bullTableBody.addEventListener("click", function (event) {
    const target = event.target;
    let tableRow = target.closest("tr");
    let earringNo = tableRow.querySelector("#earringNo");

    if (target.id === "infoIco") {
        // infoButtonClick(earringNo.textContent);
        let datas = { earringNo: earringNo.textContent, type: "cow" };
        window.electronAPI.openAnimalDetail(datas);
    } 
    
    else if (target.id === "updateIco") {
        datas = earringNo.textContent;
        window.electronAPI.openUpdateAnimal(earringNo.textContent);
    } 
    
    else if (target.id === "deleteIco") {
        const sure = window.confirm(
            "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
        if (sure) {
            // Remove cow from the databases.
            console.log("Veri silindi.");
        } else {
            // Anything.
            console.log("Veri silinmedi.");
        }
    }
});

function showDatas(datas) {
    let count = 1;
    datas.bulls.forEach((bull) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let birthDate = document.createElement("td");
        let age = document.createElement("td");
        let motherEarringNo = document.createElement("td");
        let motherName = document.createElement("td");

        tableRow.style.fontWeight = "bold";

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let deleteIco = document.createElement("i");
        let infoIco = document.createElement("i");
        let updateIco = document.createElement("i");

        navDiv.className = "d-flex justify-content-center gap-1";
        deleteButton.className = "btn btn-sm btn-danger";
        infoButton.className = "btn btn-sm btn-info";
        updateButton.className = "btn btn-sm btn-primary";
        deleteIco.className = "bi bi-trash";
        infoIco.className = "bi bi-info-circle-fill";
        updateIco.className = "bi bi-arrow-up-square-fill";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);

        deleteButton.appendChild(deleteIco);
        infoButton.appendChild(infoIco);
        updateButton.appendChild(updateIco);

        bullTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(birthDate);
        tableRow.appendChild(age);
        tableRow.appendChild(motherEarringNo);
        tableRow.appendChild(motherName);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";

        deleteIco.id = "deleteIco";
        infoIco.id = "infoIco";
        updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";

        number.textContent = count.toString() + "-)";
        earringNo.textContent = bull.earringNo;
        name.textContent = bull.name;
        birthDate.textContent = bull.birthDate;
        
        tableRow.className = "table-primary";
        let ageC = calculateDays(bull.birthDate);
        if (ageC < 30){
            tableRow.className = "table-success";
            age.textContent = ageC.toString() + " Gün";
        }
        else if (ageC >= 30 && ageC < 366){
            age.textContent = parseInt(ageC / 12).toString() + " Ay " + "(" + ageC.toString() + " Gün)";
        }
        motherEarringNo.textContent = bull.motherEarringNo;
        motherName.textContent = bull.motherName;

        count += 1;
    });
    titleBull.textContent = "Listede toplam " + (count - 1).toString() + " dana var.";
}

// Get today's date as JavaScript date.
function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0"); // Ocak = 0
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function parseTurkishDate(wDate) {
    let [day, month, year] = wDate.split(".");
    let date = new Date(`${year}-${month}-${day}`);
    return date;
}

function calculateDays(age){
    let today = getTodayDate();
    let days = parseTurkishDate(age);

    return Math.ceil((today - days) / (1000 * 60 * 60 * 24));

}