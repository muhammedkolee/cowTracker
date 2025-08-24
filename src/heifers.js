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
                    <h2 class="mb-4 text-center text-2xl font-bold" id="titleHeifer"></h2>
                    <div class="shadow-lg rounded-lg">
                        <table class="min-w-full bg-white">
                            <thead class="sticky top-0 z-10 bg-gray-800 text-white">
                                <tr class="bg-gray-800">
                                    <th class="px-4 py-3 text-center font-semibold">Id</th>
                                    <th class="px-4 py-3 text-center font-semibold">Sayı</th>
                                    <th class="px-4 py-3 text-center font-semibold">Küpe Numarası</th>
                                    <th class="px-4 py-3 text-center font-semibold">İnek Adı</th>
                                    <th class="px-4 py-3 text-center font-semibold">Son Doğurduğu Tarih</th>
                                    <th class="px-4 py-3 text-center font-semibold">Boş Gün *</th>
                                    <th class="px-4 py-3 text-center font-semibold">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="heiferTableBody" class="divide-y divide-gray-200">
                                <!-- JavaScript ile satırlar buraya eklenecek -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="text-right mt-3">
                    <button
                        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 mb-3 fixed bottom-5 right-32 z-50 shadow-lg transition-colors"
                        id="btn-add-heifer"
                    >
                        Yeni Düve Ekle
                    </button>
                    <button
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-3 fixed bottom-5 right-2 z-50 shadow-lg transition-colors"
                        id="btn-menu"
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
        let heiferId = tableRow.querySelector("#heiferId");

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            let datas = { animalId: heiferId.textContent, type: "heifer" };
            window.electronAPI.openAnimalDetail(datas);
        }

        else if (target.id === "updateIco") {
            datas = { animalId: heiferId.textContent, type: "heifer" };
            window.electronAPI.openUpdateAnimal(datas);
        }

        else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
            if (sure) {
                const datas = { animalId: heiferId.textContent, Type: "heifer", pageName: "heifers" };
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
        let heiferId = document.createElement("td");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let lastBirth = document.createElement("td");
        let tempDays = document.createElement("td");

        // Base styling for all cells
        const cellClasses = "px-4 py-3 text-center font-bold whitespace-nowrap";
        heiferId.className = cellClasses;
        number.className = cellClasses;
        earringNo.className = cellClasses;
        name.className = cellClasses;
        lastBirth.className = cellClasses;
        tempDays.className = cellClasses;

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let inseminationApplyButton = document.createElement("button");
        deleteButton.innerHTML = `<svg id="deleteIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="deleteIco" stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        infoButton.innerHTML = `<svg id="infoIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="infoIco" stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
        updateButton.innerHTML = `<svg id="updateIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="updateIco" stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
        inseminationApplyButton.innerHTML = `<svg id="inseminationApplyIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="inseminationApplyIco" stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>`;
        // let deleteIco = document.createElement("i");
        // let infoIco = document.createElement("i");
        // let updateIco = document.createElement("i");
        // let inseminationApplyIco = document.createElement("i");

        nav.className = cellClasses;
        navDiv.className = "flex justify-center gap-1";
        deleteButton.className = "bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";
        infoButton.className = "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";
        updateButton.className = "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";
        inseminationApplyButton.className = "bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";

        // Lucide icons
        // deleteIco.setAttribute("data-lucide", "trash-2");
        // infoIco.setAttribute("data-lucide", "info");
        // updateIco.setAttribute("data-lucide", "edit");
        // inseminationApplyIco.setAttribute("data-lucide", "calendar-check");

        // Icon styling
        // deleteIco.className = "w-4 h-4";
        // infoIco.className = "w-4 h-4";
        // updateIco.className = "w-4 h-4";
        // inseminationApplyIco.className = "w-4 h-4";

        // deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        // infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        // updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";
        // inseminationApplyIco.title = "Tohumlandı Olarak İşaretle";
        inseminationApplyButton.title = "Tohumlandı Olarak İşaretle";

        heiferTableBody.appendChild(tableRow);
        tableRow.appendChild(heiferId);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(lastBirth);
        tableRow.appendChild(tempDays);
        tableRow.appendChild(nav);
        nav.appendChild(navDiv);

        earringNo.id = "earringNo";
        heiferId.id = "heiferId";

        // deleteIco.id = "deleteIco";
        // infoIco.id = "infoIco";
        // updateIco.id = "updateIco";
        // inseminationApplyIco.id = "inseminationApplyIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        inseminationApplyButton.id = "inseminationApplyIco";

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        navDiv.appendChild(inseminationApplyButton);

        // deleteButton.appendChild(deleteIco);
        // infoButton.appendChild(infoIco);
        // updateButton.appendChild(updateIco);
        // inseminationApplyButton.appendChild(inseminationApplyIco);

        // console.log(heifer.lastBirthDate)

        heiferId.textContent = heifer.Id;
        number.textContent = count.toString() + "-)";
        earringNo.textContent = heifer.EarringNo;
        name.textContent = heifer.Name;
        lastBirth.textContent = new Date(heifer.LastBirthDate).toLocaleDateString("tr-TR");
        tempDays.textContent = calculateDate(heifer.LastBirthDate);

        // Row color based on empty days
        tableRow.className = "bg-blue-200 hover:bg-blue-300 transition-colors";
        if (
            calculateDate(heifer.LastBirthDate) >= 40 &&
            calculateDate(heifer.LastBirthDate) < 60
        ) {
            tableRow.className = "bg-yellow-200 hover:bg-yellow-300 transition-colors";
        } else if (calculateDate(heifer.LastBirthDate) >= 60) {
            tableRow.className = "bg-red-200 hover:bg-red-300 transition-colors";
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