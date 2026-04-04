window.addEventListener("DOMContentLoaded", async () => {
    await window.middleware.checkSessionHandle();

    // if(await window.middleware.checkSessionHandle()){
    //     await window.loading.isOnline(true);
    // }
    // else {
    //     await window.loading.isOnline(false);
    // }
});


let texts = ["Ayarlar yükleniyor...", "Buzağılar seviliyor...", "İnekler sağılıyor...", "Danalar besleniyor...", "Köpekler besleniyor...", "Buzağılar emziriliyor...", "Aşılar yapılıyor...", "Gübre çukuru boşaltılıyor...", "Tarlalar ekiliyor...", "Boyun kilitleri tamir ediliyor..."]
const subText = document.getElementById("subText");

setInterval(() => {
    randomTextIndex = Math.floor(Math.random() * texts.length);
    if (subText.textContent == texts[randomTextIndex]) {
        subText.innerHTML = texts[(randomTextIndex) + 1 == texts.length ? texts[randomTextIndex - 1] : texts[randomTextIndex + 1]]
    }
    subText.innerHTML = texts[randomTextIndex]
}, 1500);