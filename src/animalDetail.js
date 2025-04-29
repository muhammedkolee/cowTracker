// let earringNoTag1 = document.getElementById("earringNoTag");
// earringNoTag1.textContent = "Çalışıyor...";

// After DOM Content Loaded, receive datas.
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM yüklendi.");
    window.electronAPI.receiveDetailDatas((datas) => {
        console.log(datas);
        showDatas(datas);
    });
});

function showDatas(datas) {
    console.log("Fonksiyon çalıştı.")
    if (datas.type === "cow") {
        console.log("If çalıştı.")
        let earringNoTag = document.getElementById("earringNoTag");
        earringNoTag.textContent = datas.earringNo;
    }
}