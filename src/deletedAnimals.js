const loadingTemplate = `
    <style>
        .loader {
            border: 16px solid #fecaca; /* Red-200 */
            border-top: 16px solid #dc2626; /* Red-600 */
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
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="loader"></div>
        <h2 class="mt-4 text-xl font-semibold text-gray-700">Silinen Veriler Yükleniyor...</h2>
    </div>
`;

const layout = `
    <div class="container mx-auto mt-5 mb-4 px-4">
        <div class="relative mb-6">
            <button 
                id="infoBtn" 
                class="cursor-pointer absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                </svg>
            </button>
            <h2 class="text-center text-2xl font-bold text-red-700 flex items-center justify-center h-12" id="titleDeleted">
                Silinen Hayvanlar Arşivi
            </h2>
        </div>

        <div class="shadow-xl rounded-lg overflow-hidden border border-red-100">
            <table class="min-w-full bg-white">
                <thead class="bg-red-700 text-white">
                    <tr>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Id</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Küpe Numarası</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">İsim</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Anne Küpe Numarası</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Anne Adı</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Doğum Tarihi</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Tür</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Cinsi</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Silinme Tarihi</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">Silinme Nedeni</th>
                        <th class="px-4 py-3 text-center font-semibold text-sm">İşlemler</th>
                    </tr>
                </thead>
                <tbody id="deletedTableBody" class="divide-y divide-gray-200">
                    </tbody>
            </table>
        </div>
    </div>

    <div class="fixed bottom-5 right-5 flex gap-3 z-50">
        <button id="btn-menu" class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">
            Ana Menü
        </button>
    </div>
`;

const deletedBody = document.getElementById("deletedBody");

window.addEventListener("DOMContentLoaded", () => {
    deletedBody.innerHTML = loadingTemplate;
    // Backend'den sadece silinenleri getiren API'yi çağırdığınızı varsayıyoruz
    window.animalsAPI.receiveDatas((allDatas) => {
        showDeletedDatas(allDatas);
    });
    // showDeletedDatas([])
    
});

function showDeletedDatas(allDatas) {
    deletedBody.innerHTML = layout;

    const tableBody = document.getElementById("deletedTableBody");
    const titleText = document.getElementById("titleDeleted");
    const menuBtn = document.getElementById("btn-menu");
    const infoBtn = document.getElementById("infoBtn");

    menuBtn.addEventListener("click", () => window.electronAPI.openMenu());

    infoBtn.addEventListener("click", () => {
        alert("Bu sayfa kazara silinen hayvanları geri yüklemek veya kalıcı olarak temizlemek içindir.");
    });

    if (allDatas.animalDatas.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="py-10 text-center text-gray-500 font-medium">Silinmiş bir kayıt bulunamadı.</td></tr>`;
        return;
    }

    allDatas.animalDatas.forEach((animal) => {
        const row = document.createElement("tr");
        row.className = "bg-green-200 hover:bg-green-300 transition-colors";
        
        let animalType = "";
        if (animal.Type == "calf") {
            animalType = "Buzağı";
        } else if (animal.Type == "heifer") {
            animalType = "Düve";
        } else if (animal.Type == "cow") {
            animalType = "İnek";
        } else if (animal.Type == "bull") {
            animalType = "Dana";
        }

        row.innerHTML = `
            <td class="px-4 py-3 text-center font-bold border-b">${animal.id}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animal.EarringNo || ""}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animal.Name || ""}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animal.MotherEarringNo || ""}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animal.MotherName || ""}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${new Date(animal.BirthDate).toLocaleDateString("tr-TR")}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animalType}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animal.Breed || ""}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${new Date(animal.DeathDate).toLocaleDateString("tr-TR")}</td>
            <td class="px-4 py-3 text-center font-bold border-b">${animal.Reason || ""}</td>
            <td class="px-4 py-3 text-center border-b">
                <div class="flex justify-center gap-2">
                    <button onclick="restoreAnimal(${animal.Id})" title="Geri Yükle" class="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                    </button>
                    <button onclick="hardDeleteAnimal(${animal.Id})" title="Kalıcı Olarak Sil" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 01 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    titleText.textContent = `Arşivde toplam ${allDatas.animalDatas.length} silinmiş kayıt var.`;
}

// Global fonksiyonlar (onclick kullanımı için)
// window.restoreAnimal = (id) => {
//     if(confirm(id + " ID'li hayvan geri yüklenecektir. Emin misiniz?")) {
//         window.electronAPI.restoreAnimal(id);
//     }
// };

// window.hardDeleteAnimal = (id) => {
//     if(confirm("DİKKAT! Bu işlem geri alınamaz. Kayıt tamamen silinecektir!")) {
//         window.electronAPI.permanentDeleteAnimal(id);
//     }
// };