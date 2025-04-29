const menuButton = document.getElementById("btn-menu");
const titleVaccine = document.getElementById("titleVaccine");
const vaccineTableBody = document.getElementById("vaccineTableBody");

menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

vaccineTableBody.addEventListener("click", function (event) {
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
    datas.vaccines.forEach((vaccine) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let vaccineName = document.createElement("td");
        let vaccineDate = document.createElement("td");
        let days = document.createElement("td");

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

        vaccineTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(vaccineName);
        tableRow.appendChild(vaccineDate);
        tableRow.appendChild(days);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";

        deleteIco.id = "deleteIco";
        infoIco.id = "infoIco";
        updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";

        number.textContent = count.toString() + "-)";
        earringNo.textContent = vaccine.earringNo;
        name.textContent = vaccine.name;
        vaccineName.textContent = vaccine.vaccineName;
        vaccineDate.textContent = vaccine.vaccineDate;
        days.textContent = calculateDays(vaccine.vaccineDate).toString();

        tableRow.className = "table-warning";

        count += 1;
    });
    titleVaccine.textContent = "Listede toplam " + (count - 1).toString() + " aşı var.";
}

// Convert from Turkish Date (01.01.1970) to JavaScript Date (1979-01-01).
function parseTurkishDate(wDate) {
    let [day, month, year] = wDate.split(".");
    let date = new Date(`${year}-${month}-${day}`);
    return date;
}

// Get today's date as JavaScript date.
function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0"); // Ocak = 0
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDays(vaccineDate) {
    let today = getTodayDate();
    vDate = parseTurkishDate(vaccineDate);

    return Math.ceil((today - vDate) / (1000 * 60 * 60 * 24));
}
