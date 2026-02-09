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
                    
                    <h2 class="mb-4 text-center text-2xl font-bold flex items-center justify-center h-12" id="titleCow"></h2>
                </div>
                <div class="shadow-lg rounded-lg">
                    <table class="min-w-full bg-white">
                        <thead class="bg-gray-800 text-white">
                            <tr class="sticky top-0 z-10 bg-gray-800">
                                <th class="px-2 py-3 text-center font-semibold text-sm">Sayı</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('EarringNo')">Küpe Numarası <span id="sort-icon-EarringNo">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('Name')">İnek Adı <span id="sort-icon-Name">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('Breed')">İnek Cinsi <span id="sort-icon-Breed">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('InseminationDate')">Tohumlama Tarihi <span id="sort-icon-InseminationDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('InseminationDate')">Doğuracağı Tarih <span id="sort-icon-InseminationDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('InseminationDate')">Doğuma Kalan Gün <span id="sort-icon-InseminationDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('InseminationDate')">Hamile Günü <span id="sort-icon-InseminationDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('InseminationDate')">Kuruya Çıkartma Tarihi <span id="sort-icon-InseminationDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('BullName')">Dana Adı <span id="sort-icon-BullName">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('CheckedDate')">Gebelik Kontrol <span id="sort-icon-CheckedDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('LastBirthDate')">Son Doğurduğu Tarih <span id="sort-icon-LastBirthDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('LastBirthDate')">Boş Gün <span id="sort-icon-LastBirthDate">↕</span></th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Notlar</th>
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
            <button title="Yeni Hayvan Ekleme sayfasına yönlendirir" class="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 mb-3 fixed bottom-5 right-32 z-50 shadow-lg transition-colors" id="btn-add-cow">
                Yeni Hayvan Ekle
                    <div class="help-bubble -top-[4px] -left-[90px] transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Yeni hayvan ekleme sayfası</span>
                        <div class="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-gray-800"></div>
                    </div>
            </button>
            <button title="Ana menüye yönlendirir" class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-3 fixed bottom-5 right-2 z-50 shadow-lg transition-colors" id="btn-menu">
                Ana Menü
                    <div class="help-bubble -top-10 left-1/3 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Ana Menüye döndürür</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
            </button>
        </div>
        
        <div id="dateModal" class="hidden fixed inset-0 bg-opacity-50 z-80">
            <div class="bg-white my-24 mx-auto p-5 rounded-lg w-80 shadow-lg">
                <div class="mb-4 text-lg font-bold">
                    Tarih Seçimi
                </div>
                <div class="mb-5">
                    <p class="mb-3">Lütfen bir tarih seçiniz:</p>
                    <input type="date" id="dateInput" class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

const cowsBody = document.getElementById("cowsBody");
let currentAnimalsData = [];
let allDatas = [];
let sortConfig = { key: "Type", direction: "desc"}

// cows.js içerisinde veriyi karşılarken
window.animalsAPI.receiveDatas((receivedDatas) => {
    allDatas = receivedDatas;
    showDatas(allDatas); 
});

// After update database, refresh the table.
window.electronAPI.refresh((receivedDatas) => {
    allDatas = receivedDatas;
    showDatas(datas);
});

window.electronAPI.updateAvailable((event, version) => {
    const result = window.confirm(
        `Yeni güncelleme var!\nVersiyon: ${version}\nŞimdi güncellensin mi?`
    );
    if (result) {
        window.electronAPI.updateResponse(true);
        window.confirm(
            "Bu işlem birkaç dakika kadar sürebilir. Uygulama güncellendikten sonra kapanacak ve güncelleme otomatik olarak yüklenecektir.\nLütfen uygulamayı kapatmayın!"
        );
    } else {
        window.electronAPI.updateResponse(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "F1") {
        const helpBubbles = document.querySelectorAll(".help-bubble");
        helpBubbles.forEach((bubble) => {
            bubble.classList.toggle("visible");
        });
    }
});

function showDatas(allDatas) {
    // currentAnimalsData = allDatas.animalDatas; // Veriyi globale al
    currentAnimalsData = allDatas.animalDatas;
    cowsBody.innerHTML = layout; // Ana iskeleti kur
    
    // Başlangıç ayarlarını yap (buton event listener'lar vs. senin mevcut kodun)
    setupEventListeners(allDatas);
    
    // Verileri tabloya bas
    renderTableOnly(currentAnimalsData);
}

function setupEventListeners(allDatas) {
    const menuButton = document.getElementById("btn-menu");
    const titleCow = document.getElementById("titleCow");
    const addCowButton = document.getElementById("btn-add-cow");
    const cowTableBody = document.getElementById("cowTableBody");
    const excelBtn = document.getElementById("excelBtn");

    // If showInformationButton is false, Hidden the button.
    const infoBtn = document.getElementById("infoBtn");
    if (!allDatas.settingsDatas.showInformationButton) {
        infoBtn.classList += " hidden";
    }

    infoBtn.addEventListener("click", () => {
        const helpBubbles = document.querySelectorAll(".help-bubble");
        helpBubbles.forEach((bubble) => {
            bubble.classList.toggle("visible");
        });
    });

    // To open main menu.
    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
    });

    // To open add cow menu.
    addCowButton.addEventListener("click", () => {
        let animalType = "cow";
        window.electronAPI.openAddAnimalMenu(animalType);
    });

    excelBtn.addEventListener("click", () => {
        const tableData = getCowsTableData();
        const response = window.electronAPI.exportExcel({
            tableData: tableData,
            fileName: "İnekler",
        });

        if (response == false) {
            window.confirm(
                "İşlem sırasında bir hata meydana geldi, tekrar deneyiniz!"
            );
        } else {
            window.confirm(
                "Dosya başarıyla ",
                response,
                " konumuna oluşturuldu!"
            );
        }
    });

    cowTableBody.addEventListener("click", async function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
        let cowId = tableRow.dataset.cowId;

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            let datas = {
                animalId: cowId,
                type: "cow",
                earringNo: earringNo.textContent,
            };
            window.electronAPI.openAnimalDetail(datas);
        } else if (target.id === "updateIco") {
            datas = {
                animalId: cowId,
                type: "cow",
                earringNo: earringNo.textContent,
            };
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
                    animalId: cowId,
                    Type: "cow",
                    pageName: "cows",
                };
                window.electronAPI.removeAnimal(datas);
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        } else if (target.id === "applyIco") {
            try {
                const selectedDate = await openDateModal();

                window.electronAPI.gaveBirth({
                    animalId: cowId,
                    date: selectedDate,
                });

                window.confirm(
                    "İnek başarıyla düve statüsüne geçirildi ve doğum yaptı olarak kaydedildi!\nLütfen doğuran inek için buzağı ekleme işlemini yapınız!"
                );
                window.electronAPI.openAddAnimalMenu(selectedDate);
                window.electronAPI.refresh((datas) => {
                    showDatas(datas);
                });
            } catch (error) {
                console.log(error);
                if (error === "cancelled") {
                    console.log("İşlem iptal edildi.");
                }
            }
        }
    });

}

function renderTableOnly(dataList) {
    cowTableBody.innerHTML = "";

    console.log("1: ", dataList)

    let count = 1;
    dataList.forEach((animal) => {
        let tableRow = document.createElement("tr");
        // tableRow.dataset.cowId = animal.Id;
        let cowNumber = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let breed = document.createElement("td");
        let inseminationDate = document.createElement("td");
        let whenBirth = document.createElement("td");
        let leftDay = document.createElement("td");
        let passDay = document.createElement("td");
        let kuruDate = document.createElement("td");
        let bullName = document.createElement("td");
        let isPregnant = document.createElement("td");
        let lastBirthDate = document.createElement("td");
        let emptyDay = document.createElement("td");
        let notes = document.createElement("td");

        // Base styling for all cells
        const cellClasses =
            "px-2 py-3 text-center font-bold whitespace-nowrap border-b border-gray-200";
        cowNumber.className = cellClasses;
        earringNo.className = cellClasses;
        name.className = cellClasses;
        breed.className = cellClasses;
        inseminationDate.className = cellClasses;
        whenBirth.className = cellClasses;
        leftDay.className = cellClasses;
        passDay.className = cellClasses;
        kuruDate.className = cellClasses;
        bullName.className = cellClasses;
        isPregnant.className = cellClasses;
        lastBirthDate.className = cellClasses;
        emptyDay.className = cellClasses;
        notes.className =
            "px-4 py-3 text-center font-bold overflow-y-auto scrollbar-thin";

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let applyButton = document.createElement("button");

        nav.className = cellClasses;
        navDiv.className = "flex justify-center gap-1";
        deleteButton.className =
            "cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        infoButton.className =
            "cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        updateButton.className =
            "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        applyButton.className =
            "cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        
        deleteButton.innerHTML = `<svg id="deleteIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="deleteIco" stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        infoButton.innerHTML = `<svg id="infoIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="infoIco" stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
        updateButton.innerHTML = `<svg id="updateIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="updateIco" stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
        applyButton.innerHTML = `<svg id="applyIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="applyIco" stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" /></svg>`;

        deleteButton.title = "Hayvanı Sil";
        infoButton.title = "Hayvan Bilgisini Göster";
        updateButton.title = "Hayvanı Güncelle";
        applyButton.title = "Doğurdu Olarak İşaretle";

        nav.appendChild(navDiv);
        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        navDiv.appendChild(applyButton);

        cowTableBody.appendChild(tableRow);
        tableRow.appendChild(cowNumber);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(breed);
        tableRow.appendChild(inseminationDate);
        tableRow.appendChild(whenBirth);
        tableRow.appendChild(leftDay);
        tableRow.appendChild(passDay);
        tableRow.appendChild(kuruDate);
        tableRow.appendChild(bullName);
        tableRow.appendChild(isPregnant);
        tableRow.appendChild(lastBirthDate);
        tableRow.appendChild(emptyDay);
        tableRow.appendChild(notes);
        tableRow.appendChild(nav);

        // ID'ler
        earringNo.id = "earringNo";
        cowNumber.id = "cowNumber";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        applyButton.id = "applyIco";

        // Dataset
        tableRow.dataset.cowId = animal.Id;

        // Temel veriler
        cowNumber.textContent = count.toString() + "-)";
        earringNo.textContent = animal.EarringNo;
        name.textContent = animal.Name;
        breed.textContent = animal.Animals.Breed;
        
        lastBirthDate.textContent =
            animal.LastBirthDate !== null
                ? new Date(animal.LastBirthDate).toLocaleDateString("tr-TR")
                : "-";
        
        emptyDay.textContent =
            animal.LastBirthDate !== null
                ? Math.floor(
                      (new Date(animal.InseminationDate) -
                          new Date(animal.LastBirthDate)) /
                          (1000 * 60 * 60 * 24)
                  )
                : "-";

        inseminationDate.textContent = new Date(
            animal.InseminationDate
        ).toLocaleDateString("tr-TR");

        // **HESAPLANAN ALANLAR - BURADA EKSİKTİ!**
        whenBirth.textContent = calculateWhenBirth({
            InseminationDate: animal.InseminationDate,
            gestationDays: allDatas.settingsDatas.gestationDays,
        });
        
        leftDay.textContent = calculateLeftDay({
            InseminationDate: animal.InseminationDate,
            gestationDays: allDatas.settingsDatas.gestationDays,
        });
        
        passDay.textContent = calculatePassDay(animal.InseminationDate);
        
        kuruDate.textContent = calculateDryDate({
            InseminationDate: animal.InseminationDate,
            dryOffDays: allDatas.settingsDatas.dryOffDays,
        });
        
        bullName.textContent = animal.BullName;
        notes.textContent = animal.Animals.Note;

        if (
            new Date(animal.CheckedDate).toLocaleDateString("tr-TR") !=
            "01.01.1970"
        ) {
            isPregnant.textContent = new Date(
                animal.CheckedDate
            ).toLocaleDateString("tr-TR");
        }

        // Satır renklendirme
        const intLeftDay = parseInt(calculateLeftDay({
            InseminationDate: animal.InseminationDate,
            gestationDays: allDatas.settingsDatas.gestationDays,
        }));
        
        if (intLeftDay <= 30 && intLeftDay > 0) {
            tableRow.className =
                "bg-green-300 hover:bg-green-400 transition-colors";
        } else if (intLeftDay <= 0) {
            tableRow.className =
                "bg-red-300 hover:bg-red-400 transition-colors";
        } else if (intLeftDay <= 80 && intLeftDay > 30) {
            tableRow.className =
                "bg-yellow-300 hover:bg-yellow-400 transition-colors";
        } else {
            tableRow.className =
                "bg-blue-300 hover:bg-blue-400 transition-colors";
        }
        
        count += 1;
    });

    titleCow.textContent =
        "Listede toplam " + (count - 1).toString() + " adet inek var.";
}


function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

// Calculate dates.
function calculateWhenBirth(datas) {
    let date = new Date(datas.InseminationDate);
    date.setDate(date.getDate() + parseInt(datas.gestationDays));

    return date.toLocaleDateString("tr-TR");
}

function calculateDryDate(datas) {
    let date = new Date(datas.InseminationDate);
    date.setDate(date.getDate() + parseInt(datas.dryOffDays));

    return date.toLocaleDateString("tr-TR");
}

function calculateLeftDay(datas) {
    let today = getTodayDate();
    let date = new Date(datas.InseminationDate);
    date.setDate(date.getDate() + parseInt(datas.gestationDays));

    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function calculatePassDay(inseminationDate) {
    let today = getTodayDate();
    let date = new Date(inseminationDate);

    return Math.ceil((today - date) / (1000 * 60 * 60 * 24));
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

function getCowsTableData() {
    const tableHead = document.querySelector("thead tr");
    const tableBody = document.querySelector("#cowTableBody");

    // TH'leri al, ilk ve sonuncuyu çıkar (Id + İşlemler)
    const headers = Array.from(tableHead.querySelectorAll("th"))
        .slice(1, -1)
        .map((th) => th.innerText.trim());

    // TR'leri dolaş
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    return rows.map((row) => {
        const cells = Array.from(row.querySelectorAll("td"))
            .slice(1, -1) // Id ve İşlemler kolonunu çıkar
            .map((cell) => cell.innerText.trim());

        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = cells[i] || "";
        });

        return obj;
    });
}

function handleSort(key) {
    // 1. Sıralama yönünü belirle
    let direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    sortConfig = { key, direction };

    // 2. İkonları güncelle
    updateSortIcons(key, direction);

    currentAnimalsData.sort((a, b) => {
        // İç içe alanlara erişim
        let valA, valB;
        
        if (key === 'Breed') {
            valA = a.Animals?.Breed;
            valB = b.Animals?.Breed;
        } else if (key === 'Name') {
            valA = a.Name;
            valB = b.Name;
        } else {
            valA = a[key];
            valB = b[key];
        }

        // Boş değerleri her zaman sonda tutmak için
        if (valA === null || valA === undefined || valA === "") return 1;
        if (valB === null || valB === undefined || valB === "") return -1;

        // --- A. TARİH SIRALAMASI ---
        const dateKeys = ['InseminationDate', 'CalculatedDueDate', 'DryOffDate', 'CheckedDate', 'LastBirthDate'];
        if (dateKeys.includes(key)) {
            let dateA = new Date(valA);
            let dateB = new Date(valB);
            return direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // --- B. SAYISAL SIRALAMA ---
        const numericKeys = ['CalculatedDaysLeft', 'CalculatedPregnancyDay', 'EmptyDays'];
        if (numericKeys.includes(key)) {
            return direction === 'asc' ? valA - valB : valB - valA;
        }

        // --- C. METİNSEL SIRALAMA (Türkçe Duyarlı) ---
        let compareResult = String(valA).localeCompare(String(valB), 'tr', { 
            sensitivity: 'accent', 
            numeric: true
        });
        
        return direction === 'asc' ? compareResult : -compareResult;
    });

    renderTableOnly(currentAnimalsData);
}

// Görsel geri bildirim için yardımcı fonksiyon
function updateSortIcons(activeKey, direction) {
    // Tüm ikonları sıfırla
    document.querySelectorAll('[id^="sort-icon-"]').forEach(span => span.innerText = '↕');
    // Aktif olanı güncelle
    const activeIcon = document.getElementById(`sort-icon-${activeKey}`);
    if (activeIcon) {
        activeIcon.innerText = direction === 'asc' ? '↑' : '↓';
    }
}

window.handleSort = handleSort;