const menuButton = document.getElementById("btn-menu");
const titleCalf = document.getElementById("titleCalf");
const calvesTableBody = document.getElementById("calvesTableBody");
const addCalfButton = document.getElementById("btn-add-calf");

menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

// To open add cow menu.
addCalfButton.addEventListener("click", () => {
    let animalType = "calf";
    window.electronAPI.openAddAnimalMenu(animalType);
});

calvesTableBody.addEventListener("click", function (event) {
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
    datas.calves.forEach((calf) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("th");
        let earringNo = document.createElement("th");
        let name = document.createElement("th");
        let birthDate = document.createElement("th");
        let days = document.createElement("th");
        let lt2 = document.createElement("th");
        let lt1 = document.createElement("th");
        let shutDate = document.createElement("th");
        let shutDay = document.createElement("th");
        let motherEarringNo = document.createElement("th");
        let motherName = document.createElement("th");

        let nav = document.createElement("th");
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

        calvesTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(birthDate);
        tableRow.appendChild(days);
        tableRow.appendChild(lt2);
        tableRow.appendChild(lt1);
        tableRow.appendChild(shutDate);
        tableRow.appendChild(shutDay);
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
        earringNo.textContent = calf.earringNo;
        name.textContent = calf.name;
        birthDate.textContent = calf.birthDate;

        let { lt2Date, lt1Date, shutDateC, daysC, daysS } = calculateDates(calf.birthDate);
        days.textContent = daysC;
        lt2.textContent = lt2Date;
        lt1.textContent = lt1Date;
        shutDate.textContent = shutDateC;
        shutDay.textContent = daysS;

        motherEarringNo.textContent = calf.motherEarringNo;
        motherName.textContent = calf.motherName;

        tableRow.className += "table-primary";
        if (daysS <= 15) {
            tableRow.className = "table-danger";
        }
        else if (daysS <= 25 && daysS > 15) {
            tableRow.className = "table-warning";
        }

        count += 1;
    });
    titleCalf.textContent = "Listede toplam " + (count - 1).toString() + " adet buzağı var";
}


function parseTurkishDate(wDate){
    let [day, month, year] = wDate.split(".");
    let date = new Date(`${year}-${month}-${day}`);
    return date;
}

function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0"); // Ocak = 0
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDates(birthDate){
    let lt2Date = parseTurkishDate(birthDate);
    let lt1Date = parseTurkishDate(birthDate);
    let shutDate  = parseTurkishDate(birthDate);
    let daysDate = parseTurkishDate(birthDate);
    let daysShut = parseTurkishDate(birthDate);
    let today = getTodayDate();

    lt2Date.setDate(lt2Date.getDate() + 75);
    lt1Date.setDate(lt1Date.getDate() + 85);
    shutDate.setDate(shutDate.getDate() + 100);
    daysDate = Math.ceil((today - daysDate) / (1000 * 60 * 60 * 24));
    daysShut = Math.ceil((shutDate - today) / (1000 * 60 * 60 * 24));

    return {
        lt2Date: lt2Date.toLocaleDateString("tr-TR"),
        lt1Date: lt1Date.toLocaleDateString("tr-TR"),
        shutDateC: shutDate.toLocaleDateString("tr-TR"),
        daysC: daysDate,
        daysS: daysShut
    };
}