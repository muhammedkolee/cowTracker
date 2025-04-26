let menuButton = document.getElementById("btn-menu");

menuButton.addEventListener("click", () => {
    window.electronAPI.openMenu();
});