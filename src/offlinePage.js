window.addEventListener("online", () => {
    console.log("Çalıştı");
    window.electronAPI.openMenu();
});