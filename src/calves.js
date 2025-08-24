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
            <h2 class="mb-4 text-center text-2xl font-bold" id="titleCalf"></h2>
            <div class="">
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead class="sticky top-0 z-10 bg-gray-800 text-white">
                        <tr class="bg-gray-800">
                            <th class="px-4 py-3 text-center">Id</th>
                            <th class="px-4 py-3 text-center">Sayı</th>
                            <th class="px-4 py-3 text-center">Küpe Numarası</th>
                            <th class="px-4 py-3 text-center">Buzağı Adı</th>
                            <th class="px-4 py-3 text-center">Doğum Tarihi</th>
                            <th class="px-4 py-3 text-center">Kaç Günlük *</th>
                            <th class="px-4 py-3 text-center">2 LT Düşürme Tar. *</th>
                            <th class="px-4 py-3 text-center">1 LT Düşürme Tar. *</th>
                            <th class="px-4 py-3 text-center">Sütten Kesme Tar. *</th>
                            <th class="px-4 py-3 text-center">Sütten Kesmeye Kaç Gün Kaldı *</th>
                            <th class="px-4 py-3 text-center">Anne Küpe No.</th>
                            <th class="px-4 py-3 text-center">Anne Adı</th>
                            <th class="px-4 py-3 text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="calvesTableBody" class="divide-y divide-gray-200">
                        <!-- JavaScript ile satırlar buraya eklenecek -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="fixed bottom-5 right-3 flex gap-2">
            <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-add-calf">
                Yeni Buzağı Ekle
            </button>
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 z-50" id="btn-menu">
                Ana Menü
            </button>
        </div>
        `;

const calvesBody = document.getElementById("calvesBody");

window.addEventListener("DOMContentLoaded", () => {
    calvesBody.innerHTML = loadingTemplate;
    if (window.animalsAPI) {
        window.animalsAPI.receiveDatas((datas) => {
            console.log(datas);
            showDatas(datas);
        });
    }
});

// After update database, refresh the table.
if (window.electronAPI) {
    window.electronAPI.refresh((datas) => {
        showDatas(datas);
    });
}

function showDatas(datas) {
    calvesBody.innerHTML = layout;

    const menuButton = document.getElementById("btn-menu");
    const titleCalf = document.getElementById("titleCalf");
    const calvesTableBody = document.getElementById("calvesTableBody");
    const addCalfButton = document.getElementById("btn-add-calf");

    menuButton.addEventListener("click", () => {
        if (window.electronAPI) window.electronAPI.openMenu();
    });

    // To open add cow menu.
    addCalfButton.addEventListener("click", () => {
        let animalType = "calf";
        if (window.electronAPI) window.electronAPI.openAddAnimalMenu(animalType);
    });

    calvesTableBody.addEventListener("click", function (event) {
        const target = event.target;
        let tableRow = target.closest("tr");
        let earringNo = tableRow.querySelector("#earringNo");
        let calfId = tableRow.querySelector("#calfId");

        if (target.id === "infoIco") {
            let datas = { animalId: calfId.textContent, type: "cow" };
            if (window.electronAPI) window.electronAPI.openAnimalDetail(datas);
        }

        else if (target.id === "updateIco") {
            datas = { animalId: calfId.textContent, type: "calf" };
            if (window.electronAPI) window.electronAPI.openUpdateAnimal(datas);
        }

        else if (target.id === "deleteIco") {
            const sure = window.confirm(
                "Şu küpe numaralı hayvan silinecek: " + earringNo.textContent + "\nOnaylıyor musunuz?");
            if (sure) {
                const datas = { animalId: calfId.textContent, Type: "calf", pageName: "calves" }
                window.electronAPI.removeAnimal(datas);
            } else {
                console.log("Veri silinmedi.");
            }
        }
    });

    let count = 1;
    datas.forEach((calf) => {
        let tableRow = document.createElement("tr");
        let calfId = document.createElement("td");
        let number = document.createElement("td");
        let earringNo = document.createElement("td");
        let name = document.createElement("td");
        let birthDate = document.createElement("td");
        let days = document.createElement("td");
        let lt2 = document.createElement("td");
        let lt1 = document.createElement("td");
        let shutDate = document.createElement("td");
        let shutDay = document.createElement("td");
        let motherEarringNo = document.createElement("td");
        let motherName = document.createElement("td");

        let nav = document.createElement("td");
        let navDiv = document.createElement("div");
        let deleteButton = document.createElement("button");
        let updateButton = document.createElement("button");
        let infoButton = document.createElement("button");
        // let shutButton = document.createElement("button");
        deleteButton.innerHTML = `<svg id="deleteIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="deleteIco" stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        infoButton.innerHTML = `<svg id="infoIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="infoIco" stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
        updateButton.innerHTML = `<svg id="updateIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="updateIco" stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
        // shutButton.innerHTML = `<svg id="shutIco" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path id="shutIco" stroke-linecap="round" stroke-linejoin="round" d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664" /></svg>`;

        // let deleteIco = document.createElement("span");
        // let infoIco = document.createElement("span");
        // let updateIco = document.createElement("span");
        // let shutIco = document.createElement("span");

        const cellClasses = "px-4 py-3 text-center font-bold whitespace-nowrap";


        // Tailwind classes
        // tableRow.className = "hover:bg-gray-50 transition-colors duration-150";
        calfId.className = cellClasses;
        number.className = cellClasses;
        earringNo.className = cellClasses;
        name.className = cellClasses;
        birthDate.className = cellClasses;
        days.className = cellClasses;
        lt2.className = cellClasses;
        lt1.className = cellClasses;
        shutDate.className = cellClasses;
        shutDay.className = cellClasses;
        motherEarringNo.className = cellClasses;
        motherName.className = cellClasses;
        nav.className = cellClasses;

        navDiv.className = "flex justify-center gap-1";
        deleteButton.className = "bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors";
        infoButton.className = "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors";
        updateButton.className = "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors";
        // shutButton.className = "px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors duration-200";

        // deleteIco.className = "icon-trash";
        // infoIco.className = "icon-info";
        // updateIco.className = "icon-edit";
        // shutIco.className = "icon-alarm";

        // deleteIco.title = "Hayvanı Sil";
        deleteButton.title = "Hayvanı Sil";
        // infoIco.title = "Hayvan Bilgisini Göster";
        infoButton.title = "Hayvan Bilgisini Göster";
        // updateIco.title = "Hayvanı Güncelle";
        updateButton.title = "Hayvanı Güncelle";
        // shutIco.title = "Sütten Kesildi Olarak İşaretle";
        // shutButton.title = "Sütten Kesildi Olarak İşaretle";

        nav.appendChild(navDiv);

        navDiv.appendChild(infoButton);
        navDiv.appendChild(updateButton);
        navDiv.appendChild(deleteButton);
        // navDiv.appendChild(shutButton);

        // deleteButton.appendChild(deleteIco);
        // infoButton.appendChild(infoIco);
        // updateButton.appendChild(updateIco);
        // shutButton.appendChild(shutIco);

        calvesTableBody.appendChild(tableRow);
        tableRow.appendChild(calfId);
        tableRow.appendChild(number);
        tableRow.appendChild(earringNo);
        tableRow.appendChild(name);
        tableRow.appendChild(birthDate);
        tableRow.appendChild(days);
        tableRow.appendChild(lt2);
        tableRow.appendChild(lt1);
        tableRow.appendChild(shutDate);
        tableRow.appendChild(shutDay);
        tableRow.appendChild(motherEarringNo);
        tableRow.appendChild(motherName);
        tableRow.appendChild(nav);

        earringNo.id = "earringNo";
        calfId.id = "calfId";

        // deleteIco.id = "deleteIco";
        // infoIco.id = "infoIco";
        // updateIco.id = "updateIco";
        // shutIco.id = "shutIco";
        deleteButton.id = "deleteIco";
        infoButton.id = "infoIco";
        updateButton.id = "updateIco";
        // shutButton.id = "shutIco";

        calfId.textContent = calf.Id;
        number.textContent = count.toString() + "-)";
        earringNo.textContent = calf.EarringNo;
        name.textContent = calf.Name;
        birthDate.textContent = new Date(calf.BirthDate).toLocaleDateString("tr-TR");

        let { lt2Date, lt1Date, shutDateC, daysC, daysS } = calculateDates(calf.BirthDate);
        console.log(shutDateC);
        if (new Date(shutDateC) < getTodayDate()) {
            days.textContent = daysC + " (" + (daysC/30).toFixed(1) + " ay)";
            lt2.textContent = "Sütten Kesildi";
            lt1.textContent = "Sütten Kesildi";
            shutDate.textContent = "Sütten Kesildi";
            shutDay.textContent = "Sütten Kesildi";
        } 
        else {
            days.textContent = daysC + " (" + (daysC/30).toFixed(1) + " ay)";
            lt2.textContent = lt2Date.toLocaleDateString("tr-TR");
            lt1.textContent = lt1Date.toLocaleDateString("tr-TR");
            shutDate.textContent = shutDateC.toLocaleDateString("tr-TR");
            shutDay.textContent = daysS;
        }

        motherEarringNo.textContent = calf.MotherEarringNo;
        motherName.textContent = calf.MotherName;

        // Gender-based background color
        if (calf.Gender) {
            tableRow.className = "bg-red-200 hover:bg-red-300 transition-colors duration-150";
        } else {
            tableRow.className = "bg-blue-200 hover:bg-blue-300 transition-colors duration-150";
        }

        count += 1;
    });
    titleCalf.textContent = "Listede toplam " + (count - 1).toString() + " adet buzağı var";
}

function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

function calculateDates(birthDate) {
    let lt2Date = new Date(birthDate);
    let lt1Date = new Date(birthDate);
    let shutDate = new Date(birthDate);
    let daysDate = new Date(birthDate);
    let daysShut = new Date(birthDate);
    let today = getTodayDate();

    lt2Date.setDate(lt2Date.getDate() + 75);
    lt1Date.setDate(lt1Date.getDate() + 85);
    shutDate.setDate(shutDate.getDate() + 100);
    daysDate = Math.ceil((today - daysDate) / (1000 * 60 * 60 * 24));
    daysShut = Math.ceil((shutDate - today) / (1000 * 60 * 60 * 24));

    return {
        lt2Date: lt2Date,
        lt1Date: lt1Date,
        shutDateC: shutDate,
        daysC: daysDate,
        daysS: daysShut
    };
};