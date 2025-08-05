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

animalType.addEventListener("change", () => {
    let type = animalType.value;
    if (type === "cow"){
        lastBirthDate.disabled = true;
        inseminationDate.disabled = false;
        bullName.disabled = false;
        checkDate.disabled = false;
        gender.disabled = true;
    }
    else if (type === "heifer"){
        lastBirthDate.disabled = false;
        inseminationDate.disabled = true;
        bullName.disabled = true;
        checkDate.disabled = true;
        gender.disabled = true;
    }
    else if (type === "calf"){
        lastBirthDate.disabled = true;
        inseminationDate.disabled = true;
        bullName.disabled = true;
        checkDate.disabled = true;
        gender.disabled = false;
    }
    else if (type === "bull"){
        lastBirthDate.disabled = true;
        inseminationDate.disabled = true;
        bullName.disabled = true;
        checkDate.disabled = true;
        gender.disabled = true;
    }
});

updateButton.addEventListener("click", () => {
    allDatas = {};
    allDatas.animalData = {};

    allDatas.animalData.EarringNo = earringNo.value;
    allDatas.animalData.Name = name.value;
    allDatas.animalData.BirthDate = birthDate.value;
    allDatas.animalData.MotherEarringNo = motherEarringNo.value;
    allDatas.animalData.MotherName = motherName.value;
    allDatas.animalData.Type = animalType.value;
    console.log("type: ", animalType.value);
    
    if (animalType.value === "cow") {
        allDatas.cowData = {};

        allDatas.cowData.EarringNo = earringNo.value;
        allDatas.cowData.Name = name.value;
        allDatas.cowData.InseminationDate = inseminationDate.value;
        allDatas.cowData.BullName = bullName.value;
        allDatas.cowData.CheckedDate = checkDate.value;
        // allDatas.animalData.Type = "cow";
    }
    else if (animalType.value === "heifer") {
        allDatas.heiferData = {};

        allDatas.heiferData.EarringNo = earringNo.value;
        allDatas.heiferData.Name = name.value;
        allDatas.heiferData.LastBirthDate = lastBirthDate.value;
        // allDatas.animalData.Type = "heifer";
    }
    else if (animalType.value === "calf"){
        console.log("updateAnimal.js girildi");
        allDatas.calfData = {};

        allDatas.calfData.EarringNo = earringNo.value;
        allDatas.calfData.Name = name.value;
        allDatas.calfData.Gender = gender.value === "true" ? true : false;
        allDatas.calfData.BirthDate = birthDate.value;
        // allDatas.animalData.Type = "calf";
    }

    window.updateAPI.updateAnimalDatas(allDatas);
});

function showDatas(allDatas) {
    earringNo.value = allDatas.animalData[0].EarringNo;
    nameTag.value = allDatas.animalData[0].Name;
    birthDate.value = allDatas.animalData[0].BirthDate;
    motherEarringNo.value = allDatas.animalData[0].MotherEarringNo;
    motherName.value = allDatas.animalData[0].MotherName;
    animalType.value = allDatas.animalData[0].Type;

    if (allDatas.animalData[0].Type == "cow"){
        lastBirthDate.disabled = true;
        inseminationDate.value = allDatas.cowData[0].InseminationDate;
        bullName.value = allDatas.cowData[0].BullName;
        checkDate.value = allDatas.cowData[0].CheckedDate;
        gender.value = "true";
        gender.disabled = true;
    }
    else if (allDatas.animalData[0].Type === "heifer"){
        inseminationDate.disabled = true;
        bullName.disabled = true;
        checkDate.disabled = true;
        lastBirthDate.value = allDatas.heiferData[0].LastBirthDate;
        gender.value = "true";
        gender.disabled = true;
    }
    else if(allDatas.animalData[0].Type === "calf"){
        inseminationDate.disabled = true;
        bullName.disabled = true;
        checkDate.disabled = true;
        lastBirthDate.disabled = true;
        gender.value = allDatas.calfData[0].Gender ? "true" : "false";
        gender.disabled = false;
    }
    else if (allDatas.animalData[0].Type === "bull"){
        inseminationDate.disabled = true;
        bullName.disabled = true;
        checkDate.disabled = true;
        lastBirthDate.disabled = true;
        gender.value = "false";
        gender.disabled = true;  
    }
}

// function parseTurkishDate(wDate) {
//     let [day, month, year] = wDate.split(".");
//     return `${year}-${month}-${day}`;
// }