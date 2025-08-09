// Main template with Tailwind classes
const layout = `
<div class="container mx-auto my-8 px-4">
    <div class="max-w-6xl mx-auto bg-white p-8 shadow-card-lg rounded-2xl">
        <h2 class="text-3xl font-bold text-center mb-8 text-gray-800" id="earringNoTag"></h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" id="infoDatas">
            <!-- Sol Kart: Hayvan Bilgileri -->
            <div class="space-y-4" id="animalInfo">
                <div class="bg-card-bg rounded-xl p-6 shadow-card h-full overflow-y-auto" id="animalInfoCard">
                    <h5 class="text-xl font-bold text-center mb-4 text-gray-800 border-b pb-2" id="infoName"></h5>
                </div>
            </div>

            <!-- Orta Kart: Aşılar -->
            <div class="space-y-4" id="vaccinesInfo">
                <div class="bg-card-bg rounded-xl p-6 shadow-card h-full overflow-y-auto" id="vaccinesInfoCard">
                    <h5 class="text-xl font-bold text-center mb-4 text-gray-800 border-b pb-2">Aşılar</h5>
                    <div class="space-y-3" id="vaccinesList">
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pr-4">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200 ease-in-out" id="editButton">
                <span class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Düzenle</span>
                </span>
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200 ease-in-out" id="deleteButton">
                <span class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Sil</span>
                </span>
            </button>
        </div>
    </div>
</div>
`;

// Loading template with Tailwind classes
const loadingTemplate = `
<div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
        <h2 class="text-2xl font-bold text-gray-800">Hayvan Bilgileri Yükleniyor...</h2>
        <p class="text-gray-500 mt-2">Lütfen bekleyiniz</p>
    </div>
</div>
`;

const animalDetailBody = document.getElementById("animalDetailBody");

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    animalDetailBody.innerHTML = loadingTemplate;
    window.animalDetailAPI.receiveDetailDatas((allDatas) => {
        console.log(allDatas);
        showDatas(allDatas);
    });
});

function showDatas(allDatas) {
    animalDetailBody.innerHTML = layout;

    const editButton = document.getElementById("editButton");
    const deleteButton = document.getElementById("deleteButton");
    
    // If user click "Düzenle"
    editButton.addEventListener("click", () => {
        console.log("deneme1");  
    });

    if (allDatas.animalData[0].Type === "cow") {
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = allDatas.animalData[0].EarringNo;
        
        // Preparing calves' data of cow
        const infoDatas = document.getElementById("infoDatas");
        const animalInfo = document.getElementById("animalInfo");
        const vaccinesInfo = document.getElementById("vaccinesInfo");
        const infoName = document.getElementById("infoName");

        const calvesInfo = document.createElement("div");
        const subDiv = document.createElement("div");
        const calfInfoName = document.createElement("h5");
        const calvesList = document.createElement("div");

        
        infoDatas.appendChild(calvesInfo);
        calvesInfo.appendChild(subDiv);
        subDiv.appendChild(calfInfoName);
        subDiv.appendChild(calvesList);
        
        calfInfoName.innerHTML += "Buzağı Bilgisi";
        infoName.innerHTML += "İnek Bilgisi";

        calvesInfo.className = "space-y-4";
        animalInfo.className = "space-y-4";
        vaccinesInfo.className = "space-y-4";

        subDiv.className = "bg-card-bg rounded-xl p-6 shadow-card h-full overflow-y-auto max-h-96";
        calfInfoName.className = "text-xl font-bold text-center mb-4 text-gray-800 border-b pb-2";
        calvesList.className = "space-y-3";

        if (allDatas.calvesData.length != 0){
            allDatas.calvesData[0].forEach(calf => {
                const element = document.createElement("div");
                calvesList.appendChild(element);

                element.className = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200";

                element.innerHTML = `
                    <div class="space-y-2">
                        <p class="text-sm"><span class="font-bold text-gray-800">Küpe:</span> <span class="text-gray-950">${calf.EarringNo}</span></p>
                        <p class="text-sm"><span class="font-bold text-gray-800">İsim:</span> <span class="text-gray-950">${calf.Name}</span></p>
                        <p class="text-sm"><span class="font-bold text-gray-800">Doğum:</span> <span class="text-gray-950">${calf.BirthDate}</span></p>
                    </div>
                `;
            });
        }

        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        animalInfoCard.innerHTML += 
        `
            <div class="space-y-3 text-sm">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].Name}</span></p>
                    <p><span class="font-bold text-gray-800">Doğum Tarihi:</span> <span class="text-gray-950">${allDatas.animalData[0].BirthDate}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Anne Küpe No:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherEarringNo}</span></p>
                    <p><span class="font-bold text-gray-800">Anne İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherName}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Tohumlama Tarihi:</span> <span class="text-gray-950">${allDatas.cowData[0].InseminationDate}</span></p>
                    <p><span class="font-bold text-gray-800">Tahmini Doğum Tarihi:</span> <span class="text-gray-950">${calculateWhenBirth(allDatas.cowData[0].InseminationDate)}</span></p>
                    <p><span class="font-bold text-gray-800">Hamile Günü:</span> <span class="text-gray-950">${calculatePassDay(allDatas.cowData[0].InseminationDate)} gün</span></p>
                    <p><span class="font-bold text-gray-800">Doğuma Kalan Gün:</span> <span id="colorSpan" class="${calculateLeftDay(allDatas.cowData[0].InseminationDate) <= 20 ? " text-red-600" : "text-gray-950"}">${calculateLeftDay(allDatas.cowData[0].InseminationDate)} gün</span></p>
                    <p><span class="font-bold text-gray-800">Kuruya Çıkış:</span> <span class="text-gray-950">${calculateKuruDate(allDatas.cowData[0].InseminationDate)}</span></p>
                    <p><span class="font-bold text-gray-800">Boğa İsmi:</span> <span class="text-gray-950">${allDatas.cowData[0].BullName}</span></p>
                </div>
            </div>
        `;

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("div");

            vaccinesList.appendChild(element);

            element.className = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200";

            element.innerHTML = 
            `
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-800">${vaccine.VaccineName}</span>
                    <span class="text-sm text-gray-500">${vaccine.VaccineDate}</span>
                </div>
            `;
        });

    }
    else if (allDatas.animalData[0].Type === "heifer"){
        console.log(allDatas);
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = allDatas.animalData[0].EarringNo;
        
        // Preparing calves' data of heifer
        const infoDatas = document.getElementById("infoDatas");
        const animalInfo = document.getElementById("animalInfo");
        const vaccinesInfo = document.getElementById("vaccinesInfo");
        const infoName = document.getElementById("infoName");

        const calvesInfo = document.createElement("div");
        const subDiv = document.createElement("div");
        const calfInfoName = document.createElement("h5");
        const calvesList = document.createElement("div");

        
        infoDatas.appendChild(calvesInfo);
        calvesInfo.appendChild(subDiv);
        subDiv.appendChild(calfInfoName);
        subDiv.appendChild(calvesList);
        
        calfInfoName.innerHTML += "Buzağı Bilgisi";
        infoName.innerHTML += "Düve Bilgisi";

        calvesInfo.className = "space-y-4";
        animalInfo.className = "space-y-4";
        vaccinesInfo.className = "space-y-4";

        subDiv.className = "bg-card-bg rounded-xl p-6 shadow-card h-full overflow-y-auto max-h-96";
        calfInfoName.className = "text-xl font-bold text-center mb-4 text-gray-800 border-b pb-2";
        calvesList.className = "space-y-3";

        if (allDatas.calvesData.length !== 0){
            allDatas.calvesData[0].forEach(calf => {
                const element = document.createElement("div");
                calvesList.appendChild(element);

                element.className = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200";

                element.innerHTML = `
                    <div class="space-y-2">
                        <p class="text-sm"><span class="font-bold text-gray-800">Küpe:</span> <span class="text-gray-950">${calf.EarringNo}</span></p>
                        <p class="text-sm"><span class="font-bold text-gray-800">İsim:</span> <span class="text-gray-950">${calf.Name}</span></p>
                        <p class="text-sm"><span class="font-bold text-gray-800">Doğum:</span> <span class="text-gray-950">${calf.BirthDate}</span></p>
                    </div>
                `;
            });
        }

        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        animalInfoCard.innerHTML += 
        `
            <div class="space-y-3 text-sm">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].Name}</span></p>
                    <p><span class="font-bold text-gray-800">Doğum Tarihi:</span> <span class="text-gray-950">${allDatas.animalData[0].BirthDate}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Anne Küpe No:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherEarringNo}</span></p>
                    <p><span class="font-bold text-gray-800">Anne İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherName}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Son Doğurduğu Tarih:</span> <span class="text-gray-950">${allDatas.heiferData[0].LastBirthDate}</span></p>
                    <p><span class="font-bold text-gray-800">Boş Gün Sayısı:</span> <span class="text-orange-600 font-medium">${calculatelastBirthDate(allDatas.heiferData[0].LastBirthDate)} gün</span></p>
                </div>
            </div>
        `;

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("div");

            vaccinesList.appendChild(element);

            element.className = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200";

            element.innerHTML = 
            `
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-800">${vaccine.VaccineName}</span>
                    <span class="text-sm text-gray-500">${vaccine.VaccineDate}</span>
                </div>
            `;
        });

    }
    else if (allDatas.animalData[0].Type === "calf"){
        console.log("çalıştı");
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = allDatas.animalData[0].EarringNo;
        
        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        let { lt2Date, lt1Date, shutDateC, daysC, daysS } = calculateCalfDates(allDatas.animalData[0].BirthDate);

        const infoName = document.getElementById("infoName");
        infoName.innerHTML += "Buzağı Bilgisi";

        animalInfoCard.innerHTML += 
        `
            <div class="space-y-3 text-sm">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].Name}</span></p>
                    <p><span class="font-bold text-gray-800">Doğum Tarihi:</span> <span class="text-gray-950">${allDatas.animalData[0].BirthDate}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Anne Küpe No:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherEarringNo}</span></p>
                    <p><span class="font-bold text-gray-800">Anne İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherName}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Kaç Günlük:</span> <span class="text-primary font-medium">${daysC} gün</span></p>
                    <p><span class="font-bold text-gray-800">2 LT Düşürme Tarihi:</span> <span class="text-gray-950">${lt2Date}</span></p>
                    <p><span class="font-bold text-gray-800">1 LT Düşürme Tarihi:</span> <span class="text-gray-950">${lt1Date}</span></p>
                    <p><span class="font-bold text-gray-800">Sütten Kesme Tarihi:</span> <span class="text-gray-950">${shutDateC}</span></p>
                    <p><span class="font-bold text-gray-800">Sütten Kesmeye Kalan Gün:</span> <span class="text-red-600 font-medium">${daysS} gün</span></p>
                </div>
            </div>
        `;

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("div");

            vaccinesList.appendChild(element);

            element.className = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200";

            element.innerHTML = 
            `
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-800">${vaccine.VaccineName}</span>
                    <span class="text-sm text-gray-500">${vaccine.VaccineDate}</span>
                </div>
            `;
        });

    }
    else if (allDatas.animalData[0].Type === "bull"){
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = allDatas.animalData[0].EarringNo;
        
        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        const infoName = document.getElementById("infoName");
        infoName.innerHTML += "Dana Bilgisi";

        animalInfoCard.innerHTML += 
        `
            <div class="space-y-3 text-sm">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].Name}</span></p>
                    <p><span class="font-bold text-gray-800">Doğum Tarihi:</span> <span class="text-gray-950">${allDatas.animalData[0].BirthDate}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Anne Küpe No:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherEarringNo}</span></p>
                    <p><span class="font-bold text-gray-800">Anne İsim:</span> <span class="text-gray-950">${allDatas.animalData[0].MotherName}</span></p>
                </div>
                <hr class="border-gray-300">
                <div class="grid grid-cols-1 gap-3">
                    <p><span class="font-bold text-gray-800">Kaç Günlük:</span> <span class="text-primary font-medium">${calculateBullDays(allDatas.animalData[0].BirthDate)} gün</span></p>
                </div>
            </div>
        `;

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("div");

            vaccinesList.appendChild(element);

            element.className = "bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200";

            element.innerHTML = 
            `
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-800">${vaccine.VaccineName}</span>
                    <span class="text-sm text-gray-500">${vaccine.VaccineDate}</span>
                </div>
            `;
        });
    }
}

// Convert from Turkish Date (01.01.1970) to USA Date (1979-01-01).
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

// Calculate dates.
function calculateWhenBirth(inseminationDate) {
    let date = parseTurkishDate(inseminationDate);
    date.setDate(date.getDate() + 280);
    return date.toLocaleDateString("tr-TR");
}

function calculateKuruDate(inseminationDate) {
    let date = parseTurkishDate(inseminationDate);
    date.setDate(date.getDate() + 220);
    return date.toLocaleDateString("tr-TR");
}

function calculateLeftDay(inseminationDate) {
    let today = getTodayDate();
    let date = parseTurkishDate(inseminationDate);
    date.setDate(date.getDate() + 280);

    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function calculatePassDay(inseminationDate) {
    let today = getTodayDate();
    let date = parseTurkishDate(inseminationDate);

    return Math.ceil((today - date) / (1000 * 60 * 60 * 24));
}

function calculatelastBirthDate(lastBirth) {
    const lastBirthDate = lastBirth;

    console.log(getTodayDate);
    return Math.ceil((getTodayDate() - lastBirthDate) / (1000 * 60 * 60 * 24));
}

function calculateCalfDates(birthDate){
    dateBirth = new Date(birthDate);
    let lt2Date = dateBirth;
    let lt1Date = dateBirth;
    let shutDate  = dateBirth;
    let daysDate = dateBirth;
    let daysShut = dateBirth;
    let today = getTodayDate();

    lt2Date.setDate(lt2Date.getDate() + 75);
    lt1Date.setDate(lt1Date.getDate() + 85);
    shutDate.setDate(shutDate.getDate() + 100);
    daysDate = Math.ceil((today - daysDate) / (1000 * 60 * 60 * 24));
    daysShut = Math.ceil((shutDate - today) / (1000 * 60 * 60 * 24));

    return {
        lt2Date: lt2Date.toLocaleDateString("tr-TR"),
        lt1Date: lt1Date.toLocaleDateString("tr-TR"),
        shutDateC: shutDate.toLocaleDateString("tr-TR"),
        daysC: daysDate,
        daysS: daysShut
    };
}

function calculateBullDays(age){
    let today = getTodayDate();
    let days = parseTurkishDate(age);

    return Math.ceil((today - days) / (1000 * 60 * 60 * 24));
}