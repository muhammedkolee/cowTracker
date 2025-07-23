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
            <h2 class="mb-4 text-center" id="titleBull"></h2>
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
                            <th>Dana Adı</th>
                            <th>Doğum Tarihi</th>
                            <th>Kaç Günlük *</th>
                            <th>Anne Küpe No</th>
                            <th>Anne Adı</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="bullTableBody">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-end mt-3">
            <button class="btn btn-success me-2 mb-3" id="btn-add-bull" style="bottom: 20px; right: 120px; position: fixed; z-index: 100;">
                Yeni Dana Ekle
            </button>
            <button class="btn btn-primary mb-3" id="btn-menu" style="bottom: 20px; right: 10px; position: fixed; z-index: 100">
                Ana Menü
            </button>
        </div>

`;

const bullsBody = document.getElementById("bullsBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    bullsBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((datas) => {
        console.log(datas)
        showDatas(datas);
    });
});

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
    showDatas(datas);
});

function showDatas(datas) {
    bullsBody.innerHTML = layout;

    const menuButton = document.getElementById("btn-menu");
    const titleBull = document.getElementById("titleBull");
    const bullTableBody = document.getElementById("bullTableBody");
    const addBullButton = document.getElementById("btn-add-bull");
    
    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
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
            datas = {earringNo: earringNo.textContent, type: "bull"};
            window.electronAPI.openUpdateAnimal(earringNo.textContent);
        } 
        
        else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
            if (sure) {
                const datas = {EarringNo: earringNo.textContent, Type: "bull", pageName: "bulls" }
                window.electronAPI.removeAnimal(datas);
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        }
    });

    let count = 1;
    datas.forEach((bull) => {
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

        deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";

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
        earringNo.textContent = bull.EarringNo;
        name.textContent = bull.Name;
        birthDate.textContent = bull.BirthDate;
        
        tableRow.className = "table-primary";
        let ageC = calculateDays(bull.BirthDate);
        if (ageC < 30){
            tableRow.className = "table-success";
            age.textContent = ageC.toString() + " Gün";
        }
        else if (ageC >= 30 && ageC < 366){
            age.textContent = parseInt(ageC / 12).toString() + " Ay " + "(" + ageC.toString() + " Gün)";
        }
        motherEarringNo.textContent = bull.MotherEarringNo;
        motherName.textContent = bull.MotherName;

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

// function parseTurkishDate(wDate) {
//     let [day, month, year] = wDate.split(".");
//     let date = new Date(`${year}-${month}-${day}`);
//     return date;
// }

function calculateDays(ageDate){
    let today = getTodayDate();
    const age = new Date(ageDate);

    return Math.ceil((today - age) / (1000 * 60 * 60 * 24));
}