const loadingTemplate = `
        <style>
            .loader {
                border: 16px solid #90EE90; /* Green */
                border-top: 16px solid #0000FF; /* Blue */
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;">
            <div class="loader"></div>
            <h2 style="margin-left: 10px;">Hayvan Bilgileri Yükleniyor...</h2>
        </div>

`;

const layout = `
        <div class="container mt-5 mb-4">
            <h2 class="mb-4 text-center" id="titleCow"></h2>
            <div class="table-responsive" style="overflow-x: visible">
                <table class="table table-hover align-middle text-center">
                    <thead class="table-dark">
                        <tr
                            style="
                                position: sticky;
                                top: 0;
                                z-index: 10;
                                background-color: #343a40;
                            "
                        >
                            <th>Sayı</th>
                            <th>Küpe Numarası</th>
                            <th>İnek Adı</th>
                            <th>Tohumlama Tarihi</th>
                            <th>Doğuracağı Tarih *</th>
                            <th>Doğuma Kalan Gün *</th>
                            <th>Hamile Günü *</th>
                            <th>Kuruya Çıkartma Tarihi *</th>
                            <th>Dana Adı</th>
                            <th>Gebelik Kontrol</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="cowTableBody">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-end mt-3">
            <button
                class="btn btn-success me-2 mb-3"
                id="btn-add-cow"
                style="
                    bottom: 20px;
                    right: 120px;
                    position: fixed;
                    z-index: 100;
                "
            >
                Yeni İnek Ekle
            </button>
        </div>
        <button
            class="btn btn-primary mb-3"
            id="btn-menu"
            style="bottom: 20px; right: 10px; position: fixed; z-index: 100"
        >
            Ana Menü
        </button>

`;

const cowsBody = document.getElementById("cowsBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    cowsBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

// Datas will be show the user.
function showDatas(datas) {
    cowsBody.innerHTML = layout;

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
            datas = {earringNo: earringNo.textContent, type: "cow"};
            window.electronAPI.openUpdateAnimal(datas);
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

    let count = 1;
    datas.forEach((animal) => {
        // console.log("datas",datas);
        // console.log("animal",animal);
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

        deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";
        applyIco.title = "Doğurdu Olarak İşaretle";
        applyButton.title = "Doğurdu Olarak İşaretle";

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
        earringNo.textContent = animal.EarringNo;
        // console.log(animal)
        // console.log(animal.Name)
        name.textContent = animal.Name;
        inseminationDate.textContent = new Date(animal.InseminationDate).toLocaleDateString("tr-TR");
        whenBirth.textContent = calculateWhenBirth(animal.InseminationDate);
        leftDay.textContent = calculateLeftDay(animal.InseminationDate);
        passDay.textContent = calculatePassDay(animal.InseminationDate);
        kuruDate.textContent = calculateKuruDate(animal.InseminationDate);
        bullName.textContent = animal.BullName;
        isPregnant.textContent = animal.CheckedDate;

        if (parseInt(calculateLeftDay(animal.InseminationDate)) <= 30 && parseInt(calculateLeftDay(animal.InseminationDate)) > 0) {
            tableRow.className = "table-success";
        }
        else if (parseInt(calculateLeftDay(animal.InseminationDate)) <= 0) {
            tableRow.className = "table-danger";
        }
        else {
            tableRow.className = "table-primary";
        }
        count += 1;
    });
    titleCow.textContent =
        "Listede toplam " + (count - 1).toString() + " adet inek var.";
}

// Convert from Turkish Date (01.01.1970) to JavaScript Date (1979-01-01).
// function parseTurkishDate(wDate) {
//     let [day, month, year] = wDate.split(".");
//     let date = new Date(`${year}-${month}-${day}`);
//     return date;
// }

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
    let date = new Date(inseminationDate);
    date.setDate(date.getDate() + 280);

    // console.log("calculateWhenBirth: ",date.toLocaleDateString("tr-TR"));
    return date.toLocaleDateString("tr-TR");
}

function calculateKuruDate(inseminationDate) {
    let date = new Date(inseminationDate);
    date.setDate(date.getDate() + 220);

    // console.log("calculateKuruDate: ", date.toLocaleDateString("tr-TR"));
    return date.toLocaleDateString("tr-TR");
}

function calculateLeftDay(inseminationDate) {
    let today = getTodayDate();
    let date = new Date(inseminationDate);
    date.setDate(date.getDate() + 280);

    // console.log("calculateLeftDay: ",Math.ceil((date - today) / (1000 * 60 * 60 * 24)));
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function calculatePassDay(inseminationDate) {
    let today = getTodayDate();
    let date = new Date(inseminationDate);

    // console.log("calculatePassDay: ",Math.ceil((today - date) / (1000 * 60 * 60 * 24)));
    return Math.ceil((today - date) / (1000 * 60 * 60 * 24));
}
