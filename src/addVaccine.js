
window.addEventListener("DOMContentLoaded", () => {
    console.log("Dom yüklendi!");
    window.vaccineAPI.receiveAnimalsDatas((animalsDatas) => {
        console.log("veriler geldi: ", animalsDatas)
        fillAnimalSelect(animalsDatas);
    });
});


// Fill up the select tag
function fillAnimalSelect(animals) {
    const select = document.getElementById("animalEarringNo");
    
    animals.forEach((animal) => {
        const option = document.createElement("option");
        option.value = animal.Id;
        option.textContent = `${animal.EarringNo} - ${animal.Name}`;
        select.appendChild(option);
    });
}

const addVaccineButton = document.getElementById("addVaccineButton");

// Press Add Vaccine Button
addVaccineButton.addEventListener("click", () => {
    addVaccine();
    window.close();
});

// Select tagını devre dışı bırakma ve temizleme fonksiyonu
function disableAndClearSelect() {
    const select = document.getElementById("animalEarringNo");
    select.disabled = true;
    select.value = ""; // Seçili değeri temizle
    select.style.backgroundColor = "#f3f4f6"; // Görsel olarak devre dışı göster
    select.style.cursor = "not-allowed";
}

// Select tagını etkinleştirme fonksiyonu
function enableSelect() {
    const select = document.getElementById("animalEarringNo");
    select.disabled = false;
    select.style.backgroundColor = "white";
    select.style.cursor = "default";
}

// Tüm Hayvanlar radio button kontrolü
document.getElementById("allAnimals").addEventListener("change", function () {
    if (this.checked) {
        // Tüm checkbox'ları seç
        document.getElementById("cows").checked = true;
        document.getElementById("heifers").checked = true;
        document.getElementById("bulls").checked = true;
        document.getElementById("calves").checked = true;
        
        // Select tagını devre dışı bırak
        disableAndClearSelect();
    }
});

// Checkbox'ların durumunu kontrol eden fonksiyon
function checkAllSelected() {
    const allCheckboxes = [
        document.getElementById("cows"),
        document.getElementById("heifers"),
        document.getElementById("bulls"),
        document.getElementById("calves"),
    ];

    const allSelected = allCheckboxes.every((checkbox) => checkbox.checked);
    const anySelected = allCheckboxes.some((checkbox) => checkbox.checked);

    if (allSelected) {
        document.getElementById("allAnimals").checked = true;
        disableAndClearSelect();
    } else {
        document.getElementById("allAnimals").checked = false;
        
        // Eğer hiçbir checkbox seçili değilse select'i etkinleştir
        if (!anySelected) {
            enableSelect();
        } else {
            // En az bir checkbox seçiliyse select'i devre dışı bırak
            disableAndClearSelect();
        }
    }
}

// Her checkbox için event listener ekle
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        // Eğer checkbox seçimi kaldırıldıysa "Tüm Hayvanlar"ı da kaldır
        if (!this.checked) {
            document.getElementById("allAnimals").checked = false;
        }
        
        // Checkbox durumlarını kontrol et ve select'i buna göre ayarla
        checkAllSelected();
    });
});

// Bugünün tarihini varsayılan olarak ayarla
document.getElementById("vaccineDate").valueAsDate = new Date();

function addVaccine() {
    const vaccineDatas = {}
    const select = document.getElementById("animalEarringNo");
    if (select.disabled) {
        if (document.getElementById("allAnimals").checked) {
            vaccineDatas.all = true;
            vaccineDatas.VaccineName = document.getElementById("vaccineName").value;
            vaccineDatas.VaccineDate = document.getElementById("vaccineDate").value;

        }
        else {
            vaccineDatas.types = {}
            if (document.getElementById("cows").checked) {
                vaccineDatas.types.cows = true;
            }
            if (document.getElementById("heifers").checked) {
                vaccineDatas.types.heifers = true;
            }
            if (document.getElementById("calves").checked) {
                vaccineDatas.types.calves = true;
            }
            if (document.getElementById("bulls").checked) {
                vaccineDatas.types.bulls = true;
            }
            vaccineDatas.VaccineName = document.getElementById("vaccineName").value;
            vaccineDatas.VaccineDate = document.getElementById("vaccineDate").value;
        }
    }
    else {
        vaccineDatas.VaccineName = document.getElementById("vaccineName").value;
        vaccineDatas.AnimalId = select.value;
        vaccineDatas.VaccineDate = document.getElementById("vaccineDate").value;
    }
    
    document.getElementById("animalEarringNo").value = "";
    document.getElementById("animalEarringNo").disabled = false;
    document.getElementById("vaccineName").value = "";
    document.getElementById("vaccineDate").valueAsDate = new Date();
    document.getElementById("allAnimals").checked = false;
    document.getElementById("cows").checked = false;
    document.getElementById("heifers").checked = false;
    document.getElementById("calves").checked = false;
    document.getElementById("bulls").checked = false;

    console.log(vaccineDatas)
    window.vaccineAPI.sendVaccineDatas(vaccineDatas);
}