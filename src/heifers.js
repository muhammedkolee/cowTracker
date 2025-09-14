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
                    <!-- Başlık, Bilgi ve Excel Butonu Sarmalayıcısı -->
                    <div class="relative mb-4">
                        <!-- Excel Butonu - Sağ Üst Köşe -->
                        <button 
                            id="excelBtn"
                            class="group bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-start w-12 h-12 hover:w-48 hover:rounded-full overflow-hidden cursor-pointer absolute top-0 right-0 z-50"
                            title="Tabloyu Excel'e aktarır">
                            <svg class="w-6 h-6 ml-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                <path d="M12.5,14.5L13.5,16H15L13,12.5L15,9H13.5L12.5,10.5L11.5,9H10L12,12.5L10,16H11.5L12.5,14.5Z"/>
                            </svg>
                            <span class="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-semibold">Excel Tablosuna Çevir</span>
                        </button>
                    
                        <!-- Bilgi Butonu (Excel butonuyla aynı hizada) -->
                        <button 
                            id="infoBtn" 
                            class="cursor-pointer absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        
                        <h2 class="mb-4 text-center text-2xl font-bold flex items-center justify-center h-12" id="titleHeifer"></h2>
                    </div>
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
                    <button class="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 mb-3 fixed bottom-5 right-32 z-50 shadow-lg transition-colors" id="btn-add-heifer">
                        Yeni Hayvan Ekle
                            <div class="help-bubble -top-[4px] -left-[90px] transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                                <span class="block">Yeni hayvan ekleme sayfası</span>
                                <div class="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-gray-800"></div>
                            </div>
                    </button>
                    <button class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-3 fixed bottom-5 right-2 z-50 shadow-lg transition-colors" id="btn-menu">
                        Ana Menü
                            <div class="help-bubble -top-10 left-1/3 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                                <span class="block">Ana Menüye döndürür</span>
                                <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                            </div>
                    </button>
                </div>

                <div id="dateModal" class="hidden fixed inset-0 bg-opacity-50 z-80">
                    <div class="bg-white my-24 mx-auto p-5 rounded-lg w-80 shadow-lg">
                        <div class="mb-2 text-lg font-bold">
                            Tohumlama Tarihi
                        </div>
                        <div class="mb-5">
                            <p class="mb-3">Lütfen tohumlanma tarihi seçin:</p>
                            <input type="date" id="dateInput" class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <div class="mb-2 text-lg font-bold">
                            Dana İsmi
                        </div>
                        <div class="mb-5">
                            <p class="mb-3">Lütfen dana ismini giriniz:</p>
                            <input type="text" id="bullName" class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div class="flex justify-end gap-2">
                            <button title="İşlemi iptal eder" id="cancelBtn" class="cursor-pointer py-2 px-4 border-none rounded cursor-pointer bg-gray-500 hover:bg-gray-600 text-white transition-colors">
                                İptal
                            </button>
                            <button title="Hayvan Güncellenir" id="confirmBtn" class="cursor-pointer py-2 px-4 border-none rounded cursor-pointer bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                                Tamam
                            </button>
                        </div>
                    </div>
                </div>
        `;

const heifersBody = document.getElementById("heifersBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    heifersBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((allDatas) => {
        showDatas(allDatas);
    });
});

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
    showDatas(datas);
});

window.electronAPI.updateAvailable((event, version) => {
    const result = window.confirm(`Yeni güncelleme var!\nVersiyon: ${version}\nŞimdi güncellensin mi?`);
    if (result) {
        window.electronAPI.updateResponse(true);
        window.confirm("Bu işlem birkaç dakika kadar sürebilir. Uygulama güncellendikten sonra kapanacak ve güncelleme otomatik olarak yüklenecektir.\nLütfen uygulamayı kapatmayın!");
    }
    else {
        window.electronAPI.updateResponse(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "F1") {
        const helpBubbles = document.querySelectorAll('.help-bubble');
        helpBubbles.forEach(bubble => {
            bubble.classList.toggle('visible');
        });        
    }
});

function showDatas(allDatas) {
    heifersBody.innerHTML = layout;

    const menuButton = document.getElementById("btn-menu");
    const titleHeifer = document.getElementById("titleHeifer");
    const addHeiferButton = document.getElementById("btn-add-heifer");
    const heiferTableBody = document.getElementById("heiferTableBody");
    const excelBtn = document.getElementById("excelBtn");

    // If showInformationButton is false, Hidden the button.
    const infoBtn = document.getElementById("infoBtn");
    if (!allDatas.settingsDatas.showInformationButton) {
        infoBtn.classList += " hidden";
        infoBtn.title = "Sayfa içi temel bilgileri gösterir";
    }

    infoBtn.addEventListener("click", () => {
        const helpBubbles = document.querySelectorAll('.help-bubble');
        helpBubbles.forEach(bubble => {
            bubble.classList.toggle('visible');
        });
    });

    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
    });

    addHeiferButton.addEventListener("click", () => {
        window.electronAPI.openAddAnimalMenu("heifer");
    });

    excelBtn.addEventListener("click", () => {
        const tableData = getHeifersTableData();
        const response = window.electronAPI.exportExcel({ tableData: tableData, fileName: "Düveler" });

        if(response == false) {
            window.confirm("İşlem sırasında bir hata meydana geldi, tekrar deneyiniz!");
        }
        else {
            window.confirm("Dosya başarıyla ", response, " konumuna oluşturuldu!");
        }
    });

    heiferTableBody.addEventListener("click", async function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
        let heiferId = tableRow.querySelector("#heiferId");

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            let datas = { animalId: heiferId.textContent, type: "heifer" };
            window.electronAPI.openAnimalDetail(datas);
        } else if (target.id === "updateIco") {
            datas = { animalId: heiferId.textContent, type: "heifer" };
            window.electronAPI.openUpdateAnimal(datas);
        } else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " +
                    earringNo.textContent +
                    "\nOnaylıyor musunuz?"
            );
            if (sure) {
                const datas = {
                    animalId: heiferId.textContent,
                    Type: "heifer",
                    pageName: "heifers",
                };
                window.electronAPI.removeAnimal(datas);
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        } else if (target.id === "inseminationApplyIco") {
            const selectedDate = await openDateModal();

            window.electronAPI.applyInsemination({
                animalId: heiferId.textContent,
                date: selectedDate,
                bullName: document.getElementById("bullName").textContent
            });

            window.confirm("Düve başarıyla tohumlandı olarak kaydedildi.");
        }
    });

    let count = 1;
    allDatas.animalDatas.forEach((heifer) => {
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
        deleteButton.className =
            "cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";
        infoButton.className =
            "cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";
        updateButton.className =
            "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";
        inseminationApplyButton.className =
            "cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors flex items-center justify-center";

        deleteButton.title = "Hayvanı Sil";
        infoButton.title = "Hayvan Bilgileri";
        updateButton.title = "Hayvanı Güncelle";
        inseminationApplyButton.title = "Tohumlandı Olarak İşaretle";

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
        lastBirth.textContent = new Date(
            heifer.LastBirthDate
        ).toLocaleDateString("tr-TR");
        tempDays.textContent = calculateDate(heifer.LastBirthDate);

        // Row color based on empty days
        tableRow.className = "bg-blue-200 hover:bg-blue-300 transition-colors";
        if (
            calculateDate(heifer.LastBirthDate) >= 40 &&
            calculateDate(heifer.LastBirthDate) < 60
        ) {
            tableRow.className =
                "bg-yellow-200 hover:bg-yellow-300 transition-colors";
        } else if (calculateDate(heifer.LastBirthDate) >= 60) {
            tableRow.className =
                "bg-red-200 hover:bg-red-300 transition-colors";
        }
        count += 1;
    });

    titleHeifer.textContent =
        "Listede toplam " + (count - 1).toString() + " adet düve var.";
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

function openDateModal() {
    const modal = document.getElementById("dateModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const dateInput = document.getElementById("dateInput");
    const result = document.getElementById("result");

    return new Promise((resolve, reject) => {
        console.log("fonskiyona girildi.");
        modal.classList.remove("hidden");
        console.log("hidden silindi.");

        // Bugünün tarihini varsayılan olarak ayarla
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;

        // Tamam butonu
        confirmBtn.onclick = () => {
            const selectedDate = dateInput.value;
            if (selectedDate) {
                modal.classList.add("hidden");
                resolve(selectedDate);
            } else {
                alert("Lütfen bir tarih seçiniz!");
            }
        };

        // İptal butonu
        cancelBtn.onclick = () => {
            modal.classList.add("hidden");
            reject("cancelled");
        };

        // Modal dışına tıklama ile kapatma
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
                reject("cancelled");
            }
        };
    });
}

function getHeifersTableData() {
    const tableHead = document.querySelector("thead tr");
    const tableBody = document.querySelector("#heiferTableBody");

    // TH'leri al, ilk ve sonuncuyu çıkar (Id + İşlemler)
    const headers = Array.from(tableHead.querySelectorAll("th"))
        .slice(1, -1)
        .map(th => th.innerText.trim());

    // TR'leri dolaş
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    return rows.map((row) => {
        const cells = Array.from(row.querySelectorAll("td"))
            .slice(1, -1) // Id ve İşlemler kolonunu çıkar
            .map(cell => cell.innerText.trim());

        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = cells[i] || "";
        });

        return obj;
    });
}