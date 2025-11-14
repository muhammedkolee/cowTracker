const inputsTag = document.getElementById("inputsTag");
const animalId = document.getElementById("animalId");
const earringNo = document.getElementById("earringNo");
const nameTag = document.getElementById("name");
const breed = document.getElementById("breed");
const birthDate = document.getElementById("birthDate");
const animalType = document.getElementById("animalType");
const motherEarringNo = document.getElementById("motherEarringNo");
const motherName = document.getElementById("motherName");
const lastBirthDate = document.getElementById("lastBirthDate");
const inseminationDate = document.getElementById("inseminationDate");
const bullName = document.getElementById("bullName");
const checkDate = document.getElementById("checkDate");
const gender = document.getElementById("gender");
const notes = document.getElementById("notes");

const updateButton = document.getElementById("updateButton");

let motherAnimalsData = [];
let bullsData = [];

window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveUpdateDatas((allDatas) => {
        showDatas(allDatas);
    });

    window.addAnimalAPI.receiveMothersEarringNo((EarringNos) => {
        motherAnimalsData = EarringNos;
        setupMotherEarringSelection();
    });

    window.addAnimalAPI.receiveBullsName((Names) => {
        bullsData = Names;
        setupBullEarringSelection();
    });
});

window.updateAPI.updateResult((updateResult) => {
    if (updateResult) {
        const confirmed = window.confirm("Hayvan Başarıyla Güncellendi!");
        if (confirmed) {
            window.close();
        } else window.close();
    } else {
        window.confirm("İşlem sırasında bir hata meydana geldi!");
    }
});

function setupMotherEarringSelection() {
    const motherEarringInput = document.getElementById("motherEarringNo");
    const datalist = document.getElementById("motherEarringNoDatalist");

    if (!motherEarringInput || !datalist) return;

    // Datalist'i doldur
    datalist.innerHTML = "";
    motherAnimalsData.forEach((animal) => {
        const option = document.createElement("option");
        option.value = animal.EarringNo;
        option.textContent = `${animal.EarringNo} - ${animal.Name}`;
        datalist.appendChild(option);
    });

    // Input değiştiğinde anne adını güncelle
    motherEarringInput.addEventListener("input", updateMotherName);
    motherEarringInput.addEventListener("change", updateMotherName);
}

function updateMotherName() {
    const selectedEarringNo = document.getElementById("motherEarringNo").value;
    const motherNameInput = document.getElementById("motherName");

    if (!motherNameInput) return;

    // Seçilen küpe numarasına karşılık gelen hayvanı bul
    const selectedAnimal = motherAnimalsData.find(
        (animal) => animal.EarringNo === selectedEarringNo
    );

    if (selectedAnimal) {
        motherNameInput.value = selectedAnimal.Name;
        motherNameInput.classList.remove("bg-gray-50");
        motherNameInput.classList.add("bg-white");
    } else {
        motherNameInput.value = "";
        motherNameInput.classList.remove("bg-white");
        motherNameInput.classList.add("bg-gray-50");
    }
}

function setupBullEarringSelection() {
    const bullDatalist = document.getElementById("bullDatalist");
    const bullNameInput = document.getElementById("bullName");

    if(!bullNameInput || !bullDatalist) 
    {
        console.log("Hata");
        return
    }
    bullDatalist.innerHTML = "";
    bullsData.forEach((animal) => {
        const option = document.createElement("option");
        option.value = animal.Name;
        bullDatalist.appendChild(option);
    });
}

animalType.addEventListener("change", () => {
    let type = animalType.value;

    // Reset all fields to enabled state first
    resetFieldStates();

    if (type === "cow") {
        setFieldState(lastBirthDate, true);
        setFieldState(inseminationDate, false);
        setFieldState(bullName, false);
        setFieldState(checkDate, false);
        setFieldState(gender, true);
    } else if (type === "heifer") {
        setFieldState(lastBirthDate, false);
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(gender, true);
    } else if (type === "calf") {
        setFieldState(lastBirthDate, true);
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(gender, false);
    } else if (type === "bull") {
        setFieldState(lastBirthDate, true);
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(gender, true);
    }
});

updateButton.addEventListener("click", (e) => {
    e.preventDefault();

    const allDatas = {};
    allDatas.animalData = {};

    allDatas.animalData.Id = animalId.value;
    allDatas.animalData.EarringNo = earringNo.value;
    allDatas.animalData.Name = nameTag.value;
    allDatas.animalData.Breed = breed.value;
    allDatas.animalData.BirthDate = birthDate.value;
    allDatas.animalData.MotherEarringNo = motherEarringNo.value;
    allDatas.animalData.MotherName = motherName.value;
    allDatas.animalData.Type = animalType.value;
    allDatas.animalData.Note = notes.value;

    if (animalType.value === "cow") {
        allDatas.cowData = {};

        allDatas.cowData.Id = animalId.value;
        allDatas.cowData.EarringNo = earringNo.value;
        allDatas.cowData.Name = nameTag.value;
        allDatas.cowData.InseminationDate = inseminationDate.value;
        allDatas.cowData.BullName = bullName.value;
        if (checkDate.value == "") {
            allDatas.cowData.CheckedDate = "1970-01-01";
        } else {
            allDatas.cowData.CheckedDate = checkDate.value;
        }
    } else if (animalType.value === "heifer") {
        allDatas.heiferData = {};

        allDatas.heiferData.Id = animalId.value;
        allDatas.heiferData.EarringNo = earringNo.value;
        allDatas.heiferData.Name = nameTag.value;
        allDatas.heiferData.LastBirthDate = lastBirthDate.value;
    } else if (animalType.value === "calf") {
        allDatas.calfData = {};

        allDatas.calfData.Id = animalId.value;
        allDatas.calfData.EarringNo = earringNo.value;
        allDatas.calfData.Name = nameTag.value;
        allDatas.calfData.Gender = gender.value === "true" ? true : false;
        allDatas.calfData.BirthDate = birthDate.value;
    }

    // Show loading state
    showLoadingState();

    window.updateAPI.updateAnimalDatas(allDatas);
});

function showDatas(allDatas) {
    animalId.value = allDatas.animalData[0].Id;
    earringNo.value = allDatas.animalData[0].EarringNo;
    nameTag.value = allDatas.animalData[0].Name;
    breed.value =
        allDatas.animalData[0].Breed === "Simmental"
            ? "Simental"
            : allDatas.animalData[0].Breed === "Angus"
            ? "Angus"
            : allDatas.animalData[0].Breed;
    birthDate.value = allDatas.animalData[0].BirthDate;
    motherEarringNo.value = allDatas.animalData[0].MotherEarringNo;
    motherName.value = allDatas.animalData[0].MotherName;
    animalType.value = allDatas.animalData[0].Type;
    notes.value = allDatas.animalData[0].Note;

    // Reset all fields first
    resetFieldStates();

    if (allDatas.animalData[0].Type == "cow") {
        setFieldState(lastBirthDate, true);
        inseminationDate.value = allDatas.cowData[0].InseminationDate;
        bullName.value = allDatas.cowData[0].BullName;
        if (allDatas.cowData[0].CheckedDate != "1970-01-01") {
            checkDate.value = allDatas.cowData[0].CheckedDate;
        }
        gender.value = "true";
        setFieldState(gender, true);
    } else if (allDatas.animalData[0].Type === "heifer") {
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        lastBirthDate.value = allDatas.heiferData[0].LastBirthDate;
        gender.value = "true";
        setFieldState(gender, true);
    } else if (allDatas.animalData[0].Type === "calf") {
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(lastBirthDate, true);
        gender.value = allDatas.calfData[0].Gender ? "true" : "false";
        setFieldState(gender, false);
    } else if (allDatas.animalData[0].Type === "bull") {
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(lastBirthDate, true);
        gender.value = "false";
        setFieldState(gender, true);
    }
}

// Helper function to set field state with Tailwind classes
function setFieldState(element, disabled) {
    element.disabled = disabled;
    if (disabled) {
        element.classList.add(
            "bg-gray-100",
            "cursor-not-allowed",
            "opacity-50"
        );
        element.classList.remove("hover:border-primary");
    } else {
        element.classList.remove(
            "bg-gray-100",
            "cursor-not-allowed",
            "opacity-50"
        );
        element.classList.add("hover:border-primary");
    }
}

// Helper function to reset all field states
function resetFieldStates() {
    const fields = [
        lastBirthDate,
        inseminationDate,
        bullName,
        checkDate,
        gender,
    ];
    fields.forEach((field) => {
        setFieldState(field, false);
    });
}

// Show loading state on button
function showLoadingState() {
    updateButton.disabled = true;
    updateButton.innerHTML = `
        <span class="flex items-center space-x-2">
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Kaydediliyor...</span>
        </span>
    `;
    updateButton.classList.add("opacity-75", "cursor-not-allowed");
}

// Reset button state (call this when update is complete)
function resetButtonState() {
    updateButton.disabled = false;
    updateButton.innerHTML = `
        <span class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Kaydet</span>
        </span>
    `;
    updateButton.classList.remove("opacity-75", "cursor-not-allowed");
}
