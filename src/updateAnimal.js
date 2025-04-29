const earringNumberTag = document.getElementById("earringNumberTag");

window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.receiveUpdateDatas((earringNumber) => {
        earringNumberTag.placeholder = earringNumber;
    });
});