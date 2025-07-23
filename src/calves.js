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
            <h2 class="mb-4 text-center" id="titleCalf"></h2>
            <div class="table-responsive" style="overflow-x: visible">
                <table class="table table-hover align-middle text-center">
                    <thead class="table-dark">
                        <tr style="position: sticky; top: 0; z-index: 10; background-color: #343a40;">
                            <th>Sayı</th>
                            <th>Küpe Numarası</th>
                            <th>Buzağı Adı</th>
                            <th>Doğum Tarihi</th>
                            <th>Kaç Günlük *</th>
                            <th>2 LT Düşürme Tar. *</th>
                            <th>1 LT Düşürme Tar. *</th>
                            <th>Sütten Kesme Tar. *</th>
                            <th>Sütten Kesmeye Kaç Gün Kaldı *</th>
                            <th>Anne Küpe No.</th>
                            <th>Anne Adı</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="calvesTableBody">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-end mt-3">
            <button class="btn btn-success me-2 mb-3" id="btn-add-calf" style="bottom: 20px; right: 120px; position: fixed; z-index: 100;">
                Yeni Buzağı Ekle
            </button>
            <button class="btn btn-primary mb-3" id="btn-menu" style="bottom: 20px; right: 10px; position: fixed; z-index: 100">
                Ana Menü
            </button>
        </div>

`;

const calvesBody = document.getElementById("calvesBody");

window.addEventListener("DOMContentLoaded", () => {
    calvesBody.innerHTML = loadingTemplate;
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
    calvesBody.innerHTML = layout;

    const menuButton = document.getElementById("btn-menu");
    const titleCalf = document.getElementById("titleCalf");
    const calvesTableBody = document.getElementById("calvesTableBody");
    const addCalfButton = document.getElementById("btn-add-calf");
    
    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
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
            datas = {earringNo: earringNo.textContent, type: "calf"};
            window.electronAPI.openUpdateAnimal(earringNo.textContent);
        } 
        
        else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
            if (sure) {
                const datas = { EarringNo: earringNo.textContent, Type: "calf", pageName: "calves" }
                window.electronAPI.removeAnimal(datas);
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        }
    });

    let count = 1;
    datas.forEach((calf) => {
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
        let shutButton = document.createElement("button");
        let deleteIco = document.createElement("i");
        let infoIco = document.createElement("i");
        let updateIco = document.createElement("i");
        let shutIco = document.createElement("i");

        navDiv.className = "d-flex justify-content-center gap-1";
        deleteButton.className = "btn btn-sm btn-danger";
        infoButton.className = "btn btn-sm btn-info";
        updateButton.className = "btn btn-sm btn-primary";
        shutButton.className = "btn btn-sm btn-success";
        deleteIco.className = "bi bi-trash";
        infoIco.className = "bi bi-info-circle-fill";
        updateIco.className = "bi bi-arrow-up-square-fill";
        shutIco.className = "bi bi-alarm";

        deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";
        shutIco.title = "Sütten Kesildi Olarak İşaretle";
        shutButton.title = "Sütten Kesildi Olarak İşaretle";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        navDiv.appendChild(shutButton);

        deleteButton.appendChild(deleteIco);
        infoButton.appendChild(infoIco);
        updateButton.appendChild(updateIco);
        shutButton.appendChild(shutIco);

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
        shutIco.id = "shutIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        shutButton.id = "shutIco";

        number.textContent = count.toString() + "-)";
        earringNo.textContent = calf.EarringNo;
        name.textContent = calf.Name;
        birthDate.textContent = calf.BirthDate;

        let { lt2Date, lt1Date, shutDateC, daysC, daysS } = calculateDates(calf.BirthDate);
        days.textContent = daysC;
        lt2.textContent = lt2Date;
        lt1.textContent = lt1Date;
        shutDate.textContent = shutDateC;
        shutDay.textContent = daysS;

        motherEarringNo.textContent = calf.MotherEarringNo;
        motherName.textContent = calf.MotherName;

        // tableRow.className += "table-primary";
        // if (daysS <= 15) {
        //     tableRow.className = "table-danger";
        // }
        // else if (daysS <= 25 && daysS > 15) {
        //     tableRow.className = "table-warning";
        // }
        tableRow.style.backgroundColor = calf.Gender ? "pink" : "blue"; // Bootstrap'ten Tailwind'e geçiş sırasında düzeltilecek.

        count += 1;
    });
    titleCalf.textContent = "Listede toplam " + (count - 1).toString() + " adet buzağı var";
}


// function parseTurkishDate(wDate){
//     let [day, month, year] = wDate.split(".");
//     let date = new Date(`${year}-${month}-${day}`);
//     return date;
// }

function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0"); // Ocak = 0
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDates(birthDate){
    let lt2Date = new Date(birthDate);
    let lt1Date = new Date(birthDate);
    let shutDate  = new Date(birthDate);
    let daysDate = new Date(birthDate);
    let daysShut = new Date(birthDate);
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