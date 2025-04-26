let menuButton = document.getElementById("btn-menu");
let titleHeifer = document.getElementById("titleHeifer");
let addHeiferButton = document.getElementById("btn-add-heifer");
let heiferTableBody = document.getElementById("heiferTableBody");

menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

function showDatas(datas) {
    let count = 1;
    datas.heifers.forEach((heifer) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let lastBirth = document.createElement("td");
        let tempDays = document.createElement("td");

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let deleteIco = document.createElement("i");
        let infoIco = document.createElement("i");
        let updateIco = document.createElement("i");

        tableRow.style.fontWeight = "bold";

        navDiv.className = "d-flex justify-content-center gap-1";
        deleteButton.className = "btn btn-sm btn-danger";
        infoButton.className = "btn btn-sm btn-info";
        updateButton.className = "btn btn-sm btn-primary";
        deleteIco.className = "bi bi-trash";
        infoIco.className = "bi bi-info-circle-fill";
        updateIco.className = "bi bi-arrow-up-square-fill";

        heiferTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(lastBirth);
        tableRow.appendChild(tempDays);
        tableRow.appendChild(nav);
        nav.appendChild(navDiv);

        navDiv.appendChild(deleteButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(infoButton);

        deleteButton.appendChild(deleteIco);
        infoButton.appendChild(infoIco);
        updateButton.appendChild(updateIco);

        number.textContent = count.toString() + "-)";
        earringNo.textContent = heifer.earringNo;
        name.textContent = heifer.name;
        lastBirth.textContent = heifer.lastBirth;
        tempDays.textContent = calculateDate(heifer.lastBirth);

        tableRow.className = "table-primary";
        if (
            calculateDate(heifer.lastBirth) >= 40 &&
            calculateDate(heifer.lastBirth) < 60
        ) {
            tableRow.className = "table-warning";
        } else if (calculateDate(heifer.lastBirth) >= 60) {
            tableRow.className = "table-danger";
        }
        count += 1;
    });
    titleHeifer.textContent = "Listede toplam " + (count - 1).toString() + " adet düve var.";
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

function calculateDate(lastBirth) {
    lastBirthDate = parseTurkishDate(lastBirth);

    console.log(getTodayDate);
    return Math.ceil((getTodayDate() - lastBirthDate) / (1000 * 60 * 60 * 24));
}
