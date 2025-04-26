let buttons = document.getElementById("allButtons");

buttons.addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
        window.electronAPI.openPage(e.target.id);
    }
});