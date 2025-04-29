const type = document.getElementById("type");
const addAnimalForm = document.getElementById("addAnimalDiv");

const deneme = document.getElementById("deneme");

window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveAnimalType((animalType) => {
        if (animalType === "cow"){
            addCow();
            type.value = "cow";
        }
        else if (animalType === "heifer"){
            addHeifer();
            type.value = "heifer";
        }
        else if (animalType === "calf"){
            addCalf();
            type.value = "calf";
        }
        else if (animalType === "bull"){
            addBull();
            type.value = "bull";
        }
    });
});
    
type.addEventListener("change", () => {
    if (type.value === "cow"){
        addCow();
    }
    else if (type.value === "heifer"){
        addHeifer();
    }
    else if (type.value === "calf"){
        addCalf();
    }
    else if (type.value === "bull"){
        addBull();
    }
});

function addCow() {
    deneme.innerHTML = template;

    // Insemination Date
    let inseminationDateDiv = document.createElement("div");
    let inseminationDateLabel = document.createElement("label");
    let inseminationDateInput = document.createElement("input");

    inseminationDateDiv.className = "mb-3";

    inseminationDateLabel.for = "inseminationDateInput";
    inseminationDateLabel.className = "form-label";
    inseminationDateLabel.innerHTML = "<strong>Tohumlama Tarihi</strong>";

    inseminationDateInput.type = "text";
    inseminationDateInput.className = "form-control";
    inseminationDateInput.required = true;

    deneme.appendChild(inseminationDateDiv);
    inseminationDateDiv.appendChild(inseminationDateLabel);
    inseminationDateDiv.appendChild(inseminationDateInput);


    // Bull Name
    let bullNameDiv = document.createElement("div");
    let bullNameLabel = document.createElement("label");
    let bullNameInput = document.createElement("input");

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

const template = `
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
    `