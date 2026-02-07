const loadingTemplate = `
    <div class="flex items-center justify-center h-screen space-x-4">
        <div class="w-28 h-28 border-[16px] border-green-300 border-t-blue-600 rounded-full animate-spin"></div>
        <h2 class="text-xl font-semibold text-gray-800">Hayvan Bilgileri Yükleniyor...</h2>
    </div>
`;

window.addEventListener("DOMContentLoaded", async () => {
    const datas = await window.loading.getDatas();

    document.getElementById("appVersionTag").textContent = "App Version: " + datas.appVersion;
    showDatas(datas.animalsDatas);
    fillDataBoxes(datas.updatedDatas);
});

// If the device is connected the internet, receive last datas.
window.offline.receiveNewDatas((newDatas) => {
    document.getElementById("appVersionTag").textContent = "App Version: " + newDatas.appVersion;
    showDatas(newDatas.animalsDatas);
    fillDataBoxes(newDatas.updatedDatas);
});

window.electronAPI.updateAvailable((version) => {
    const result = window.confirm(`Yeni güncelleme var!\nVersiyon: ${version}\nŞimdi güncellensin mi?`);
    
    if (result) {
        window.electronAPI.updateResponse(true);
        window.confirm("Bu işlem birkaç dakika kadar sürebilir. Uygulama güncellendikten sonra kapanacak ve güncelleme otomatik olarak yüklenecektir.\nLütfen uygulamayı kapatmayın!");
    }
    else {
        window.electronAPI.updateResponse(false);
    }
});

const buttons = document.getElementById("allButtons");
const cowNumber = document.getElementById("cowNumber");
const calfNumber = document.getElementById("calfNumber");
const heiferNumber = document.getElementById("heiferNumber");
const bullNumber = document.getElementById("bullNumber");
const infoContainer = document.getElementById("infoContainer");
const closestCowsContainer = document.getElementById("closestCowsContainer");
const closestHeifersContainer = document.getElementById("closestHeifersContainer");
const settings = document.getElementById("settings");

buttons.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
        window.electronAPI.openPage(e.target.id);
    }
});

settings.addEventListener("click", function () {
    window.electronAPI.openPage("settings");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "F1") {
        const helpBubbles = document.querySelectorAll('.help-bubble');
        helpBubbles.forEach(bubble => {
            bubble.classList.toggle('visible');
        });        
    }
});

function showDatas(datas) {
    let cows = 0;
    let heifers = 0;
    let calves = 0;
    let bulls = 0;

    datas.forEach((animal) => {
        if (animal.Type === "cow") {
            cows++;
        } else if (animal.Type === "heifer") {
            heifers++;
        } else if (animal.Type === "calf") {
            calves++;
        } else if (animal.Type === "bull") {
            bulls++;
        }
    });
    cowNumber.textContent = cows.toString() + " adet inek kayıtlı.";
    heiferNumber.textContent = heifers.toString() + " adet düve kayıtlı.";
    calfNumber.textContent = calves.toString() + " adet buzağı kayıtlı.";
    bullNumber.textContent = bulls.toString() + " adet dana kayıtlı.";
}

function showLoading() {
    infoContainer.innerHTML =
        '<div class="text-gray-500 text-center py-8">Loading...</div>';
    closestCowsContainer.innerHTML =
        '<div class="text-gray-500 text-center py-8">Loading...</div>';
    closestHeifersContainer.innerHTML =
        '<div class="text-gray-500 text-center py-8">Loading...</div>';
    cowNumber.textContent = "Loading...";
    heiferNumber.textContent = "Loading...";
    calfNumber.textContent = "Loading...";
    bullNumber.textContent = "Loading...";
}

function fillDataBoxes(updatedDatas) {
    const heifersContainer = document.getElementById("closestHeifersContainer");
    if (updatedDatas.closestHeifers && updatedDatas.closestHeifers.length > 0) {
        heifersContainer.innerHTML = updatedDatas.closestHeifers
            .map(
                (heifer) => `
          <div class="mb-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div class="font-semibold text-gray-800">${heifer.Name}</div>
            <div class="text-sm text-gray-600">${heifer.EarringNo}</div>
            <div class="text-sm text-gray-600">${heifer.Date}</div>
          </div>
        `
            )
            .join("");
    } else {
        heifersContainer.innerHTML =
            '<div class="text-gray-500 text-center py-8">Yaklaşan Düve Bulunmuyor!</div>';
    }

    // Yaklaşan İnekler
    const cowsContainer = document.getElementById("closestCowsContainer");
    if (updatedDatas.closestCows && updatedDatas.closestCows.length > 0) {
        cowsContainer.innerHTML = updatedDatas.closestCows
            .map(
                (cow) => `
          <div class="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div class="font-semibold text-gray-800">${cow.Name}</div>
            <div class="text-sm text-gray-600">${cow.EarringNo}</div>
            <div class="text-sm text-gray-600">${cow.Date}</div>
          </div>
        `
            )
            .join("");
    } else {
        cowsContainer.innerHTML =
            '<div class="text-gray-500 text-center py-8">Yaklaşan İnek Bulunmuyor!</div>';
    }

    // Bilgi/Güncellemeler
    const infoContainer = document.getElementById("infoContainer");
    if (updatedDatas.info && updatedDatas.info.length > 0) {
        infoContainer.innerHTML = updatedDatas.info
            .map(
                (item) => `
          <div class="mb-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div class="text-sm text-gray-800 mb-2">${item.Info}</div>
            <div class="text-xs text-gray-500">${new Date(
                item.CreatedAt
            ).toLocaleDateString("tr-TR")} ${new Date(
                    item.CreatedAt
                ).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}</div>
          </div>
        `
            )
            .join("");
    } else {
        infoContainer.innerHTML =
            '<div class="text-gray-500 text-center py-8">Güncelleme Yok!</div>';
    }
}
