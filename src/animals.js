const menuButton = document.getElementById("btn-menu");
const titleAnimal = document.getElementById("titleAnimal");
const animalTableBody = document.getElementById("animalTableBody");
const addAnimalButton = document.getElementById("btn-add-animal");

menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

addAnimalButton.addEventListener("click", () => {
    window.electronAPI.openAddAnimalMenu();
});

animalTableBody.addEventListener("click", function (event) {
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
    datas.animals.forEach((animal) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let birthDate = document.createElement("td");
        let type = document.createElement("td");
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

        animalTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(birthDate);
        tableRow.appendChild(type);
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
        earringNo.textContent = animal.earringNo;
        name.textContent = animal.name;
        birthDate.textContent = animal.birthDate;
        type.textContent = animal.type;
        motherEarringNo.textContent = animal.motherEarringNo;
        motherName.textContent = animal.motherName;

        tableRow.className = "table-primary";
        if (animal.type === "cow") {
            tableRow.className = "table-success";
        } else if (animal.type === "heifer") {
            tableRow.className = "table-danger";
        } else if (animal.type === "calf") {
            tableRow.className = "table-warning";
        }
        count += 1;
    });
    titleAnimal.textContent = "Toplam " + (count - 1).toString() + " hayvan var!";
}
