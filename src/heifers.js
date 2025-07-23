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
            <h2 class="mb-4 text-center" id="titleHeifer"></h2>
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
                            <th>Son Doğurduğu Tarih</th>
                            <th>Boş Gün *</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="heiferTableBody">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-end mt-3">
            <button
                class="btn btn-success me-2 mb-3"
                id="btn-add-heifer"
                style="
                    bottom: 20px;
                    right: 120px;
                    position: fixed;
                    z-index: 100;
                "
            >
                Yeni Düve Ekle
            </button>
            <button
                class="btn btn-primary mb-3"
                id="btn-menu"
                style="bottom: 20px; right: 10px; position: fixed; z-index: 100"
            >
                Ana Menü
            </button>
        </div>

`;

const heifersBody = document.getElementById("heifersBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    heifersBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((datas) => {
        console.log(datas);
        showDatas(datas);
    });
});

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
    showDatas(datas);
});

function showDatas(datas) {
    heifersBody.innerHTML = layout;
    
    const menuButton = document.getElementById("btn-menu");
    const titleHeifer = document.getElementById("titleHeifer");
    const addHeiferButton = document.getElementById("btn-add-heifer");
    const heiferTableBody = document.getElementById("heiferTableBody");
    
    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
    });
    
    
    addHeiferButton.addEventListener("click", () => {
        window.electronAPI.openAddAnimalMenu("heifer");
    });
    
    heiferTableBody.addEventListener("click", function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
    
        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            let datas = { earringNo: earringNo.textContent, type: "heifer" };
            window.electronAPI.openAnimalDetail(datas);
        } 
        
        else if (target.id === "updateIco") {
            datas = {earringNo: earringNo.textContent, type: "heifer"};
            window.electronAPI.openUpdateAnimal(datas);
        } 
        
        else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
            if (sure) {
                const datas = { EarringNo: earringNo.textContent, Type: "heifer", pageName: "heifers" };
                window.electronAPI.removeAnimal(datas);
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        }
    });

    let count = 1;
    datas.forEach((heifer) => {
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
        let inseminationApplyButton = document.createElement("button");
        let deleteIco = document.createElement("i");
        let infoIco = document.createElement("i");
        let updateIco = document.createElement("i");
        let inseminationApplyIco = document.createElement("i");

        tableRow.style.fontWeight = "bold";

        navDiv.className = "d-flex justify-content-center gap-1";
        deleteButton.className = "btn btn-sm btn-danger";
        infoButton.className = "btn btn-sm btn-info";
        updateButton.className = "btn btn-sm btn-primary";
        inseminationApplyButton.className = "btn btn-sm btn-success";
        deleteIco.className = "bi bi-trash";
        infoIco.className = "bi bi-info-circle-fill";
        updateIco.className = "bi bi-arrow-up-square-fill";
        inseminationApplyIco.className = "bi bi-calendar-check";

        deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";
        inseminationApplyIco.title = "Tohumlandı Olarak İşaretle";
        inseminationApplyButton.title = "Tohumlandı Olarak İşaretle";

        heiferTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(lastBirth);
        tableRow.appendChild(tempDays);
        tableRow.appendChild(nav);
        nav.appendChild(navDiv);

        earringNo.id = "earringNo";

        deleteIco.id = "deleteIco";
        infoIco.id = "infoIco";
        updateIco.id = "updateIco";
        inseminationApplyIco.id = "inseminationApplyIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        inseminationApplyButton.id = "inseminationApplyIco";

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        navDiv.appendChild(inseminationApplyButton);

        deleteButton.appendChild(deleteIco);
        infoButton.appendChild(infoIco);
        updateButton.appendChild(updateIco);
        inseminationApplyButton.appendChild(inseminationApplyIco);

        // console.log(heifer.lastBirthDate)

        number.textContent = count.toString() + "-)";
        earringNo.textContent = heifer.EarringNo;
        name.textContent = heifer.Name;
        lastBirth.textContent = heifer.LastBirthDate;
        tempDays.textContent = calculateDate(heifer.LastBirthDate);

        tableRow.className = "table-primary";
        if (
            calculateDate(heifer.LastBirthDate) >= 40 &&
            calculateDate(heifer.LastBirthDate) < 60
        ) {
            tableRow.className = "table-warning";
        } else if (calculateDate(heifer.LastBirthDate) >= 60) {
            tableRow.className = "table-danger";
        }
        count += 1;
    });
    titleHeifer.textContent = "Listede toplam " + (count - 1).toString() + " adet düve var.";
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
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDate(lastBirth) {

    const lastBirthDate = new Date(lastBirth);

    return Math.ceil((getTodayDate() - lastBirthDate) / (1000 * 60 * 60 * 24));
}
