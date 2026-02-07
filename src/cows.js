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
                                <th class="px-2 py-3 text-center font-semibold text-sm">Id</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Küpe Numarası</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">İnek Adı</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">İnek Cinsi</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Tohumlama Tarihi</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Doğuracağı Tarih *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Doğuma Kalan Gün *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Hamile Günü *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Kuruya Çıkartma Tarihi *</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Dana Adı</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Gebelik Kontrol</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Son Doğurduğu Tarih</th>
                                <th class="px-2 py-3 text-center font-semibold text-sm">Boş Gün</th>
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

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    cowsBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((allDatas) => {
        // console.log(allDatas);
        showDatas(allDatas);
    });
});

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
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

// Datas will be show the user.
function showDatas(allDatas) {
    cowsBody.innerHTML = layout;

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
        let cowId = tableRow.querySelector("#cowId");

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            let datas = {
                animalId: cowId.textContent,
                type: "cow",
                earringNo: earringNo.textContent,
            };
            window.electronAPI.openAnimalDetail(datas);
        } else if (target.id === "updateIco") {
            datas = {
                animalId: cowId.textContent,
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
            try {
                const selectedDate = await openDateModal();

                window.electronAPI.gaveBirth({
                    animalId: cowId.textContent,
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

    let count = 1;
    allDatas.animalDatas.forEach((animal) => {
        let tableRow = document.createElement("tr");
        let cowId = document.createElement("td");
        // let number = document.createElement("td");
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
        cowId.className = cellClasses;
        // number.className = cellClasses;
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
        // let deleteIco = document.createElement("i");
        // let infoIco = document.createElement("i");
        // let updateIco = document.createElement("i");
        // let applyIco = document.createElement("i");

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
        // tableRow.appendChild(number);
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
        // number.textContent = count.toString() + "-)";
        earringNo.textContent = animal.EarringNo;
        // console.log(animal)
        // console.log(animal.Name)
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

        whenBirth.textContent = calculateWhenBirth({
            InseminationDate: animal.InseminationDate,
            gestationDays: allDatas.settingsDatas.gestationDays,
        });
        leftDay.textContent = calculateLeftDay({
            InseminationDate: animal.InseminationDate,
            gestationDays: allDatas.settingsDatas.gestationDays,
        }); // ***
        passDay.textContent = calculatePassDay(animal.InseminationDate);
        kuruDate.textContent = calculateDryDate({
            InseminationDate: animal.InseminationDate,
            dryOffDays: allDatas.settingsDatas.dryOffDays,
        }); // ***
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

        // Row color based on days left for birth
        const intLeftDay = parseInt(calculateLeftDay({
            InseminationDate: animal.InseminationDate,
            gestationDays: allDatas.settingsDatas.gestationDays,
        }));
        if (intLeftDay <= 30 && intLeftDay > 0) {
            tableRow.className =
                "bg-green-200 hover:bg-green-300 transition-colors";
        } else if (intLeftDay <= 0) {
            tableRow.className =
                "bg-red-200 hover:bg-red-300 transition-colors";
        } else if (intLeftDay <= 80 && intLeftDay > 30) {
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
function calculateWhenBirth(datas) {
    let date = new Date(datas.InseminationDate);
    date.setDate(date.getDate() + parseInt(datas.gestationDays));

    // console.log("calculateWhenBirth: ",date.toLocaleDateString("tr-TR"));
    return date.toLocaleDateString("tr-TR");
}

function calculateDryDate(datas) {
    let date = new Date(datas.InseminationDate);
    date.setDate(date.getDate() + parseInt(datas.dryOffDays));

    // console.log("calculateDryDate: ", date.toLocaleDateString("tr-TR"));
    return date.toLocaleDateString("tr-TR");
}

function calculateLeftDay(datas) {
    let today = getTodayDate();
    let date = new Date(datas.InseminationDate);
    date.setDate(date.getDate() + parseInt(datas.gestationDays));

    // console.log("calculateLeftDay: ",Math.ceil((date - today) / (1000 * 60 * 60 * 24)));
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function calculatePassDay(inseminationDate) {
    let today = getTodayDate();
    let date = new Date(inseminationDate);

    // console.log("calculatePassDay: ",Math.ceil((today - date) / (1000 * 60 * 60 * 24)));
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
