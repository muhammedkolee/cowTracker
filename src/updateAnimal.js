const inputsTag = document.getElementById("inputsTag");
const earringNo = document.getElementById("earringNo");
const nameTag = document.getElementById("name");
const birthDate = document.getElementById("birthDate");
const animalType = document.getElementById("animalType");
const motherEarringNo = document.getElementById("motherEarringNo");
const motherName = document.getElementById("motherName");
const lastBirthDate = document.getElementById("lastBirthDate");
const inseminationDate = document.getElementById("inseminationDate");
const bullName = document.getElementById("bullName");
const checkDate = document.getElementById("checkDate");
const gender = document.getElementById("gender");

const updateButton = document.getElementById("updateButton");

window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveUpdateDatas((allDatas) => {
        showDatas(allDatas);
    });
});

window.updateAPI.updateResult((updateResult) => {
    if (updateResult) {
        const confirmed = window.confirm("Hayvan Başarıyla Güncellendi!");
        if (confirmed) {
            window.close();
        }
        else (window.close());
    }
    else {
        window.confirm("İşlem sırasında bir hata meydana geldi!");
    }
})

animalType.addEventListener("change", () => {
    let type = animalType.value;
    
    // Reset all fields to enabled state first
    resetFieldStates();
    
    if (type === "cow"){
        setFieldState(lastBirthDate, true);
        setFieldState(inseminationDate, false);
        setFieldState(bullName, false);
        setFieldState(checkDate, false);
        setFieldState(gender, true);
    }
    else if (type === "heifer"){
        setFieldState(lastBirthDate, false);
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(gender, true);
    }
    else if (type === "calf"){
        setFieldState(lastBirthDate, true);
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(gender, false);
    }
    else if (type === "bull"){
        setFieldState(lastBirthDate, true);
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(gender, true);
    }
});

updateButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    
    const allDatas = {};
    allDatas.animalData = {};

    allDatas.animalData.EarringNo = earringNo.value;
    allDatas.animalData.Name = nameTag.value;
    allDatas.animalData.BirthDate = birthDate.value;
    allDatas.animalData.MotherEarringNo = motherEarringNo.value;
    allDatas.animalData.MotherName = motherName.value;
    allDatas.animalData.Type = animalType.value;
    console.log("type: ", animalType.value);
    
    if (animalType.value === "cow") {
        allDatas.cowData = {};

        allDatas.cowData.EarringNo = earringNo.value;
        allDatas.cowData.Name = nameTag.value;
        allDatas.cowData.InseminationDate = inseminationDate.value;
        allDatas.cowData.BullName = bullName.value;
        allDatas.cowData.CheckedDate = checkDate.value;
    }
    else if (animalType.value === "heifer") {
        allDatas.heiferData = {};

        allDatas.heiferData.EarringNo = earringNo.value;
        allDatas.heiferData.Name = nameTag.value;
        allDatas.heiferData.LastBirthDate = lastBirthDate.value;
    }
    else if (animalType.value === "calf"){
        allDatas.calfData = {};

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
    earringNo.value = allDatas.animalData[0].EarringNo;
    nameTag.value = allDatas.animalData[0].Name;
    birthDate.value = allDatas.animalData[0].BirthDate;
    motherEarringNo.value = allDatas.animalData[0].MotherEarringNo;
    motherName.value = allDatas.animalData[0].MotherName;
    animalType.value = allDatas.animalData[0].Type;

    // Reset all fields first
    resetFieldStates();

    if (allDatas.animalData[0].Type == "cow"){
        setFieldState(lastBirthDate, true);
        inseminationDate.value = allDatas.cowData[0].InseminationDate;
        bullName.value = allDatas.cowData[0].BullName;
        checkDate.value = allDatas.cowData[0].CheckedDate;
        gender.value = "true";
        setFieldState(gender, true);
    }
    else if (allDatas.animalData[0].Type === "heifer"){
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        lastBirthDate.value = allDatas.heiferData[0].LastBirthDate;
        gender.value = "true";
        setFieldState(gender, true);
    }
    else if(allDatas.animalData[0].Type === "calf"){
        setFieldState(inseminationDate, true);
        setFieldState(bullName, true);
        setFieldState(checkDate, true);
        setFieldState(lastBirthDate, true);
        gender.value = allDatas.calfData[0].Gender ? "true" : "false";
        setFieldState(gender, false);
    }
    else if (allDatas.animalData[0].Type === "bull"){
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
        element.classList.add('bg-gray-100', 'cursor-not-allowed', 'opacity-50');
        element.classList.remove('hover:border-primary');
    } else {
        element.classList.remove('bg-gray-100', 'cursor-not-allowed', 'opacity-50');
        element.classList.add('hover:border-primary');
    }
}

// Helper function to reset all field states
function resetFieldStates() {
    const fields = [lastBirthDate, inseminationDate, bullName, checkDate, gender];
    fields.forEach(field => {
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
    updateButton.classList.add('opacity-75', 'cursor-not-allowed');
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
    updateButton.classList.remove('opacity-75', 'cursor-not-allowed');
}