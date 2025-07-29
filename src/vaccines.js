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
                            <th class="px-4 py-3 text-center">İnek Adı</th>
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
            <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-add-cow">
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
    if (window.animalsAPI) {
        window.animalsAPI.receiveDatas((datas) => {
            showDatas(datas);
        });
    }
});

function showDatas(datas) {
    vaccinesBody.innerHTML = layout;

    const menuButton = document.getElementById("btn-menu");
    const titleVaccine = document.getElementById("titleVaccine");
    const vaccineTableBody = document.getElementById("vaccineTableBody");

    menuButton.addEventListener("click", () => {
        if (window.electronAPI) window.electronAPI.openMenu();
    });

    vaccineTableBody.addEventListener("click", function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");

        if (target.id === "infoIco") {
            let datas = { earringNo: earringNo.textContent, type: "cow" };
            if (window.electronAPI) window.electronAPI.openAnimalDetail(datas);
        }

        else if (target.id === "updateIco") {
            datas = earringNo.textContent;
            if (window.electronAPI) window.electronAPI.openUpdateAnimal(earringNo.textContent);
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
    datas.vaccines.forEach((vaccine) => {
        let tableRow = document.createElement("tr");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let vaccineName = document.createElement("td");
        let vaccineDate = document.createElement("td");
        let days = document.createElement("td");

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        let deleteIco = document.createElement("span");
        let infoIco = document.createElement("span");
        let updateIco = document.createElement("span");

        // Tailwind classes
        tableRow.className = "hover:bg-gray-50 transition-colors duration-150 font-bold bg-yellow-100";
        number.className = "px-4 py-3 text-center";
        earringNo.className = "px-4 py-3 text-center";
        name.className = "px-4 py-3 text-center";
        vaccineName.className = "px-4 py-3 text-center";
        vaccineDate.className = "px-4 py-3 text-center";
        days.className = "px-4 py-3 text-center";
        nav.className = "px-4 py-3 text-center";

        navDiv.className = "flex justify-center gap-1";
        deleteButton.className = "px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors duration-200";
        infoButton.className = "px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors duration-200";
        updateButton.className = "px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded transition-colors duration-200";

        deleteIco.className = "icon-trash";
        infoIco.className = "icon-info";
        updateIco.className = "icon-edit";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);

        deleteButton.appendChild(deleteIco);
        infoButton.appendChild(infoIco);
        updateButton.appendChild(updateIco);

        vaccineTableBody.appendChild(tableRow);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(vaccineName);
        tableRow.appendChild(vaccineDate);
        tableRow.appendChild(days);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";

        deleteIco.id = "deleteIco";
        infoIco.id = "infoIco";
        updateIco.id = "updateIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";

        number.textContent = count.toString() + "-)";
        earringNo.textContent = vaccine.earringNo;
        name.textContent = vaccine.name;
        vaccineName.textContent = vaccine.vaccineName;
        vaccineDate.textContent = vaccine.vaccineDate;
        days.textContent = calculateDays(vaccine.vaccineDate).toString();

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