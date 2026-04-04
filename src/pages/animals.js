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
                
                <h2 class="mb-4 text-center text-2xl font-bold flex items-center justify-center h-12" id="titleAnimal"></h2>
            </div>
            <div class="shadow-lg rounded-lg">
                <table class="min-w-full bg-white rounded*lg">
                    <thead class="bg-gray-800 text-white">
                        <tr class="sticky top-0 z-10 bg-gray-800">
                            <th class="px-4 py-3 text-center font-semibold">Sayı</th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('EarringNo')">Küpe Numarası <span id="sort-icon-EarringNo">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('Name')">Hayvan Adı <span id="sort-icon-Name">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('BirthDate')">Doğum Tarihi <span id="sort-icon-BirthDate">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('Breed')">Cinsi <span id="sort-icon-Breed">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('Type')">Türü <span id="sort-icon-Type">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('MotherEarringNo')">Anne Küpe No <span id="sort-icon-MotherEarringNo">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-gray-700 transition-colors" onclick="handleSort('MotherName')">Anne Adı <span id="sort-icon-MotherName">↕</span></th>
                            <th class="px-4 py-3 text-center font-semibold">Not</th>
                            <th class="px-4 py-3 text-center font-semibold">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="animalTableBody" class="divide-y divide-gray-200">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-right mt-3">
            <button title="Hayvan ekleme sayfasına yönlendirir" class="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 mb-3 fixed bottom-5 right-32 z-50 shadow-lg transition-colors" id="btn-add-animal">
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
    <!-- Modal (Popup) -->
            <div id="trashModal" class="hidden fixed inset-0 bg-white/30 backdrop-blur-sm items-center justify-center z-50">
        <div id="trashModalPanel" class="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md mx-4 shadow-xl opacity-0 scale-95 transition-all duration-200 ease-out">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </div>
                <div>
                    <p class="font-bold text-gray-800 text-base">Çöp kutusuna taşı</p>
                    <p class="text-sm text-gray-500">Lütfen aşağıdaki bilgileri doldurun</p>
                </div>
            </div>
            <div class="border-t border-gray-200 pt-5 flex flex-col gap-4 mb-5">
                <div>
                    <label class="block text-sm text-gray-500 mb-1.5">Sürüden Ayrılma Tarihi</label>
                    <input type="date" id="deathDateInput"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"/>
                </div>
                <div>
                    <label class="block text-sm text-gray-500 mb-1.5">Neden</label>
                    <input type="text" id="reasonInput" placeholder="Örn: Hastalık, kaza..."
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"/>
                </div>
            </div>
            <div class="flex justify-end gap-3">
                <button id="cancelTrashBtn"
                    class="bg-gray-100 hover:cursor-pointer hover:bg-gray-200 text-gray-700 font-bold py-2 px-5 rounded-lg transition duration-200">
                    İptal
                </button>
                <button id="confirmTrashBtn"
                    class="bg-red-600 hover:cursor-pointer hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition duration-200">
                    Çöp kutusuna taşı
                </button>
            </div>
        </div>
    </div>

`;

let currentAnimalId = null;
let currentType = null;
let animalsData = [];
let sortConfig = { key: "Type", direction: "desc"}
const animalsBody = document.getElementById("animalsBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    animalsBody.innerHTML = loadingTemplate;
});

window.animalsAPI.receiveDatas((allDatas) => {
    console.log("receiveDatas çalıştı.")
    showDatas(allDatas);
});

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
    console.log("refresh çalıştı animaljs.")
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
    console.log("showDatas çağırıldı");
    currentAnimalsData = allDatas.animalDatas; // Veriyi globale al
    animalsBody.innerHTML = layout; // Ana iskeleti kur
    
    // Başlangıç ayarlarını yap (buton event listener'lar vs. senin mevcut kodun)
    setupEventListeners(allDatas); 

    // Verileri tabloya bas
    renderTableOnly(currentAnimalsData);
}

function setupEventListeners(allDatas) {
    const menuButton = document.getElementById("btn-menu");
    const titleAnimal = document.getElementById("titleAnimal");
    const animalTableBody = document.getElementById("animalTableBody");
    const addAnimalButton = document.getElementById("btn-add-animal");
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

    addAnimalButton.addEventListener("click", () => {
        window.electronAPI.openAddAnimalMenu("none");
    });

    excelBtn.addEventListener("click", () => {
        const tableData = getAnimalsTableData();
        const response = window.electronAPI.exportExcel({ tableData: tableData, fileName: "Tüm Hayvanlar" });

        if(response == false) {
            window.confirm("İşlem sırasında bir hata meydana geldi, tekrar deneyiniz!");
        }
        else {
            window.confirm("Dosya başarıyla ", response, " konumuna oluşturuldu!");
        }
    });

    animalTableBody.addEventListener("click", async function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
        let animalId = tableRow.dataset.animalId;
        let calfName = tableRow.querySelector("#calfName");
        let type = tableRow.querySelector("#type");

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            if (type.textContent == "İnek") {
                var datas = { animalId: animalId, type: "cow", earringNo: earringNo.textContent };
            } else if (type.textContent == "Düve") {
                var datas = { animalId: animalId, type: "heifer", earringNo: earringNo.textContent};
            } else if (type.textContent == "Buzağı") {
                var datas = { animalId: animalId, type: "calf", earringNo: earringNo.textContent };
            } else if (type.textContent == "Dana") {
                var datas = { animalId: animalId, type: "bull", earringNo: earringNo.textContent };
            }
            window.electronAPI.openAnimalDetail(datas);
        } else if (target.id === "updateIco") {
            // infoButtonClick(earringNo.textContent);
            if (type.textContent == "İnek") {
                var datas = { animalId: animalId, type: "cow", earringNo: earringNo.textContent };
            } else if (type.textContent == "Düve") {
                var datas = { animalId: animalId, type: "heifer", earringNo: earringNo.textContent };
            } else if (type.textContent == "Buzağı") {
                var datas = { animalId: animalId, type: "calf", earringNo: earringNo.textContent };
            } else if (type.textContent == "Dana") {
                var datas = { animalId: animalId, type: "bull", earringNo: earringNo.textContent };
            }
            window.electronAPI.openUpdateAnimal(datas);
        } 
        // else if (target.id === "deleteIco") {
        //     const sure = window.confirm(
        //         "Şu küpe numaralı hayvan silinecek: " +
        //             earringNo.textContent +
        //             "\nOnaylıyor musunuz?"
        //     );
        //     if (sure) {
        //         // Remove cow from the databases.
        //         const datas = {
        //             animalId: animalId,
        //             pageName: "animals",
        //             online: navigator.onLine
        //         };
        //         if (type.textContent === "İnek") {
        //             datas.Type = "cow";
        //         } else if (type.textContent === "Düve") {
        //             datas.Type = "heifer";
        //         } else if (type.textContent === "Buzağı") {
        //             datas.Type = "calf";
        //         } else if (type.textContent === "Dana") {
        //             datas.Type = "bull";
        //         }
        //         const newDatas = await window.electronAPI.removeAnimal(datas);
        //         showDatas(newDatas);
        //     }
        // }
        else if (target.id === "deleteIco") {
            currentAnimalId = animalId;
            currentType = type;
            console.log("Delete butonuna basildi.");

            document.getElementById("deathDateInput").valueAsDate = new Date();
            openTrashModal();


        }
    });

    const cancelBtn = document.getElementById("cancelTrashBtn");
    const confirmBtn = document.getElementById("confirmTrashBtn");

    // Eski listener'ları temizle
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newConfirmBtn = confirmBtn.cloneNode(true);
    cancelBtn.replaceWith(newCancelBtn);
    confirmBtn.replaceWith(newConfirmBtn);

    newCancelBtn.addEventListener("click", () => {
        closeTrashModal();
    });

    newConfirmBtn.addEventListener("click", () => {
        const deathDate = document.getElementById("deathDateInput").value;
        const reason = document.getElementById("reasonInput").value.trim();

        if (!deathDate || !reason) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        const datas = {
            animalId: currentAnimalId,
            Type: currentType,
            DeathDate: deathDate,
            Reason: reason,
        };

        window.electronAPI.removeAnimal(datas);
        closeTrashModal();
    });

    // document.getElementById("cancelTrashBtn").addEventListener("click", () => {
    //     closeTrashModal();
    //     window.focus();
    // });

    // document.getElementById("confirmTrashBtn").addEventListener("click", () => {
    //     const deathDate = document.getElementById("deathDateInput").value;
    //     const reason = document.getElementById("reasonInput").value.trim();

    //     if (!deathDate || !reason) {
    //         alert("Lütfen tüm alanları doldurun.");
    //         return;
    //     }

    //     const datas = {
    //         animalId: currentAnimalId,
    //         Type: currentType,
    //         DeathDate: deathDate,
    //         Reason: reason,
    //     };

    //     window.electronAPI.removeAnimal(datas);
    //     closeTrashModal();
    //     window.focus();
    // });
}

function renderTableOnly(dataList) {
    animalTableBody.innerHTML = "";

    let count = 1;
    dataList.forEach((animal) => {
        let tableRow = document.createElement("tr");
        tableRow.dataset.animalId = animal.Id;
        let animalNumber = document.createElement("td");
        // let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let birthDate = document.createElement("td");
        let breed = document.createElement("td");
        let type = document.createElement("td");
        let motherEarringNo = document.createElement("td");
        let motherName = document.createElement("td");
        let notes = document.createElement("td");

        // Base styling for all cells
        const cellClasses = "px-4 py-3 text-center font-bold whitespace-nowrap";
        animalNumber.className = cellClasses;
        // number.className = cellClasses;
        earringNo.className = cellClasses;
        name.className = cellClasses;
        birthDate.className = cellClasses;
        breed.className = cellClasses;
        type.className = cellClasses;
        motherEarringNo.className = cellClasses;
        motherName.className = cellClasses;
        // notes.className = "max-h-20 overflow-y-auto font-bold px-4";
        notes.className = "px-4 py-3 text-center font-bold overflow-y-auto scrollbar-thin";

        // Create buttons for each row.
        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        // let deleteIco = document.createElement("i");
        // let infoIco = document.createElement("i");
        // let updateIco = document.createElement("i");

        // Button styles.
        nav.className = cellClasses;
        navDiv.className = "flex justify-center gap-1";
        deleteButton.className =
            "cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors";
        infoButton.className =
            "cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors";
        updateButton.className =
            "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors";
        deleteButton.innerHTML = `<svg id="deleteIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="deleteIco" stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        infoButton.innerHTML = `<svg id="infoIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="infoIco" stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
        updateButton.innerHTML = `<svg id="updateIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="updateIco" stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;

        deleteButton.title = "Hayvanı veritabanından siler";
        infoButton.title = "Hayvan Bilgi sayfasına yönlendirir";
        updateButton.title = "Hayvan Güncelleme sayfasına yönlendirir";

        // deleteIco.className = "bi bi-trash";
        // infoIco.className = "bi bi-info-circle-fill";
        // updateIco.className = "bi bi-arrow-up-square-fill";

        // deleteIco.title = "Hayvanı Sil";
        // infoIco.title = "Hayvan Bilgisini Göster";
        // updateIco.title = "Hayvanı Güncelle";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);

        // deleteButton.appendChild(deleteIco);
        // infoButton.appendChild(infoIco);
        // updateButton.appendChild(updateIco);

        animalTableBody.appendChild(tableRow);
        tableRow.appendChild(animalNumber);
        // tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(birthDate);
        tableRow.appendChild(breed);
        tableRow.appendChild(type);
        tableRow.appendChild(motherEarringNo);
        tableRow.appendChild(motherName);
        tableRow.appendChild(notes);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";
        animalNumber.id = "animalNumber";
        breed.id = "breed";
        type.id = "type";
        name.id = "calfName";
        notes.id = "notes";

        // deleteIco.id = "deleteIco";
        // infoIco.id = "infoIco";
        // updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";

        animalNumber.textContent = count.toString() + "-)";
        // number.textContent = count.toString() + "-)";
        earringNo.textContent = animal.EarringNo;
        name.textContent = animal.Name;
        birthDate.textContent = new Date(animal.BirthDate).toLocaleDateString(
            "tr-TR"
        );
        if (animal.Breed === "Simmental") {
            breed.textContent = "Simental";
        } else if (animal.Breed === "Angus") {
            breed.textContent = "Angus";
        } else {
            breed.textContent = animal.Breed;
        }    

        if (animal.Type === "cow") {
            type.textContent = "İnek";
        } else if (animal.Type === "heifer") {
            type.textContent = "Düve";
        } else if (animal.Type === "bull") {
            type.textContent = "Dana";
        } else if (animal.Type === "calf") {
            type.textContent = "Buzağı";
        }

        motherEarringNo.textContent = animal.MotherEarringNo;
        motherName.textContent = animal.MotherName;

        notes.textContent = animal.Note;

        // Row color based on animal type
        tableRow.className = "bg-blue-400 hover:bg-blue-500 transition-colors";
        if (animal.Type === "cow") {
            tableRow.className =
                "bg-green-400 hover:bg-green-500 transition-colors";
        } else if (animal.Type === "heifer") {
            tableRow.className =
                "bg-red-400 hover:bg-red-500 transition-colors";
        } else if (animal.Type === "calf") {
            tableRow.className =
                "bg-yellow-400 hover:bg-yellow-500 transition-colors";
        }
        count++;
    });
    titleAnimal.textContent = "Toplam " + (count - 1).toString() + " hayvan var!";
    updateSortIcons();
}

function handleSort(key) {
    let direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    sortConfig = { key, direction };

    currentAnimalsData.sort((a, b) => {
        let valA = a[key] ?? "";
        let valB = b[key] ?? "";

        // 1. Sayısal ve Tarihsel Sıralama (Id ve BirthDate)
        if (key === 'BirthDate') {
            let numA = (key === 'BirthDate') ? new Date(valA).getTime() : parseFloat(valA);
            let numB = (key === 'BirthDate') ? new Date(valB).getTime() : parseFloat(valB);
            
            if (numA < numB) return direction === 'asc' ? -1 : 1;
            if (numA > numB) return direction === 'asc' ? 1 : -1;
            return 0;
        } 

        // 2. Metinsel Sıralama (Name, Type, Breed, vs.)
        // Türkçe karakter desteği ve harf duyarlılığı için localeCompare
        let compareResult = String(valA).localeCompare(String(valB), 'tr', { sensitivity: 'base' });
        
        return direction === 'asc' ? compareResult : -compareResult;
    });

    renderTableOnly(currentAnimalsData);
}

function updateSortIcons() {
    // Tüm ikonları sıfırla
    const icons = ['EarringNo', 'Name', 'BirthDate', 'Type', 'Breed', 'MotherEarringNo', 'MotherName'].forEach(key => {
        const el = document.getElementById(`sort-icon-${key}`);
        if (el) el.innerText = ' ↕';
    });

    // Aktif olanı güncelle
    const activeIcon = document.getElementById(`sort-icon-${sortConfig.key}`);
    if (activeIcon) {
        activeIcon.innerText = sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
}


// NEW
function openTrashModal() {
    trashModal.classList.remove("hidden");
    trashModal.classList.add("flex");
    requestAnimationFrame(() => {
        trashModalPanel.classList.remove("opacity-0", "scale-95");
        trashModalPanel.classList.add("opacity-100", "scale-100");
    });
}

function closeTrashModal() {
    trashModalPanel.classList.remove("opacity-100", "scale-100");
    trashModalPanel.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
        trashModal.classList.remove("flex");
        trashModal.classList.add("hidden");
        document.getElementById("deathDateInput").value = "";
        document.getElementById("reasonInput").value = "";
    }, 200);
}
// NEW


window.handleSort = handleSort;