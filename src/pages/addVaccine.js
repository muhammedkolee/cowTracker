window.addEventListener("DOMContentLoaded", () => {
    window.vaccineAPI.receiveAnimalsDatas((animalsDatas) => {
        fillAnimalList(animalsDatas);
    });
});

function fillAnimalList(animals) {
    const container = document.getElementById("animalList");
    container.innerHTML = "";

    animals.forEach((animal) => {
        const label = document.createElement("label");
        label.className = "flex items-center gap-3 px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-150";
        label.dataset.earring = animal.EarringNo.toLowerCase();
        label.dataset.name = animal.Name.toLowerCase();

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = animal.Id;
        checkbox.name = "animalCheckbox";
        checkbox.className = "animal-checkbox w-4 h-4 flex-shrink-0 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer";

        const span = document.createElement("span");
        span.className = "text-sm font-medium text-gray-700 truncate";
        span.textContent = `${animal.EarringNo} - ${animal.Name}`;

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });

    // Arama fonksiyonu
    document.getElementById("animalSearch").addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        const labels = container.querySelectorAll("label");

        labels.forEach((label) => {
            const match =
                label.dataset.earring.includes(query) ||
                label.dataset.name.includes(query);
            label.style.display = match ? "flex" : "none";
        });
    });
}

const addVaccineButton = document.getElementById("addVaccineButton");

addVaccineButton.addEventListener("click", () => {
    addVaccine();
    window.close();
});

// Tüm Hayvanlar radio button kontrolü
document.getElementById("allAnimals").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("cows").checked = true;
        document.getElementById("heifers").checked = true;
        document.getElementById("bulls").checked = true;
        document.getElementById("calves").checked = true;

        // Bireysel hayvan listesini devre dışı bırak
        setAnimalListDisabled(true);
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

    const allSelected = allCheckboxes.every((cb) => cb.checked);
    const anySelected = allCheckboxes.some((cb) => cb.checked);

    if (allSelected) {
        document.getElementById("allAnimals").checked = true;
        setAnimalListDisabled(true);
    } else {
        document.getElementById("allAnimals").checked = false;
        setAnimalListDisabled(anySelected); // herhangi biri seçiliyse listeyi kapat
    }
}

// Hayvan listesini etkinleştir/devre dışı bırak
function setAnimalListDisabled(disabled) {
    const checkboxes = document.querySelectorAll(".animal-checkbox");
    const container = document.getElementById("animalList");

    checkboxes.forEach((cb) => {
        cb.disabled = disabled;
        if (disabled) cb.checked = false;
    });

    container.style.opacity = disabled ? "0.4" : "1";
    container.style.pointerEvents = disabled ? "none" : "auto";
}

// Tür checkbox'ları için event listener
const typeCheckboxes = document.querySelectorAll('input[type="checkbox"].type-checkbox');
typeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        if (!this.checked) {
            document.getElementById("allAnimals").checked = false;
        }
        checkAllSelected();
    });
});

// Bugünün tarihini varsayılan olarak ayarla
document.getElementById("vaccineDate").valueAsDate = new Date();

function addVaccine() {
    const vaccineDatas = {};
    const selectedAnimals = [...document.querySelectorAll(".animal-checkbox:checked")];

    const anyTypeSelected =
        document.getElementById("cows").checked ||
        document.getElementById("heifers").checked ||
        document.getElementById("bulls").checked ||
        document.getElementById("calves").checked;

    vaccineDatas.VaccineName = document.getElementById("vaccineName").value;
    vaccineDatas.VaccineDate = document.getElementById("vaccineDate").value;

    if (document.getElementById("allAnimals").checked) {
        vaccineDatas.all = true;

    } else if (anyTypeSelected) {
        vaccineDatas.types = {};
        if (document.getElementById("cows").checked) vaccineDatas.types.cows = true;
        if (document.getElementById("heifers").checked) vaccineDatas.types.heifers = true;
        if (document.getElementById("calves").checked) vaccineDatas.types.calves = true;
        if (document.getElementById("bulls").checked) vaccineDatas.types.bulls = true;

    } else if (selectedAnimals.length > 0) {
        // Birden fazla seçilen bireysel hayvan
        vaccineDatas.AnimalIds = selectedAnimals.map((cb) => cb.value);
    }

    // Formu sıfırla
    document.getElementById("vaccineName").value = "";
    document.getElementById("vaccineDate").valueAsDate = new Date();
    document.getElementById("allAnimals").checked = false;
    document.getElementById("cows").checked = false;
    document.getElementById("heifers").checked = false;
    document.getElementById("calves").checked = false;
    document.getElementById("bulls").checked = false;
    document.querySelectorAll(".animal-checkbox").forEach((cb) => (cb.checked = false));
    setAnimalListDisabled(false);

    window.vaccineAPI.sendVaccineDatas(vaccineDatas);
}