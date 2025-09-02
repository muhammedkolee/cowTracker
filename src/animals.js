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
            <!-- Başlık ve Bilgi Butonu Sarmalayıcısı -->
            <div class="relative mb-4">
                <!-- Bilgi Butonu (Başlıkla hizalı) -->
                <button id="infoBtn" class="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                    </svg>
                </button>
                <h2 class="mb-4 text-center text-2xl font-bold" id="titleAnimal"></h2>
            </div>
            <div class="shadow-lg rounded-lg">
                <table class="min-w-full bg-white">
                    <thead class="bg-gray-800 text-white">
                        <tr class="sticky top-0 z-10 bg-gray-800">
                            <th class="px-4 py-3 text-center font-semibold">Id</th>
                            <th class="px-4 py-3 text-center font-semibold">Sayı</th>
                            <th class="px-4 py-3 text-center font-semibold">Küpe Numarası</th>
                            <th class="px-4 py-3 text-center font-semibold">Hayvan Adı</th>
                            <th class="px-4 py-3 text-center font-semibold">Doğum Tarihi</th>
                            <th class="px-4 py-3 text-center font-semibold">Türü</th>
                            <th class="px-4 py-3 text-center font-semibold">Anne Küpe No</th>
                            <th class="px-4 py-3 text-center font-semibold">Anne Adı</th>
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
`;

const animalsBody = document.getElementById("animalsBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    console.log("çalıştı");
    animalsBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((allDatas) => {
        showDatas(allDatas);
    });
});

// After update database, refresh the table.
window.electronAPI.refresh((datas) => {
    showDatas(datas);
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
    animalsBody.innerHTML = layout;
    
    
    const menuButton = document.getElementById("btn-menu");
    const titleAnimal = document.getElementById("titleAnimal");
    const animalTableBody = document.getElementById("animalTableBody");
    const addAnimalButton = document.getElementById("btn-add-animal");
    
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

    animalTableBody.addEventListener("click", function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
        let animalId = tableRow.querySelector("#animalId");
        let calfName = tableRow.querySelector("#calfName");
        let type = tableRow.querySelector("#type");

        if (target.id === "infoIco") {
            // infoButtonClick(earringNo.textContent);
            if (type.textContent == "İnek") {
                var datas = { animalId: animalId.textContent, type: "cow" };
            } else if (type.textContent == "Düve") {
                var datas = { animalId: animalId.textContent, type: "heifer" };
            } else if (type.textContent == "Buzağı") {
                var datas = { animalId: animalId.textContent, type: "calf" };
            } else if (type.textContent == "Dana") {
                var datas = { animalId: animalId.textContent, type: "bull" };
            }
            window.electronAPI.openAnimalDetail(datas);
        } else if (target.id === "updateIco") {
            // infoButtonClick(earringNo.textContent);
            if (type.textContent == "İnek") {
                var datas = { animalId: animalId.textContent, type: "cow" };
            } else if (type.textContent == "Düve") {
                var datas = { animalId: animalId.textContent, type: "heifer" };
            } else if (type.textContent == "Buzağı") {
                var datas = { animalId: animalId.textContent, type: "calf" };
            } else if (type.textContent == "Dana") {
                var datas = { animalId: animalId.textContent, type: "bull" };
            }
            // console.log(datas)
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
                    animalId: animalId.textContent,
                    pageName: "animals",
                };
                if (type.textContent === "İnek") {
                    datas.Type = "cow";
                } else if (type.textContent === "Düve") {
                    datas.Type = "heifer";
                } else if (type.textContent === "Buzağı") {
                    datas.Type = "calf";
                } else if (type.textContent === "Dana") {
                    datas.Type = "bull";
                }
                window.electronAPI.removeAnimal(datas);
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        }
    });

    let count = 1;
    allDatas.animalDatas.forEach((animal) => {
        // Create table row for each animal.
        let tableRow = document.createElement("tr");
        let animalId = document.createElement("td");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let birthDate = document.createElement("td");
        let type = document.createElement("td");
        let motherEarringNo = document.createElement("td");
        let motherName = document.createElement("td");

        // Base styling for all cells
        const cellClasses = "px-4 py-3 text-center font-bold whitespace-nowrap";
        animalId.className = cellClasses;
        number.className = cellClasses;
        earringNo.className = cellClasses;
        name.className = cellClasses;
        birthDate.className = cellClasses;
        type.className = cellClasses;
        motherEarringNo.className = cellClasses;
        motherName.className = cellClasses;

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
        tableRow.appendChild(animalId);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(birthDate);
        tableRow.appendChild(type);
        tableRow.appendChild(motherEarringNo);
        tableRow.appendChild(motherName);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";
        animalId.id = "animalId";
        type.id = "type";
        name.id = "calfName";

        // deleteIco.id = "deleteIco";
        // infoIco.id = "infoIco";
        // updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";

        animalId.textContent = animal.Id;
        number.textContent = count.toString() + "-)";
        earringNo.textContent = animal.EarringNo;
        name.textContent = animal.Name;
        birthDate.textContent = new Date(animal.BirthDate).toLocaleDateString(
            "tr-TR"
        );
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

        // Row color based on animal type
        tableRow.className = "bg-blue-200 hover:bg-blue-300 transition-colors";
        if (animal.Type === "cow") {
            tableRow.className =
                "bg-green-200 hover:bg-green-300 transition-colors";
        } else if (animal.Type === "heifer") {
            tableRow.className =
                "bg-red-200 hover:bg-red-300 transition-colors";
        } else if (animal.Type === "calf") {
            tableRow.className =
                "bg-yellow-200 hover:bg-yellow-300 transition-colors";
        }
        count += 1;
    });
    titleAnimal.textContent =
        "Toplam " + (count - 1).toString() + " hayvan var!";
}
