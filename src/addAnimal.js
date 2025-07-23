const type = document.getElementById("type");
const addAnimalForm = document.getElementById("addAnimalDiv");
const addButton = document.getElementById("addButton");
const addAnimalBody = document.getElementById("addAnimalBody");

// Deneme

const deneme = document.getElementById("deneme");

window.addEventListener("DOMContentLoaded", () => {
    window.addAnimalAPI.receiveAnimalType((animalType) => {
        if (animalType === "cow") {
            addCow();
            type.value = "cow";
        } else if (animalType === "heifer") {
            addHeifer();
            type.value = "heifer";
        } else if (animalType === "calf") {
            addCalf();
            type.value = "calf";
        } else if (animalType === "bull") {
            addBull();
            type.value = "bull";
        }
    });
});

window.addAnimalAPI.addResult((result) => {
    if (result) {
        const confirmed = window.confirm("Hayvan başarıyla eklendi!");
        if (confirmed){
            window.close();
        }
        else {
            window.close();
        }
    }
    else {
        window.confirm("İşlem sırasında bir hata meydana geldi! Tekrar deneyiniz.");
    }
});

addButton.addEventListener("click", () => {
    const newAnimalDatas = {};
    newAnimalDatas.animalDatas = {};

    /*
    
                    animalName
                    earringNo
                    birthDate
                    motherEarringNo
                    motherName
    */

    const earringNo = document.getElementById("earringNo");
    const animalName = document.getElementById("animalName");
    const birthDate = document.getElementById("birthDate");
    const motherEarringNo = document.getElementById("motherEarringNo");
    const motherName = document.getElementById("motherName");
    
    if (type.value === "cow") {
        const inseminationDateInput = document.getElementById("inseminationDateInput");
        const bullNameInput = document.getElementById("bullNameInput");
        const checkInput = document.getElementById("checkInput");
        
        newAnimalDatas.cowDatas = {};
        newAnimalDatas.animalDatas.EarringNo = earringNo.value;
        newAnimalDatas.animalDatas.Name = animalName.value;
        newAnimalDatas.animalDatas.BirthDate = birthDate.value;
        newAnimalDatas.animalDatas.MotherEarringNo = motherEarringNo.value;
        newAnimalDatas.animalDatas.MotherName = motherName.value;
        newAnimalDatas.animalDatas.Type = "cow";
        
        newAnimalDatas.cowDatas.EarringNo = earringNo.value;
        newAnimalDatas.cowDatas.Name = animalName.value;
        newAnimalDatas.cowDatas.InseminationDate = inseminationDateInput.value;
        newAnimalDatas.cowDatas.BullName = bullNameInput.value;
        newAnimalDatas.cowDatas.CheckedDate = checkInput.value;
    }
    else if (type.value === "heifer"){
        const lastBirthDate = document.getElementById("lastBirthDateInput");

        newAnimalDatas.heiferDatas = {};
        newAnimalDatas.animalDatas.EarringNo = earringNo.value;
        newAnimalDatas.animalDatas.Name = animalName.value;
        newAnimalDatas.animalDatas.BirthDate = birthDate.value;
        newAnimalDatas.animalDatas.MotherEarringNo = motherEarringNo.value;
        newAnimalDatas.animalDatas.MotherName = motherName.value;
        newAnimalDatas.animalDatas.Type = "heifer";

        newAnimalDatas.heiferDatas.EarringNo = earringNo.value;
        newAnimalDatas.heiferDatas.Name = animalName.value;
        newAnimalDatas.heiferDatas.LastBirthDate = lastBirthDate.value;
    }
    else if (type.value === "calf"){
        const genderInput = document.getElementById("genderInput");

        newAnimalDatas.calfDatas = {};
        newAnimalDatas.animalDatas.EarringNo = earringNo.value;
        newAnimalDatas.animalDatas.Name = animalName.value;
        newAnimalDatas.animalDatas.BirthDate = birthDate.value;
        newAnimalDatas.animalDatas.MotherEarringNo = motherEarringNo.value;
        newAnimalDatas.animalDatas.MotherName = motherName.value;
        newAnimalDatas.animalDatas.Type = "calf";

        newAnimalDatas.calfDatas.EarringNo = earringNo.value;
        newAnimalDatas.calfDatas.Name = animalName.value;

        if (genderInput.value === "girl"){
            newAnimalDatas.calfDatas.Gender = true; // Dişi ise true
        }
        else {
            newAnimalDatas.calfDatas.Gender = false; // Erkek ise false
        }
    }
    else if (type.value === "bull"){
        newAnimalDatas.animalDatas.EarringNo = earringNo.value;
        newAnimalDatas.animalDatas.Name = animalName.value;
        newAnimalDatas.animalDatas.BirthDate = birthDate.value;
        newAnimalDatas.animalDatas.MotherEarringNo = motherEarringNo.value;
        newAnimalDatas.animalDatas.MotherName = motherName.value;
        newAnimalDatas.animalDatas.Type = "bull";
    }

    addAnimalBody.innerHTML = `
        <style>
            .loader {
                border: 16px solid #f3f3f3; /* Light grey */
                border-top: 16px solid #000000; /* black */
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
            <h2>Hayvan Ekleniyor...</h2>
        </div>
            `;
    window.addAnimalAPI.addAnimal(newAnimalDatas);
});

type.addEventListener("change", () => {
    if (type.value === "cow") {
        addCow();
    } else if (type.value === "heifer") {
        addHeifer();
    } else if (type.value === "calf") {
        addCalf();
    } else if (type.value === "bull") {
        addBull();
    }
});

function addCow() {
    deneme.innerHTML = template;

    // Insemination Date
    let inseminationDateDiv = document.createElement("div");
    let inseminationDateLabel = document.createElement("label");
    let inseminationDateInput = document.createElement("input");
    inseminationDateInput.id = "inseminationDateInput";

    inseminationDateDiv.className = "mb-3";

    inseminationDateLabel.for = "inseminationDateInput";
    inseminationDateLabel.className = "form-label";
    inseminationDateLabel.innerHTML = "<strong>Tohumlama Tarihi</strong>";

    inseminationDateInput.type = "date";
    inseminationDateInput.className = "form-control";
    inseminationDateInput.required = true;

    deneme.appendChild(inseminationDateDiv);
    inseminationDateDiv.appendChild(inseminationDateLabel);
    inseminationDateDiv.appendChild(inseminationDateInput);

    // Bull Name
    let bullNameDiv = document.createElement("div");
    let bullNameLabel = document.createElement("label");
    let bullNameInput = document.createElement("input");
    bullNameInput.id = "bullNameInput";

    bullNameDiv.className = "mb-3";

    bullNameLabel.for = "bullNameInput";
    bullNameLabel.className = "form-label";
    bullNameLabel.innerHTML = "<strong>Dana Adı</strong>";

    bullNameInput.type = "text";
    bullNameInput.className = "form-control";

    deneme.appendChild(bullNameDiv);
    bullNameDiv.appendChild(bullNameLabel);
    bullNameDiv.appendChild(bullNameInput);

    // Check
    let checkDiv = document.createElement("div");
    let checkLabel = document.createElement("label");
    let checkInput = document.createElement("input");
    checkInput.id = "checkInput";

    checkDiv.className = "mb-3";

    checkLabel.for = "checkInput";
    checkLabel.className = "form-label";
    checkLabel.innerHTML = "<strong>Gebelik Kontrol</strong>";

    checkInput.type = "date";
    checkInput.className = "form-control";

    deneme.appendChild(checkDiv);
    checkDiv.appendChild(checkLabel);
    checkDiv.appendChild(checkInput);
}

function addCalf() {
    deneme.innerHTML = template;
    // Gender
    let genderDiv = document.createElement("div");
    let genderLabel = document.createElement("label");
    let genderInput = document.createElement("select");
    genderInput.id = "genderInput";
    let temp = document.createElement("option");
    let girl = document.createElement("option");
    let boy = document.createElement("option");

    genderDiv.className = "mb-3";

    genderLabel.for = "genderInput";
    genderLabel.className = "form-label";
    genderLabel.innerHTML = "<strong>Cinsiyet</strong>";

    girl.value = "girl";
    girl.text = "Dişi";
    boy.value = "boy";
    boy.text = "Erkek";

    genderInput.className = "form-select";
    genderInput.required = true;

    deneme.appendChild(genderDiv);
    genderDiv.appendChild(genderLabel);
    genderDiv.appendChild(genderInput);
    genderInput.appendChild(temp);
    genderInput.appendChild(girl);
    genderInput.appendChild(boy);
}

function addHeifer() {
    deneme.innerHTML = template;
    // Last Birth Date
    let lastBirthDateDiv = document.createElement("div");
    let lastBirthDateLabel = document.createElement("label");
    let lastBirthDateInput = document.createElement("input");
    lastBirthDateInput.id = "lastBirthDateInput";

    lastBirthDateDiv.className = "mb-3";

    lastBirthDateLabel.for = "lastBirthDateInput";
    lastBirthDateLabel.className = "form-label";
    lastBirthDateLabel.innerHTML = "<strong>Son Doğurduğu Tarih</strong>";

    lastBirthDateInput.type = "date";
    lastBirthDateInput.className = "form-control";

    deneme.appendChild(lastBirthDateDiv);
    lastBirthDateDiv.appendChild(lastBirthDateLabel);
    lastBirthDateDiv.appendChild(lastBirthDateInput);
}

function addBull() {
    deneme.innerHTML = template;
}

/*
<div class="mb-3">
                    <label for="type" class="form-label"><strong>Türü</strong></label>
                    <select class="form-select" id="type">
                        <option value="">Seçiniz</option>
                        <option value="cow">İnek</option>
                        <option value="heifer">Düve</option>
                        <option value="calf">Buzağı</option>
                        <option value="bull">Dana</option>
                    </select>
                </div>
*/
const template = `

                    <div class="mb-3">
                        <label for="cowName" class="form-label"><strong>Hayvan Adı</strong></label>
                        <input type="text" class="form-control" id="animalName"/>
                    </div>

                    <div class="mb-3">
                        <label for="earringNo" class="form-label"><strong>Küpe Numarası</strong></label>
                        <input type="text" class="form-control" id="earringNo" required/>
                    </div>

                    <div class="mb-3">
                        <label for="birthDate" class="form-label"><strong>Doğum Tarihi</strong></label>
                        <input type="date" class="form-control" id="birthDate"/>
                    </div>

                    <div class="mb-3">
                        <label for="motherEarringNo" class="form-label"><strong>Anne Küpe Numarası</strong></label>
                        <input type="text" class="form-control" id="motherEarringNo"/>
                    </div>

                    <div class="mb-3">
                        <label for="motherEarringNo" class="form-label"><strong>Anne Adı</strong></label>
                        <input type="text" class="form-control" id="motherName"/>
                    </div>
    `;
