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
            <div class="flex items-center justify-center h-screen">
                <div class="loader"></div>
                <h2 class="ml-2 text-xl font-semibold">Hayvan Bilgileri Yükleniyor...</h2>
            </div>
    `;

const layout = `
            <div class="container mx-auto mt-5 mb-4 px-4">
                <h2 class="mb-4 text-center text-2xl font-bold" id="titleCow"></h2>
                <div class="shadow-lg rounded-lg">
                    <table class="min-w-full bg-white">
                        <thead class="bg-gray-800 text-white">
                            <tr class="sticky top-0 z-10 bg-gray-800">
                                <th class="px-2 py-3 text-center font-semibold text-sm">Id</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Sayı</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Küpe Numarası</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">İnek Adı</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Tohumlama Tarihi</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Doğuracağı Tarih *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Doğuma Kalan Gün *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Hamile Günü *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Kuruya Çıkartma Tarihi *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Dana Adı</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Gebelik Kontrol</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">İşlemler</th>
                            </tr>
                    </thead>
                        <tbody id="cowTableBody" class="divide-y divide-gray-200">
                            <!-- JavaScript ile satırlar buraya eklenecek -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="text-right mt-3">
                <button
                    class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 mb-3 fixed bottom-5 right-32 z-50 shadow-lg transition-colors"
                    id="btn-add-cow"
                >
                    Yeni İnek Ekle
                </button>
            </div>
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-3 fixed bottom-5 right-2 z-50 shadow-lg transition-colors"
                id="btn-menu"
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

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
    showDatas(datas);
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
        let cowId = tableRow.querySelector("#cowId");

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            let datas = { animalId: cowId.textContent, type: "cow" };
            window.electronAPI.openAnimalDetail(datas);
        } else if (target.id === "updateIco") {
            datas = { animalId: cowId.textContent, type: "cow" };
            window.electronAPI.openUpdateAnimal(datas);
        } else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " +
                    earringNo.textContent +
                    "\nOnaylıyor musunuz?"
            );
            if (sure) {
                // Remove cow from the databases.
                const datas = {
                    animalId: cowId.textContent,
                    Type: "cow",
                    pageName: "cows",
                };
                window.electronAPI.removeAnimal(datas);
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
        let cowId = document.createElement("td");
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

        // Base styling for all cells
        const cellClasses =
            "px-2 py-3 text-center font-bold text-sm whitespace-nowrap border-b border-gray-200";
        cowId.className = cellClasses;
        number.className = cellClasses;
        earringNo.className = cellClasses;
        name.className = cellClasses;
        inseminationDate.className = cellClasses;
        whenBirth.className = cellClasses;
        leftDay.className = cellClasses;
        passDay.className = cellClasses;
        kuruDate.className = cellClasses;
        bullName.className = cellClasses;
        isPregnant.className = cellClasses;

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let applyButton = document.createElement("button");
        // let deleteIco = document.createElement("i");
        // let infoIco = document.createElement("i");
        // let updateIco = document.createElement("i");
        // let applyIco = document.createElement("i");

        nav.className = cellClasses;
        navDiv.className = "flex justify-center gap-1";
        deleteButton.className =
            "bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        infoButton.className =
            "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        updateButton.className =
            "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        applyButton.className =
            "bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        deleteButton.innerHTML = `<svg id="deleteIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="deleteIco" stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        infoButton.innerHTML = `<svg id="infoIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="infoIco" stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
        updateButton.innerHTML = `<svg id="updateIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="updateIco" stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
        applyButton.innerHTML = `<svg id="applyIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="applyIco" stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" /></svg>
`;

        // Lucide icons
        // deleteIco.setAttribute("data-lucide", "trash-2");
        // infoIco.setAttribute("data-lucide", "info");
        // updateIco.setAttribute("data-lucide", "edit");
        // applyIco.setAttribute("data-lucide", "cake");

        // Icon styling
        // deleteIco.className = "w-3 h-3";
        // infoIco.className = "w-3 h-3";
        // updateIco.className = "w-3 h-3";
        // applyIco.className = "w-3 h-3";

        // deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        // infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        // updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";
        // applyIco.title = "Doğurdu Olarak İşaretle";
        applyButton.title = "Doğurdu Olarak İşaretle";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        navDiv.appendChild(applyButton);

        // deleteButton.appendChild(deleteIco);
        // infoButton.appendChild(infoIco);
        // updateButton.appendChild(updateIco);
        // applyButton.appendChild(applyIco);

        cowTableBody.appendChild(tableRow);
        tableRow.appendChild(cowId);
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
        cowId.id = "cowId";

        // deleteIco.id = "deleteIco";
        // infoIco.id = "infoIco";
        // updateIco.id = "updateIco";
        // applyIco.id = "applyIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        applyButton.id = "applyIco";

        cowId.textContent = animal.Id;
        number.textContent = count.toString() + "-)";
        earringNo.textContent = animal.EarringNo;
        // console.log(animal)
        // console.log(animal.Name)
        name.textContent = animal.Name;
        inseminationDate.textContent = new Date(
            animal.InseminationDate
        ).toLocaleDateString("tr-TR");
        whenBirth.textContent = calculateWhenBirth(animal.InseminationDate);
        leftDay.textContent = calculateLeftDay(animal.InseminationDate);
        passDay.textContent = calculatePassDay(animal.InseminationDate);
        kuruDate.textContent = calculateKuruDate(animal.InseminationDate);
        bullName.textContent = animal.BullName;
        isPregnant.textContent = new Date(animal.CheckedDate).toLocaleDateString("tr-TR");

        // Row color based on days left for birth
        if (
            parseInt(calculateLeftDay(animal.InseminationDate)) <= 30 &&
            parseInt(calculateLeftDay(animal.InseminationDate)) > 0
        ) {
            tableRow.className =
                "bg-green-200 hover:bg-green-300 transition-colors";
        } else if (
            parseInt(calculateLeftDay(animal.InseminationDate)) <= 0
        ) {
            tableRow.className =
                "bg-red-200 hover:bg-red-300 transition-colors";
        } else if (
            parseInt(calculateLeftDay(animal.InseminationDate)) <= 80 &&
            parseInt(calculateLeftDay(animal.InseminationDate)) > 30
        ) {
            tableRow.className = 
                "bg-yellow-200 hover:bg-yellow-300 transition-colors";
        } else {
            tableRow.className =
                "bg-blue-200 hover:bg-blue-300 transition-colors";
        }
        count += 1;
    });

    // Initialize Lucide icons
    // lucide.createIcons();

    titleCow.textContent =
        "Listede toplam " + (count - 1).toString() + " adet inek var.";
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
