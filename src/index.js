const loadingTemplate = `
    <div class="flex items-center justify-center h-screen space-x-4">
        <div class="w-28 h-28 border-[16px] border-green-300 border-t-blue-600 rounded-full animate-spin"></div>
        <h2 class="text-xl font-semibold text-gray-800">Hayvan Bilgileri Yükleniyor...</h2>
    </div>
`;

const buttons = document.getElementById("allButtons");
const cowNumber = document.getElementById("cowNumber");
const calfNumber = document.getElementById("calfNumber");
const heiferNumber = document.getElementById("heiferNumber");
const bullNumber = document.getElementById("bullNumber");

buttons.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
        window.electronAPI.openPage(e.target.id);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    showLoading();
    window.animalsAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

function showDatas(datas) {
    let cows = 0;
    let heifers = 0;
    let calves = 0;
    let bulls = 0;

    datas.forEach(animal => {
        if (animal.Type === "cow"){
            cows++;
        }
        else if (animal.Type === "heifer"){
            heifers++;
        }
        else if (animal.Type === "calf"){
            calves++;
        }
        else if (animal.Type === "bull"){
            bulls++;
        }
    });
    cowNumber.textContent = cows.toString() + " adet inek kayıtlı.";
    heiferNumber.textContent = heifers.toString() + " adet düve kayıtlı.";
    calfNumber.textContent = calves.toString() + " adet buzağı kayıtlı.";
    bullNumber.textContent = bulls.toString() + " adet dana kayıtlı.";
}

function showLoading() {
    cowNumber.textContent = "Loading...";
    heiferNumber.textContent = "Loading...";
    calfNumber.textContent = "Loading...";
    bullNumber.textContent = "Loading...";
}
