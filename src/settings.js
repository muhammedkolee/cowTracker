window.addEventListener("DOMContentLoaded", () => {
    window.settingsAPI.receiveSettingsDatas((settingsDatas) => {
        showDatas(settingsDatas);
    });
});

window.electronAPI.updateAvailable((event, version) => {
    const result = window.confirm(`Yeni güncelleme var!\nVersiyon: ${version}\nŞimdi güncellensin mi?`);
    if (result) {
        window.electronAPI.updateResponse(true);
        window.confirm("Bu işlem birkaç dakika kadar sürebilir. Uygulama güncellendikten sonra kapanacak ve güncelleme otomatik olarak yüklenecektir.\nLütfen uygulamayı kapatmayın!");
    }
    else {
        window.electronAPI.updateResponse(false);
    }
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