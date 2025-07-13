// This is a html code of main template.
const layout = `
<div class="container my-4">
            <div class="card p-4 shadow rounded-4">
                <h2 class="text-center mb-4" id="earringNoTag"></h2>

                <div class="row g-4 d-flex flex-column flex-md-row h-100" id="infoDatas">
                    <!-- Sol Kart: İnek Bilgileri -->
                    <div class="col-md-6" id="animalInfo">
                        <div class="card h-100 p-3 shadow-sm rounded-4" id="animalInfoCard">
                            <h5 class="text-center mb-3" id="infoName"></h5>
                            <!-- <p><strong>İsim:</strong> <span id="nameTag"></span></p>
                            <p><strong>Tohumlama Tarihi:</strong> <span id="inseminationDateTag"></span></p>
                            <p><strong>Tahmini Doğum Tarihi:</strong> <span id="birthDateTag"></span></p>
                            <p><strong>Hamile Günü:</strong> <span id="passDayTag"></span></p>
                            <p><strong>Doğuma Kalan Gün:</strong> <span id="leftDayTag"></span></p>
                            <p><strong>Kuruya Çıkış:</strong> <span id="kuruDateTag"></span></p>
                            <p><strong>Boğa İsmi:</strong> <span id="bullNameTag"></span></p>
                            <p><strong>Gebelik Kontrol Tarihi:</strong> <span id="checkDateTag"></span></p> -->
                        </div>
                    </div>

                    <!-- Orta Kart: Aşılar -->
                    <div class="col-md-6" id="vaccinesInfo">
                        <div class="card h-100 p-3 shadow-sm rounded-4" id="vaccinesInfoCard">
                            <h5 class="text-center mb-3">Aşılar</h5>
                            <ul class="list-group list-group-flush" id="vaccinesList">
                            </ul>
                        </div>
                    </div>

                    <!-- Sağ Kart: Doğurduğu Buzağılar -->
                </div>

                <!-- Sil ve Düzenle Butonları -->
                <div class="action-buttons mt-3">
                    <button class="btn btn-primary" id="editButton">Düzenle</button>
                    <button class="btn btn-danger" id="deleteButton">Sil</button>
                </div>
            </div>
        </div>
`;

// This is a html code of loading template.
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
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;">
            <div class="loader"></div>
            <h2 style="margin-left: 10px;">Hayvan Bilgileri Yükleniyor...</h2>
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
        const animalInfo = document.getElementById("animalInfo");   // .className = "col-md-4"
        const vaccinesInfo = document.getElementById("vaccinesInfo");
        const infoName = document.getElementById("infoName");

        const calvesInfo = document.createElement("div");
        const subDiv = document.createElement("div");
        const calfInfoName = document.createElement("h5");
        const calvesList = document.createElement("ul");

        
        infoDatas.appendChild(calvesInfo);
        calvesInfo.appendChild(subDiv);
        subDiv.appendChild(calfInfoName);
        subDiv.appendChild(calvesList);
        
        calfInfoName.innerHTML += "Buzağı Bilgisi";
        infoName.innerHTML += "İnek Bilgisi<hr>";

        calvesInfo.className = "col-md-4";
        animalInfo.className = "col-md-4";
        vaccinesInfo.className = "col-md-4";

        subDiv.className = "card h-100 p-3 shadow-sm rounded-4 overflow-auto";
        infoName.className = "text-center mb-3";
        calfInfoName.className = "text-center mb-3";
        calvesList.className = "list-group list-group-flush";

        if (allDatas.calvesData.length != 0){
            allDatas.calvesData[0].forEach(calf => {
                const element = document.createElement("li");
                calvesList.appendChild(element);

                element.className = "list-group-item";

                element.innerHTML = `
                    <strong>Küpe:</strong> ${calf.EarringNo}
                    <br>
                    <strong>İsim:</strong> ${calf.Name} 
                    <br>
                    <strong>Doğum:</strong> ${calf.BirthDate}
                    <hr>
                `;
            });
        }


        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        animalInfoCard.innerHTML += 
        `
            <p><strong>İsim:</strong> ${allDatas.animalData[0].Name}</p>
            <p><strong>Doğum Tarihi:</strong> ${allDatas.animalData[0].BirthDate}</p>
            <hr>
            <p><strong>Anne Küpe No:</strong> ${allDatas.animalData[0].MotherEarringNo}</p>
            <p><strong>Anne İsim:</strong> ${allDatas.animalData[0].MotherName}</p>
            <hr>
            <p><strong>Tohumlama Tarihi:</strong> ${allDatas.cowData[0].InseminationDate}</p>
            <p><strong>Tahmini Doğum Tarihi:</strong> ${calculateWhenBirth(allDatas.cowData[0].InseminationDate)}</p>
            <p><strong>Hamile Günü:</strong> ${calculatePassDay(allDatas.cowData[0].InseminationDate)}</p>
            <p><strong>Doğuma Kalan Gün:</strong> ${calculateLeftDay(allDatas.cowData[0].InseminationDate)}</p>
            <p><strong>Kuruya Çıkış:</strong> ${calculateKuruDate(allDatas.cowData[0].InseminationDate)}</p>
            <p><strong>Boğa İsmi:</strong> ${allDatas.cowData[0].BullName}</p>
            `;
            // <p><strong>Gebelik Kontrol Tarihi:</strong> ${allDatas.cowData[0].CheckDate}</p>

        animalInfo.appendChild(animalInfoCard);

        // const vaccinesInfoCard = document.getElementById("vaccinesInfoCard");

        // vaccinesInfoCard.innerHTML = 
        // `
        //     <h5 class="text-center mb-3">Aşılar</h5>
        //     <ul class="list-group list-group-flush" id="vaccinesList">
        //     </ul>
        // `;

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("li");

            vaccinesList.appendChild(element);

            element.className = "list-group-item";

            element.innerHTML = 
            `
                <strong>${vaccine.VaccineName}</strong> - ${vaccine.VaccineDate}
                <hr>
            `;
        });


    }
    else if (allDatas.animalData[0].Type === "heifer"){
        console.log(allDatas);
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = allDatas.animalData[0].EarringNo;
        
        // Preparing calves' data of cow
        const infoDatas = document.getElementById("infoDatas");
        const animalInfo = document.getElementById("animalInfo");   // .className = "col-md-4"
        const vaccinesInfo = document.getElementById("vaccinesInfo");
        const infoName = document.getElementById("infoName");

        const calvesInfo = document.createElement("div");
        const subDiv = document.createElement("div");
        const calfInfoName = document.createElement("h5");
        const calvesList = document.createElement("ul");

        
        infoDatas.appendChild(calvesInfo);
        calvesInfo.appendChild(subDiv);
        subDiv.appendChild(calfInfoName);
        subDiv.appendChild(calvesList);
        
        calfInfoName.innerHTML += "Buzağı Bilgisi";
        infoName.innerHTML += "Düve Bilgisi<hr>";

        calvesInfo.className = "col-md-4";
        animalInfo.className = "col-md-4";
        vaccinesInfo.className = "col-md-4";

        subDiv.className = "card h-100 p-3 shadow-sm rounded-4 overflow-auto";
        infoName.className = "text-center mb-3";
        calfInfoName.className = "text-center mb-3";
        calvesList.className = "list-group list-group-flush";

        if (allDatas.calvesData.length !== 0){
            allDatas.calvesData[0].forEach(calf => {
                const element = document.createElement("li");
                calvesList.appendChild(element);

                element.className = "list-group-item";

                element.innerHTML = `
                <strong>Küpe:</strong> ${calf.EarringNo} 
                <br>
                <strong>İsim:</strong> ${calf.Name} 
                <br>
                <strong>Doğum:</strong> ${calf.BirthDate}
                <hr>
                `;
            });
        }

        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        animalInfoCard.innerHTML += 
        `
            <p><strong>İsim:</strong> ${allDatas.animalData[0].Name}</p>
            <p><strong>Doğum Tarihi:</strong> ${allDatas.animalData[0].BirthDate}</p>
            <hr>
            <p><strong>Anne Küpe No:</strong> ${allDatas.animalData[0].MotherEarringNo}</p>
            <p><strong>Anne İsim:</strong> ${allDatas.animalData[0].MotherName}</p>
            <hr>
            <p><strong>Son Doğurduğu Tarih:</strong> ${allDatas.heiferData[0].LastBirthDate}</p>
            <p><strong>Boş Gün Sayısı:</strong> ${calculatelastBirthDate(allDatas.heiferData[0].LastBirthDate)}</p>
        `;

        animalInfo.appendChild(animalInfoCard);

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("li");

            vaccinesList.appendChild(element);

            element.className = "list-group-item";

            element.innerHTML = 
            `
                <strong>${vaccine.VaccineName}</strong> - ${vaccine.VaccineDate}
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
        infoName.innerHTML += "Buzağı Bilgisi<hr>";

        animalInfoCard.innerHTML += 
        `
            <p><strong>İsim:</strong> ${allDatas.animalData[0].Name}</p>
            <p><strong>Doğum Tarihi:</strong> ${allDatas.animalData[0].BirthDate}</p>
            <hr>
            <p><strong>Anne Küpe No:</strong> ${allDatas.animalData[0].MotherEarringNo}</p>
            <p><strong>Anne İsim:</strong> ${allDatas.animalData[0].MotherName}</p>
            <hr>
            <p><strong>Kaç Günlük:</strong> ${daysC}</p>
            <p><strong>2 LT Düşürme Tarihi:</strong> ${lt2Date}</p>
            <p><strong>1 LT Düşürme Tarihi:</strong> ${lt1Date}</p>
            <p><strong>Sütten Kesme Tarihi:</strong> ${shutDateC}</p>
            <p><strong>Sütten Kesmeye Kalan Gün:</strong> ${daysS}</p>

        `;

        animalInfo.appendChild(animalInfoCard);

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("li");

            vaccinesList.appendChild(element);

            element.className = "list-group-item";

            element.innerHTML = 
            `
                <strong>${vaccine.VaccineName}</strong> - ${vaccine.VaccineDate}
            `;
        });

    }
    else if (allDatas.animalData[0].Type === "bull"){
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = allDatas.animalData[0].EarringNo;
        
        // Show Animal Data
        const animalInfoCard = document.getElementById("animalInfoCard");

        const infoName = document.getElementById("infoName");
        infoName.innerHTML += "Dana Bilgisi<hr>";

        animalInfoCard.innerHTML += 
        `
            <p><strong>İsim:</strong> ${allDatas.animalData[0].Name}</p>
            <p><strong>Doğum Tarihi:</strong> ${allDatas.animalData[0].BirthDate}</p>
            <hr>
            <p><strong>Anne Küpe No:</strong> ${allDatas.animalData[0].MotherEarringNo}</p>
            <p><strong>Anne İsim:</strong> ${allDatas.animalData[0].MotherName}</p>
            <hr>
            <p><strong>Kaç Günlük:</strong> ${calculateBullDays(allDatas.animalData[0].BirthDate)}</p>
        `;

        animalInfo.appendChild(animalInfoCard);

        // Show Vaccines Datas
        const vaccinesList = document.getElementById("vaccinesList");
        allDatas.vaccinesData.forEach(vaccine => {
            let element = document.createElement("li");

            vaccinesList.appendChild(element);

            element.className = "list-group-item";

            element.innerHTML = 
            `
                <strong>${vaccine.VaccineName}</strong> - ${vaccine.VaccineDate}
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

