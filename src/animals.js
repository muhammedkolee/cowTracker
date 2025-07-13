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
            <h2 class="mb-4 text-center" id="titleAnimal"></h2>
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
                            <th>Hayvan Adı</th>
                            <th>Doğum Tarihi</th>
                            <th>Türü</th>
                            <th>Anne Küpe No</th>
                            <th>Anne Adı</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="animalTableBody">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-end mt-3">
        </div>
        <div class="text-end mt-3">
            <button class="btn btn-success me-2 mb-3" id="btn-add-animal" style="bottom: 20px; right: 120px; position: fixed; z-index: 100;">
                Yeni Hayvan Ekle
            </button>
            <button class="btn btn-primary mb-3" id="btn-menu" style="bottom: 20px; right: 10px; position: fixed; z-index: 100">
                Ana Menü
            </button>
        </div>

`;

const animalsBody = document.getElementById("animalsBody");


// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    animalsBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});



function showDatas(datas) {
    animalsBody.innerHTML = layout;
    
    const menuButton = document.getElementById("btn-menu");
    const titleAnimal = document.getElementById("titleAnimal");
    const animalTableBody = document.getElementById("animalTableBody");
    const addAnimalButton = document.getElementById("btn-add-animal");
    
    menuButton.addEventListener("click", () => {
            window.electronAPI.openMenu();
        });
    
    
    addAnimalButton.addEventListener("click", () => {
        window.electronAPI.openAddAnimalMenu();
    });
    
    animalTableBody.addEventListener("click", function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
        let calfName = tableRow.querySelector("#calfName");
        let type = tableRow.querySelector("#type")
    
        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            if (type.textContent == "İnek"){
                var datas = { earringNo: earringNo.textContent, type: "cow" };
            }
            else if (type.textContent == "Düve"){
                var datas = { earringNo: earringNo.textContent, type: "heifer" };
            }
            else if (type.textContent == "Buzağı"){
                var datas = { earringNo: earringNo.textContent, type: "calf" };
            }
            else if (type.textContent == "Dana"){
                var datas = { earringNo: earringNo.textContent, type: "bull" };
            }
            window.electronAPI.openAnimalDetail(datas);
        } 
        
        else if (target.id === "updateIco") {
            // infoButtonClick(earringNo.textContent);
            if (type.textContent == "İnek"){
                var datas = { earringNo: earringNo.textContent, type: "cow" };
            }
            else if (type.textContent == "Düve"){
                var datas = { earringNo: earringNo.textContent, type: "heifer" };
            }
            else if (type.textContent == "Buzağı"){
                var datas = { earringNo: earringNo.textContent, type: "calf" };
            }
            else if (type.textContent == "Dana"){
                var datas = { earringNo: earringNo.textContent, type: "bull" };
            }
            // console.log(datas)
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
        }
    });

    let count = 1;
    datas.forEach((animal) => {
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
        
        deleteIco.title = "Hayvanı Sil";
        infoIco.title = "Hayvan Bilgisini Göster";
        updateIco.title = "Hayvanı Güncelle";
        
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
        type.id = "type";
        name.id = "calfName";
        
        deleteIco.id = "deleteIco";
        infoIco.id = "infoIco";
        updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        
        number.textContent = count.toString() + "-)";
        earringNo.textContent = animal.EarringNo;
        name.textContent = animal.Name;
        birthDate.textContent = animal.BirthDate;
        if (animal.Type === "cow"){
            type.textContent = "İnek";
        }
        else if (animal.Type === "heifer"){
            type.textContent = "Düve";
        }
        else if (animal.Type === "bull"){
            type.textContent = "Dana";
        }
        else if (animal.Type === "calf"){
            type.textContent = "Buzağı";
        }
        motherEarringNo.textContent = animal.MotherEarringNo;
        motherName.textContent = animal.MotherName;
        
        tableRow.className = "table-primary";
        if (animal.Type === "cow") {
            tableRow.className = "table-success";
        } else if (animal.Type === "heifer") {
            tableRow.className = "table-danger";
        } else if (animal.Type === "calf") {
            tableRow.className = "table-warning";
        }
        count += 1;
    });
    titleAnimal.textContent = "Toplam " + (count - 1).toString() + " hayvan var!";
}

