let menuButton = document.getElementById("btn-menu");
let titleBull = document.getElementById("titleBull");
let bullTableBody = document.getElementById("bullTableBody");

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
    datas.bulls.forEach((bull) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let birthDate = document.createElement("td");
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
        tableRow.appendChild(motherEarringNo);
        tableRow.appendChild(motherName);
        tableRow.appendChild(nav);

        number.textContent = count.toString() + "-)";
        earringNo.textContent = bull.earringNo;
        name.textContent = bull.name;
        birthDate.textContent = bull.birthDate;
        motherEarringNo.textContent = bull.motherEarringNo;
        motherName.textContent = bull.motherName;

        tableRow.className = "table-primary";

        count += 1;
    });
    titleBull.textContent = "Listede toplam " + (count - 1).toString() + " dana var.";
}
