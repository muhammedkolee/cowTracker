const menuButton = document.getElementById("btn-menu");
const titleCow = document.getElementById("titleCow");
const addCowButton = document.getElementById("btn-add-cow");
const cowTableBody = document.getElementById("cowTableBody");

// To open main menu.
menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

// To open add cow menu.
addCowButton.addEventListener("click", () => {
    let animalType = "cow";
    window.electronAPI.openAddAnimalMenu(animalType);
});

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

cowTableBody.addEventListener("click", function (event) {
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
    } else if (target.id === "applyIco") {
        const sure = window.confirm(
            "Şu küpe numaralı hayvan doğurdu olarak işaretlenecek: " +
                earringNo.textContent +
                "\nOnaylıyor musunuz?"
        );
        if (sure) {
            window.confirm("Güncellendi.");
            // Update cow's datas.
        } else {
            window.confirm("Iptal edildi.");
            // Anything.
        }
    }
});

// Datas will be show the user.
function showDatas(datas) {
    let count = 1;
    datas.cows.forEach((animal) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let inseminationDate = document.createElement("td");
        let whenBirth = document.createElement("td");
        let leftDay = document.createElement("td");
        let passDay = document.createElement("td");
        let kuruDate = document.createElement("td");
        let bullName = document.createElement("td");
        let isPregnant = document.createElement("td");

        tableRow.style.fontWeight = "bold";

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let applyButton = document.createElement("button");
        let deleteIco = document.createElement("i");
        let infoIco = document.createElement("i");
        let updateIco = document.createElement("i");
        let applyIco = document.createElement("i");

        navDiv.className = "d-flex justify-content-center gap-1";
        deleteButton.className = "btn btn-sm btn-danger";
        infoButton.className = "btn btn-sm btn-info";
        updateButton.className = "btn btn-sm btn-primary";
        applyButton.className = "btn btn-sm btn-success";
        deleteIco.className = "bi bi-trash";
        infoIco.className = "bi bi-info-circle-fill";
        updateIco.className = "bi bi-arrow-up-square-fill";
        applyIco.className = "bi bi-cake-fill";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        navDiv.appendChild(applyButton);

        deleteButton.appendChild(deleteIco);
        infoButton.appendChild(infoIco);
        updateButton.appendChild(updateIco);
        applyButton.appendChild(applyIco);

        cowTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(inseminationDate);
        tableRow.appendChild(whenBirth);
        tableRow.appendChild(leftDay);
        tableRow.appendChild(passDay);
        tableRow.appendChild(kuruDate);
        tableRow.appendChild(bullName);
        tableRow.appendChild(isPregnant);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";

        deleteIco.id = "deleteIco";
        infoIco.id = "infoIco";
        updateIco.id = "updateIco";
        applyIco.id = "applyIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        applyButton.id = "applyIco";

        number.textContent = count.toString() + "-)";
        earringNo.textContent = animal.earringNo;
        name.textContent = animal.name;
        inseminationDate.textContent = animal.inseminationDate;
        whenBirth.textContent = calculateWhenBirth(animal.inseminationDate);
        leftDay.textContent = calculateLeftDay(animal.inseminationDate);
        passDay.textContent = calculatePassDay(animal.inseminationDate);
        kuruDate.textContent = calculateKuruDate(animal.inseminationDate);
        bullName.textContent = animal.bullName;
        isPregnant.textContent = animal.isPregnant;

        tableRow.className = "table-primary";
        if (parseInt(calculateLeftDay(animal.inseminationDate)) < 20) {
            tableRow.className = "table-danger";
        }
        count += 1;
    });
    titleCow.textContent =
        "Listede toplam " + (count - 1).toString() + " adet inek var.";
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

// Calculate dates.
function calculateWhenBirth(inseminationDate) {
    let date = parseTurkishDate(inseminationDate);
    date.setDate(date.getDate() + 280);
    return date.toLocaleDateString("tr-TR");
}

function calculateKuruDate(inseminationDate) {
    let date = parseTurkishDate(inseminationDate);
    date.setDate(date.getDate() + 220);
    return date.toLocaleDateString("tr-TR");
}

function calculateLeftDay(inseminationDate) {
    let today = getTodayDate();
    let date = parseTurkishDate(inseminationDate);
    date.setDate(date.getDate() + 280);

    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function calculatePassDay(inseminationDate) {
    let today = getTodayDate();
    let date = parseTurkishDate(inseminationDate);

    return Math.ceil((today - date) / (1000 * 60 * 60 * 24));
}
