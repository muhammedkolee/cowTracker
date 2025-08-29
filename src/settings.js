window.addEventListener("DOMContentLoaded", () => {
    window.settingsAPI.receiveSettingsDatas((settingsDatas) => {
        showDatas(settingsDatas);
    });
});

const mainMenu = document.getElementById("mainMenu");
const saveSettings = document.getElementById("saveSettings");
const showInformationButton = document.getElementById("showInformationButton");
const gestationDays = document.getElementById("gestationDays");
const dryOffDays = document.getElementById("dryOffDays");
const calfReduceToOneLiterDays = document.getElementById("calfReduceToOneLiterDays");
const calfReduceToTwoLiterDays = document.getElementById("calfReduceToTwoLiterDays");
const calfWeaningDays = document.getElementById("calfWeaningDays");
const calfToAdultDays = document.getElementById("calfToAdultDays");

mainMenu.addEventListener("click", () => {
    window.electronAPI.openMenu();
});

saveSettings.addEventListener("click", () => {
    const settingsDatas = {
        showInformationButton: showInformationButton.checked,
        gestationDays: gestationDays.value,
        dryOffDays: dryOffDays.value,
        calfReduceToOneLiterDays: calfReduceToOneLiterDays.value,
        calfReduceToTwoLiterDays: calfReduceToTwoLiterDays.value,
        calfWeaningDays: calfWeaningDays.value ,
        calfToAdultDays: calfToAdultDays.value
    }

    window.settingsAPI.saveSettingsDatas(settingsDatas);
    window.confirm("İşlem Başarıyla Tamamlandı!");
    window.electronAPI.openMenu();
});
function showDatas(settingsDatas) {
    showInformationButton.checked = settingsDatas.showInformationButton;
    gestationDays.value = settingsDatas.gestationDays;
    dryOffDays.value = settingsDatas.dryOffDays;
    calfReduceToOneLiterDays.value = settingsDatas.calfReduceToOneLiterDays;
    calfReduceToTwoLiterDays.value = settingsDatas.calfReduceToTwoLiterDays;
    calfWeaningDays.value = settingsDatas.calfWeaningDays;
    calfToAdultDays.value = settingsDatas.calfToAdultDays;
}