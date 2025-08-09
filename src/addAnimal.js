const type = document.getElementById("type");
const addAnimalForm = document.getElementById("addAnimalForm");
const addButton = document.getElementById("addButton");
const addAnimalBody = document.getElementById("addAnimalBody");

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
        newAnimalDatas.calfDatas.BirthDate = birthDate.value;

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

    // Show loading screen with Tailwind classes
    addAnimalBody.innerHTML = `
        <div class="min-h-screen bg-gray-50 flex items-center justify-center">
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
                <h2 class="text-2xl font-semibold text-gray-700">Hayvan Ekleniyor...</h2>
                <p class="text-gray-500 mt-2">Lütfen bekleyiniz</p>
            </div>
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

    inseminationDateDiv.className = "space-y-2 pb-2";

    inseminationDateLabel.htmlFor = "inseminationDateInput";
    inseminationDateLabel.className = "block text-sm font-semibold text-gray-700";
    inseminationDateLabel.innerHTML = "Tohumlama Tarihi";

    inseminationDateInput.type = "date";
    inseminationDateInput.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200";
    inseminationDateInput.required = true;

    deneme.appendChild(inseminationDateDiv);
    inseminationDateDiv.appendChild(inseminationDateLabel);
    inseminationDateDiv.appendChild(inseminationDateInput);

    // Bull Name
    let bullNameDiv = document.createElement("div");
    let bullNameLabel = document.createElement("label");
    let bullNameInput = document.createElement("input");
    bullNameInput.id = "bullNameInput";

    bullNameDiv.className = "space-y-2 mt-6";

    bullNameLabel.htmlFor = "bullNameInput";
    bullNameLabel.className = "block text-sm font-semibold text-gray-700";
    bullNameLabel.innerHTML = "Dana Adı";

    bullNameInput.type = "text";
    bullNameInput.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200";

    deneme.appendChild(bullNameDiv);
    bullNameDiv.appendChild(bullNameLabel);
    bullNameDiv.appendChild(bullNameInput);

    // Check
    let checkDiv = document.createElement("div");
    let checkLabel = document.createElement("label");
    let checkInput = document.createElement("input");
    checkInput.id = "checkInput";

    checkDiv.className = "space-y-2 mt-6";

    checkLabel.htmlFor = "checkInput";
    checkLabel.className = "block text-sm font-semibold text-gray-700";
    checkLabel.innerHTML = "Gebelik Kontrol";

    checkInput.type = "date";
    checkInput.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200";

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

    genderDiv.className = "space-y-2 mt-6";

    genderLabel.htmlFor = "genderInput";
    genderLabel.className = "block text-sm font-semibold text-gray-700";
    genderLabel.innerHTML = "Cinsiyet";

    temp.value = "";
    temp.text = "Seçiniz";
    girl.value = "girl";
    girl.text = "Dişi";
    boy.value = "boy";
    boy.text = "Erkek";

    genderInput.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200";
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

    lastBirthDateDiv.className = "space-y-2 mt-6";

    lastBirthDateLabel.htmlFor = "lastBirthDateInput";
    lastBirthDateLabel.className = "block text-sm font-semibold text-gray-700";
    lastBirthDateLabel.innerHTML = "Son Doğurduğu Tarih";

    lastBirthDateInput.type = "date";
    lastBirthDateInput.className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200";

    deneme.appendChild(lastBirthDateDiv);
    lastBirthDateDiv.appendChild(lastBirthDateLabel);
    lastBirthDateDiv.appendChild(lastBirthDateInput);
}

function addBull() {
    deneme.innerHTML = template;
}

// Updated template with Tailwind classes
const template = `
    <div class="space-y-6">
        <div class="space-y-2">
            <label for="animalName" class="block text-sm font-semibold text-gray-700">Hayvan Adı</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200" id="animalName"/>
        </div>

        <div class="space-y-2">
            <label for="earringNo" class="block text-sm font-semibold text-gray-700">Küpe Numarası</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200" id="earringNo" required/>
        </div>

        <div class="space-y-2">
            <label for="birthDate" class="block text-sm font-semibold text-gray-700">Doğum Tarihi</label>
            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200" id="birthDate"/>
        </div>

        <div class="space-y-2">
            <label for="motherEarringNo" class="block text-sm font-semibold text-gray-700">Anne Küpe Numarası</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200" id="motherEarringNo"/>
        </div>

        <div class="space-y-2">
            <label for="motherName" class="block text-sm font-semibold text-gray-700">Anne Adı</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200" id="motherName"/>
        </div>
    </div>
`;