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

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});

showDatas(datas);

function showDatas(datas) {
    cowNumber.textContent =
        datas.cows.length.toString() + " adet inek kayıtlı.";
    heiferNumber.textContent =
        datas.heifers.length.toString() + " adet düve kayıtlı.";
    calfNumber.textContent =
        datas.calves.length.toString() + " adet buzağı kayıtlı.";
    bullNumber.textContent =
        datas.bulls.length.toString() + " adet dana kayıtlı.";
}
