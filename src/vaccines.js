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
            <h2 class="mb-4 text-center text-2xl font-bold" id="titleVaccine"></h2>
            <div>
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead class="sticky top-0 z-10 bg-gray-800 text-white">
                        <tr class="bg-gray-800">
                            <th class="px-4 py-3 text-center">Sayı</th>
                            <th class="px-4 py-3 text-center">Küpe Numarası</th>
                            <th class="px-4 py-3 text-center">Aşı Adı</th>
                            <th class="px-4 py-3 text-center">Aşı Tarihi</th>
                            <th class="px-4 py-3 text-center">Kaç Gün Oldu</th>
                            <th class="px-4 py-3 text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="vaccineTableBody" class="divide-y divide-gray-200">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="fixed bottom-5 right-3 flex gap-2">
            <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-add-vaccine">
                Yeni Aşı Ekle
            </button>
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-menu">
                Ana Menü
            </button>
        </div>
        `;

const vaccinesBody = document.getElementById("vaccinesBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    vaccinesBody.innerHTML = loadingTemplate;
    window.animalsAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

function showDatas(datas) {
    vaccinesBody.innerHTML = layout;

    const menuButton = document.getElementById("btn-menu");
    const titleVaccine = document.getElementById("titleVaccine");
    const vaccineTableBody = document.getElementById("vaccineTableBody");
    const addVaccine = document.getElementById("btn-add-vaccine");

    menuButton.addEventListener("click", () => {
        window.electronAPI.openMenu();
    });

    addVaccine.addEventListener("click", () => {
        window.vaccineAPI.openAddVaccine();
    });

    vaccineTableBody.addEventListener("click", function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");

        if (target.id === "updateIco") {
            datas = earringNo.textContent;
            if (window.electronAPI) window.electronAPI.openUpdateAnimal(earringNo.textContent);
        }

        else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
            if (sure) {
                // Remove cow from the databases.
                const vaccineDatas = {
                    EarringNo: earringNo.textContent,
                    
                }
                window.vaccineAPI.removeVaccine();
            } else {
                // Anything.
                console.log("Veri silinmedi.");
            }
        }
    });

    let count = 1;
    datas.forEach((vaccine) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let vaccineName = document.createElement("td");
        let vaccineDate = document.createElement("td");
        let days = document.createElement("td");

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let deleteIco = document.createElement("span");
        let updateIco = document.createElement("span");

        // Tailwind classes
        tableRow.className = "hover:bg-blue-200 transition-colors duration-150 font-bold bg-yellow-100";
        number.className = "px-4 py-3 text-center";
        earringNo.className = "px-4 py-3 text-center";
        vaccineName.className = "px-4 py-3 text-center";
        vaccineDate.className = "px-4 py-3 text-center";
        days.className = "px-4 py-3 text-center";
        nav.className = "px-4 py-3 text-center";

        navDiv.className = "flex justify-center gap-1";
        deleteButton.className = "px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors duration-200";
        updateButton.className = "px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded transition-colors duration-200";

        deleteButton.innerHTML = `<svg id="deleteIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="deleteIco" stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        updateButton.innerHTML = `<svg id="updateIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="updateIco" stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
        

        deleteButton.className =
            "bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        updateButton.className =
            "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-xs transition-colors flex items-center justify-center";
        

        nav.appendChild(navDiv);

        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);

        deleteButton.appendChild(deleteIco);
        updateButton.appendChild(updateIco);

        vaccineTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(vaccineName);
        tableRow.appendChild(vaccineDate);
        tableRow.appendChild(days);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";

        deleteIco.id = "deleteIco";
        updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        updateButton.id = "updateIco";

        number.textContent = count.toString() + "-)";
        earringNo.textContent = vaccine.EarringNo;
        vaccineName.textContent = vaccine.VaccineName;
        vaccineDate.textContent = new Date(vaccine.VaccineDate).toLocaleDateString("tr-TR");
        days.textContent = calculateDays(vaccine.VaccineDate).toString();

        count += 1;
    });
    titleVaccine.textContent = "Listede toplam " + (count - 1).toString() + " aşı var.";
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
    let month = String(today.getMonth() + 1).padStart(2, "0"); // Ocak = 0
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDays(vaccineDate) {
    let today = getTodayDate();
    vDate = parseTurkishDate(vaccineDate);

    return Math.ceil((today - vDate) / (1000 * 60 * 60 * 24));
}