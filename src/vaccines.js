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
                <h2 class="mb-4 text-center text-2xl font-bold" id="titleVaccine"></h2>
            </div>
            <div class="shadow-lg rounded-lg">
                <table class="min-w-full bg-white
                ">
                    <thead class="bg-gray-800 text-white">
                        <tr class="sticky top-0 z-10 bg-gray-800" id="tableHead">
                            <th class="px-4 py-3 text-center">Sayı</th>
                            <th class="px-4 py-3 text-center">Küpe No.</th>
                            <th class="px-4 py-3 text-center">İsim</th>
                            <!-- Aşı sütunları dinamik olarak buraya eklenecek -->
                        </tr>
                    </thead>
                    <tbody id="vaccineTableBody" class="divide-y divide-gray-200">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="fixed bottom-5 right-3 flex gap-2">
            <button title="Yeni Aşı Ekleme sayfasına yönlendirir" class="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-add-vaccine">
                Yeni Aşı Ekle
                    <div class="help-bubble -top-[1px] -left-[90px] transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Yeni aşı ekleme sayfası</span>
                        <div class="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-gray-800"></div>
                    </div>
            </button>
            <button title="Ana menüye yönlendirir" class="relative cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-menu">
                Ana Menü
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Ana Menüye Döndürür</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
            </button>
        </div>
        `;

const vaccinesBody = document.getElementById("vaccinesBody");

window.electronAPI.refresh((allDatas) => {
    showDatas(allDatas);
});

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    vaccinesBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((allDatas) => {
        showDatas(allDatas);
    });
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
    vaccinesBody.innerHTML = layout;
    const tableHead = document.getElementById("tableHead");
    const menuButton = document.getElementById("btn-menu");
    const titleVaccine = document.getElementById("titleVaccine");
    const vaccineTableBody = document.getElementById("vaccineTableBody");
    const addVaccine = document.getElementById("btn-add-vaccine");

    // If showInformationButton is false, Hidden the button.
    const infoBtn = document.getElementById("infoBtn");
    if (!allDatas.settingsDatas.showInformationButton) {
        infoBtn.classList += " hidden";
    }

    infoBtn.addEventListener("click", () => {
        const helpBubbles = document.querySelectorAll('.help-bubble');
        helpBubbles.forEach(bubble => {
            bubble.classList.toggle('visible');
        });  
    })

    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
    });

    addVaccine.addEventListener("click", () => {
        window.vaccineAPI.openAddVaccine();
    });

    // Verileri pivotlama - Her hayvan için aşıları gruplama
    const animalVaccineMap = {};
    const allVaccineNames = new Set();

    allDatas.vaccineDatas.forEach((vaccine) => {
        const animalId = vaccine.Animals.Id;
        
        if (!animalVaccineMap[animalId]) {
            animalVaccineMap[animalId] = {
                earringNo: vaccine.Animals.EarringNo,
                name: vaccine.Animals.Name,
                vaccines: {}
            };
        }

        // Aşı ismini sete ekle
        allVaccineNames.add(vaccine.VaccineName);
        
        // Her aşı için tarih ve ID bilgisini sakla
        if (!animalVaccineMap[animalId].vaccines[vaccine.VaccineName]) {
            animalVaccineMap[animalId].vaccines[vaccine.VaccineName] = [];
        }
        
        animalVaccineMap[animalId].vaccines[vaccine.VaccineName].push({
            date: vaccine.VaccineDate,
            id: vaccine.Id
        });
    });

    // Aşı isimlerini sırala
    const vaccineNames = Array.from(allVaccineNames).sort();

    // Dinamik olarak aşı sütunlarını ekle
    vaccineNames.forEach(vaccineName => {
        const th = document.createElement('th');
        th.className = 'px-4 py-3 text-center vaccine-column';
        th.textContent = vaccineName;
        tableHead.appendChild(th);
    });

    // Silme işlemi için event listener
    vaccineTableBody.addEventListener("click", function (event) {
        const target = event.target;
        
        if (target.classList.contains("delete-vaccine-btn") || target.closest(".delete-vaccine-btn")) {
            const button = target.classList.contains("delete-vaccine-btn") ? target : target.closest(".delete-vaccine-btn");
            const vaccineId = button.getAttribute("data-vaccine-id");
            const earringNo = button.getAttribute("data-earring-no");
            const vaccineName = button.getAttribute("data-vaccine-name");
            const vaccineDate = button.getAttribute("data-vaccine-date");

            const sure = window.confirm(
                earringNo + " küpe numaralı hayvanın " +
                vaccineDate + " tarihli " +
                vaccineName + " isimli aşısı silinecek" +
                "\nOnaylıyor musunuz?"
            );
            
            if (sure) {
                window.vaccineAPI.removeVaccine(vaccineId);
            }
        }
    });

    // Tabloyu doldur
    let count = 1;
    Object.values(animalVaccineMap).forEach((animal) => {
        let tableRow = document.createElement("tr");
        tableRow.className = "hover:bg-blue-300 transition-colors duration-150 font-bold bg-yellow-200";

        // Sayı
        let number = document.createElement("td");
        number.className = "px-4 py-3 text-center";
        number.textContent = count.toString() + "-)";

        // Küpe No
        let earringNo = document.createElement("td");
        earringNo.className = "px-4 py-3 text-center";
        earringNo.textContent = animal.earringNo;

        // İsim
        let name = document.createElement("td");
        name.className = "px-4 py-3 text-center";
        name.textContent = animal.name;

        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);

        // Her aşı için hücre oluştur
        vaccineNames.forEach(vaccineName => {
            let vaccineCell = document.createElement("td");
            vaccineCell.className = "px-4 py-3 text-center";
            
            if (animal.vaccines[vaccineName] && animal.vaccines[vaccineName].length > 0) {
                // Eğer birden fazla aynı aşı varsa hepsini göster
                const vaccineDiv = document.createElement("div");
                vaccineDiv.className = "space-y-1";
                
                animal.vaccines[vaccineName].forEach(vaccine => {
                    const dateDiv = document.createElement("div");
                    dateDiv.className = "flex items-center justify-center gap-2";
                    
                    const dateSpan = document.createElement("span");
                    dateSpan.className = "text-sm";
                    dateSpan.textContent = new Date(vaccine.date).toLocaleDateString("tr-TR");
                    
                    const deleteBtn = document.createElement("button");
                    deleteBtn.className = "delete-vaccine-btn text-red-500 hover:text-red-700 transition-colors";
                    deleteBtn.setAttribute("data-vaccine-id", vaccine.id);
                    deleteBtn.setAttribute("data-earring-no", animal.earringNo);
                    deleteBtn.setAttribute("data-vaccine-name", vaccineName);
                    deleteBtn.setAttribute("data-vaccine-date", new Date(vaccine.date).toLocaleDateString("tr-TR"));
                    deleteBtn.title = "Bu aşıyı sil";
                    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
                    
                    dateDiv.appendChild(dateSpan);
                    dateDiv.appendChild(deleteBtn);
                    vaccineDiv.appendChild(dateDiv);
                });
                
                vaccineCell.appendChild(vaccineDiv);
            } else {
                vaccineCell.textContent = "-";
                vaccineCell.className += " text-gray-400";
            }
            
            tableRow.appendChild(vaccineCell);
        });

        vaccineTableBody.appendChild(tableRow);
        count += 1;
    });

    const totalAnimals = Object.keys(animalVaccineMap).length;
    const totalVaccines = allDatas.vaccineDatas.length;
    titleVaccine.textContent = `Listede toplam ${totalAnimals} hayvan var (${totalVaccines} aşı kaydı)`;
}

// Convert from Turkish Date (01.01.1970) to JavaScript Date (1979-01-01).
function parseTurkishDate(wDate) {
    let [day, month, year] = wDate.split(".");
    let date = new Date(`${year}-${month}-${day}`);
    return date;
}

// Get today's date as JavaScript date.
function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDays(vaccineDate) {
    let today = getTodayDate();
    vDate = parseTurkishDate(vaccineDate);

    return Math.ceil((today - vDate) / (1000 * 60 * 60 * 24));
}