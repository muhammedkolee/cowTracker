const loadingTemplate = `
        <style>
            .loader {
                border: 16px solid #90EE90; /* Green */
                border-top: 16px solid #0000FF; /* Blue */
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;">
            <div class="loader"></div>
            <h2 style="margin-left: 10px;">Hayvan Bilgileri Yükleniyor...</h2>
        </div>
`;

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
    showLoading();
    window.animalsAPI.receiveDatas((datas) => {
        showDatas(datas);
    });
});


function showDatas(datas) {
    let cows = 0;
    let heifers = 0;
    let calves = 0;
    let bulls = 0;

    datas.forEach(animal => {
        if (animal.Type === "cow"){
            cows++;
        }
        else if (animal.Type === "heifer"){
            heifers++;
        }
        else if (animal.Type === "calf"){
            calves++;
        }
        else if (animal.Type === "bull"){
            bulls++;
        }
    });
    cowNumber.textContent = cows.toString() + " adet inek kayıtlı.";
    heiferNumber.textContent = heifers.toString() + " adet düve kayıtlı.";
    calfNumber.textContent = calves.toString() + " adet buzağı kayıtlı.";
    bullNumber.textContent = bulls.toString() + " adet dana kayıtlı.";
}

function showLoading() {
    cowNumber.textContent = "Loading...";
    heiferNumber.textContent = "Loading...";
    calfNumber.textContent = "Loading...";
    bullNumber.textContent = "Loading...";
}