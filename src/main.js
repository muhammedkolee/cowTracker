// For auto update.
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

// For settings' datas.
const Store = require("electron-store").default;

// Frameworks
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Import files for backend.
const addAnimal = require("../backend/addAnimalF.js");
const updateAnimal = require("../backend/updateAnimalF.js");
const removeAnimal = require("../backend/removeAnimalF.js");
const receiveVaccineDatas = require("../backend/receiveVaccineDatasF.js");
const updateDatabase = require("../backend/updateDatabaseF.js");
const removeVaccine = require("../backend/removeVaccineF.js");
const supabase = require("../backend/databaseConnection.js");
const { error, info } = require("console");

// If app is ready, run this block.
app.on("ready", async () => {

    autoUpdater.checkForUpdatesAndNotify();

    // Get primary display to maximize window.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // DEV
    // const updateDatas = await updateDatabase();
    // console.log("updateDatas: ", updateDatas);
    // DEV

    // Create Main Window
    const mainWindow = new BrowserWindow({
        width,
        height,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // It make window maximize. (I don't recommend)
    mainWindow.maximize();

    mainWindow.setMenu(null);

    // Load index.html to Main Window.
    mainWindow
        .loadFile(path.join(__dirname, "../views/index.html"))
        .then(async () => {
            const datas = {};
            datas.animalsDatas = await getAnimalsDatas();
            datas.updatedDatas = await updateDatabase();
            mainWindow.webContents.send("sendDatas", datas);
        });

    //Dev
    //This block will be deleted after dev phase.
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            mainWindow.toggleDevTools();
        }
    });
    //Dev

    ipcMain.on("ipcMain:openOfflinePage", () => {
        mainWindow.loadFile(path.join(__dirname, "../views/offlinePage.html"));
    });

    // To open page which user want to open. pa
    // Name => file name without .html
    ipcMain.on("ipcMain:openPage", (event, pageName) => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/" + pageName + ".html"))
            .then(async () => {
                // Get animal datas and send datas to preload.
                if (pageName === "animals") {
                    const allDatas = {}; 
                    allDatas.animalDatas = await getAnimalsDatas();
                    allDatas.settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "cows") {
                    const allDatas = {};
                    allDatas.animalDatas = await getCowsDatas();
                    allDatas.settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "heifers") {
                    const allDatas = {};
                    allDatas.animalDatas = await getHeifersDatas();
                    allDatas.settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "calves") {
                    const allDatas = {};
                    allDatas.animalDatas = await getCalvesDatas();
                    allDatas.settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "bulls") {
                    const allDatas = {};
                    allDatas.animalDatas = await getBullsDatas();
                    allDatas.settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "vaccines") {
                    const allDatas = {};
                    allDatas.vaccineDatas = await getVaccinesDatas();
                    allDatas.settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "settings") {
                    const settingsDatas = getSettingsDatas();
                    mainWindow.webContents.send("sendSettingsDatas", settingsDatas);
                }
            });
    });

    // To open main menu.
    ipcMain.on("ipcMain:openMenu", () => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/index.html"))
            .then(async () => {
                const datas = {};
                datas.animalsDatas = await getAnimalsDatas();
                datas.updatedDatas = await updateDatabase();
                mainWindow.webContents.send("sendDatas", datas);
            });
    });
});

autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update");
});

autoUpdater.on("update-available", (info) => {
    log.info("Update Available, Verison: ", info.version);
});

autoUpdater.on("update-not-available", () => {
    log.info("Update Not Available");
});

autoUpdater.on("error", (err) => {
    log.info("Error in Updater", err);
});

autoUpdater.on("update-downloaded", (info) => {
    log.info("Update successfully downloaded.", );
    autoUpdater.quitAndInstall();
});

// MENUS
// Add Animal menu.
ipcMain.on("ipcMain:openAddAnimalMenu", (event, animalType) => {
    const addAnimalMenu = new BrowserWindow({
        width: 800,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    addAnimalMenu.setMenu(null);

    // Dev Phase
    addAnimalMenu.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            addAnimalMenu.toggleDevTools();
        }
    });
    // Dev Phase

    addAnimalMenu
        .loadFile(path.join(__dirname, "../views/addAnimal.html"))
        .then(async () => {
            addAnimalMenu.webContents.send("sendAnimalType", animalType);
            console.log("Veri iletildi.");
            addAnimalMenu.webContents.send(
                "sendMothersEarringNo",
                await getMotherEarringNos()
            );
        });
});

// Animal Detail Menu
ipcMain.on("ipcMain:openAnimalDetail", (event, datas) => {
    const animalDetailWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    animalDetailWindow.setMenu(null);

    // Dev Phase
    animalDetailWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            animalDetailWindow.toggleDevTools();
        }
    });
    // Dev Phase

    animalDetailWindow
        .loadFile(path.join(__dirname, "../views/animalDetail.html"))
        .then(async () => {
            if (datas.type === "cow") {
                const allDatas = await getCowDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            } else if (datas.type === "heifer") {
                const allDatas = await getHeiferDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            } else if (datas.type === "bull") {
                const allDatas = await getBullDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            } else if (datas.type === "calf") {
                const allDatas = await getCalfDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            }
        });
});

// Update Animal Menu
ipcMain.on("ipcMain:openUpdateAnimal", (event, datas) => {
    const updateAnimalWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    updateAnimalWindow.setMenu(null);

    // Dev Phase
    updateAnimalWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            updateAnimalWindow.toggleDevTools();
        }
    });
    // Dev Phase

    updateAnimalWindow
        .loadFile(path.join(__dirname, "../views/updateAnimal.html"))
        .then(async () => {
            if (datas.type === "cow") {
                const allDatas = await getCowDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            } else if (datas.type === "heifer") {
                const allDatas = await getHeiferDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            } else if (datas.type === "bull") {
                const allDatas = await getBullDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            } else if (datas.type === "calf") {
                const allDatas = await getCalfDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            }
        });
});

// Open Add Vaccine page.
ipcMain.on("ipcMain:openAddVaccine", () => {
    const addVaccineWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    addVaccineWindow.setMenu(null);

    // Dev Phase
    addVaccineWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            addVaccineWindow.toggleDevTools();
        }
    });
    // Dev Phase

    addVaccineWindow
        .loadFile(path.join(__dirname, "../views/addVaccine.html"))
        .then(async () => {
            const { data: animalsDatas, error: animalsError } = await supabase
                .from("Animals")
                .select("EarringNo, Name, Id");
            if (animalsError) {
                console.log(animalsError);
            } else {
                addVaccineWindow.webContents.send(
                    "sendAnimalsDatas",
                    animalsDatas
                );
            }
        });
});
// END OF THE MENUS

// FUNCTIONS
// Add Animal
ipcMain.on("ipcMain:addAnimal", async (event, datas) => {
    if (addAnimal(datas)) {
        event.sender.send("addResult", true);
    } else {
        event.sender.send("addResult", false);
    }
});

// Update Animal
ipcMain.on("ipcMain:updateAnimalDatas", async (event, allDatas) => {
    console.log("allDatas: ", allDatas);
    console.log("allDatas.animalData: ", allDatas.animalData);
    console.log("allDatas.calfData: ", allDatas.calfData);
    if (updateAnimal(allDatas)) {
        event.sender.send("updateResult", true);
    } else {
        event.sender.send("updateResult", false);
    }
});

// Remove Animal
ipcMain.on("ipcMain:removeAnimal", async (event, datas) => {
    removeAnimal(datas);

    if (datas.pageName === "animals") {
        event.sender.send("refresh", await getAnimalsDatas());
    } else if (datas.pageName === "cows") {
        const allDatas = {};
        allDatas.animalDatas = await getCowDatas();
        allDatas.settingsDatas = getSettingsDatas();
        event.sender.send("refresh", allDatas);
    } else if (datas.pageName === "heifers") {
        event.sender.send("refresh", await getHeifersDatas());
    } else if (datas.pageName === "calves") {
        event.sender.send("refresh", await getCalvesDatas());
    } else if (datas.pageName === "bulls") {
        event.sender.send("refresh", await getBullsDatas());
    }
});

ipcMain.on("ipcMain:receiveVaccineDatas", async (event, vaccineDatas) => {
    receiveVaccineDatas(vaccineDatas);
});

ipcMain.on("ipcMain:removeVaccine", async (event, vaccineId) => {
    removeVaccine(vaccineId);
});

ipcMain.on("ipcMain:gaveBirth", async (event, datas) => {
    const { data: cowData, error: cowError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    if (cowError) {
        console.log("Hata: ", cowError);
    }
    console.log(cowData);

    const allDatas = {};
    allDatas.animalData = cowData[0];
    allDatas.animalData.Type = "heifer";
    allDatas.heiferData = {
        Id: allDatas.animalData.Id,
        EarringNo: allDatas.animalData.EarringNo,
        LastBirthDate: datas.date,
        Name: allDatas.animalData.Name,
    };

    if (updateAnimal(allDatas)) {
        console.log("ISLEM BASARILIIIII!!!");
    } else {
        console.log("bi hata");
        return false;
    }
});

ipcMain.on("ipcMain:saveSettingsDatas", (event, settinsDatas) => {
    const store = new Store({
        defaults: {
            showInformationButton: true,    // Information Button is visible or not.
            gestationDays: 280,             // Insemination Date + gestationDays = Birth Date
            dryOffDays: 220,                // Insemination Date + dryOffDays = DryDate
            calfReduceToTwoLiterDays: 90,   // Calf Birth Date + this value
            calfReduceToOneLiterDays: 90,   // Calf Birth Date + this value
            calfWeaningDays: 100,           // Calf Birth Date + this value
            calfToAdultDays: 365            // For Data Auto Update
        }
    });

    store.set("showInformationButton", settinsDatas.showInformationButton);
    store.set("gestationDays", settinsDatas.gestationDays);
    store.set("dryOffDays", settinsDatas.dryOffDays);
    store.set("calfReduceToOneLiterDays", settinsDatas.calfReduceToOneLiterDays);
    store.set("calfReduceToTwoLiterDays", settinsDatas.calfReduceToTwoLiterDays);
    store.set("calfWeaningDays", settinsDatas.calfWeaningDays);
    store.set("calfToAdultDays", settinsDatas.calfToAdultDays);
});
// END OF THE FUNCTIONS

// If all window(s) closed, shut down app.
app.on("window-all-closed", () => {
    app.quit();
});

// Functions of JS
// Get datas of one cow.
async function getCowDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);

    const { data: cowData, error: cowError } = await supabase
        .from("Cows")
        .select("*")
        .eq("Id", datas.animalId);

    const { data: calvesData, error: calvesError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "calf")
        .eq("MotherEarringNo", datas.earringNo);

    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("EarringNo", datas.earringNo);

    const allDatas = {
        animalData: animalData,
        cowData: cowData,
        calvesData: calvesData,
        vaccinesData: vaccinesData,
    };

    return allDatas;
}

// Get datas of one heifer.
async function getHeiferDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: heiferData, error: heiferError } = await supabase
        .from("Heifers")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: calvesData, error: calvesError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "calf")
        .eq("MotherEarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("EarringNo", datas.earringNo);

    const allDatas = {
        animalData: animalData,
        heiferData: heiferData,
        calvesData: calvesData,
        vaccinesData: vaccinesData,
    };

    return allDatas;
}

// Get datas of one bull.
async function getBullDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("EarringNo", datas.earringNo);

    const allDatas = { animalData: animalData, vaccinesData: vaccinesData };

    return allDatas;
}

// Get datas of one calf.
async function getCalfDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: calfData, error: calfError } = await supabase
        .from("Calves")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("EarringNo", datas.earringNo);

    if (animalError || vaccinesError) {
        console.log(animalError, "\n", vaccinesError);
    }

    const allDatas = {
        animalData: animalData,
        calfData: calfData,
        vaccinesData: vaccinesData,
    };

    return allDatas;
}

// Get datas of whole animals.
async function getAnimalsDatas() {
    const { data, error } = await supabase
        .from("Animals")
        .select("*")
        .order("Type", { ascending: false });
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole cows.
async function getCowsDatas() {
    const { data, error } = await supabase
        .from("Cows")
        .select("*")
        .order("InseminationDate", { ascending: true });
    if (error) {
        // console.log('Hata: ',error);
    } else {
        // console.log("Gelen Veriler: ",data);
    }

    return data;
}

// Get datas of whole heifers.
async function getHeifersDatas() {
    const { data, error } = await supabase
        .from("Heifers")
        .select("*")
        .order("LastBirthDate", { ascending: false });
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole calves.
async function getCalvesDatas() {
    const { data: calvesData, error: calvesError } = await supabase
        .from("Calves")
        .select(
            "Id, EarringNo, Gender, Name, BirthDate, Animals (MotherEarringNo, MotherName)"
        )
        .order("BirthDate", { ascending: false });

    if (calvesError) {
        console.log("Bir hata meydana geldi!");
        console.log(calvesError);
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return calvesData;
}

// Get datas of whole bulls.
async function getBullsDatas() {
    const { data, error } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "bull")
        .order("BirthDate", { ascending: true });
    if (error) {
        // console.log("Bir hata meydana geldi!11", error);
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of vaccines.
async function getVaccinesDatas() {
    const { data, error } = await supabase
        .from("Vaccines")
        .select("Id, VaccineName, VaccineDate, Animals (Id, EarringNo, Name)")
        .order("VaccineDate", { ascending: false });
    if (error) {
        // Hata
    } else {
        // Veri
    }
    return data;
}

// Get Mom's Earring Nos
async function getMotherEarringNos() {
    const { data, error } = await supabase
        .from("Animals")
        .select("EarringNo, Name")
        .in("Type", ["cow", "heifer"]);
    if (error) {
        console.log("Bir hata oluştu: ", error);
    }
    return data;
}

function getSettingsDatas() {
    const store = new Store({
        defaults: {
            showInformationButton: true,    // Information Button is visible or not.
            gestationDays: 280,             // Insemination Date + gestationDays = Birth Date
            dryOffDays: 220,                // Insemination Date + dryOffDays = DryDate
            calfReduceToTwoLiterDays: 90,   // Calf Birth Date + this value
            calfReduceToOneLiterDays: 90,   // Calf Birth Date + this value
            calfWeaningDays: 100,           // Calf Birth Date + this value
            calfToAdultDays: 365            // For Data Auto Update
        }
    });
    const settingsDatas = {
        showInformationButton: store.get("showInformationButton"),
        gestationDays: store.get("gestationDays"),
        dryOffDays: store.get("dryOffDays"),
        calfReduceToOneLiterDays: store.get("calfReduceToOneLiterDays"),
        calfReduceToTwoLiterDays: store.get("calfReduceToTwoLiterDays"),
        calfWeaningDays: store.get("calfWeaningDays"),
        calfToAdultDays: store.get("calfToAdultDays")
    };

    return settingsDatas;
}
/*
+ 1-) Ayarlar sayfası yapılacak.
2-) Information sayfası yapılacak.
3-) Bazı sayfalardaki Null yazısı silinecek.
4-) İlerleyen süreçlerde Store ile çevrimdışı olarak da uygulama çalışabilir.
5-) artifactName düzenlenecek.
6-) Veriler lokalden görüntülenecek.

<!DOCTYPE html>
<html lang="tr">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CowTracker - Ana Sayfa</title>
        
        <!-- Tailwind CSS -->
        <link href="../styles/output.css" rel="stylesheet" />

        <style>
            .help-bubble {
                transition: opacity 0.3s ease-in-out;
                opacity: 0;
                pointer-events: none;
                position: absolute;
                z-index: 50;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .help-bubble.visible {
                opacity: 1;
                pointer-events: auto;
            }
        </style>
    </head>
    <body class="bg-gray-100 min-h-screen relative">

        <div class="container mx-auto px-4 py-6">

            <!-- Information Button -->
            <div class="fixed top-6 right-20 z-50">
                <button id="info-button" class="group bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-start w-12 h-12 hover:w-32 hover:rounded-full overflow-hidden cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-6 h-6 ml-3 transition-all duration-300 group-hover:ml-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span id="info-text" class="font-medium text-m leading-none opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pl-5">Yardım</span>
                </button>
            </div>
            
            <!-- Dashboard Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div class="bg-blue-600 text-white rounded-xl shadow p-4 relative">
                    <h5 class="text-lg font-semibold" id="cowNumber">İnek Sayısı</h5>
                    <p class="text-3xl font-bold">120</p>
                    <div class="help-bubble absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-700 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Çiftlikteki toplam dişi inek sayısını gösterir.</span>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-blue-700"></div>
                    </div>
                </div>
                <div class="bg-green-600 text-white rounded-xl shadow p-4 relative">
                    <h5 class="text-lg font-semibold" id="calfNumber">Buzağı Sayısı</h5>
                    <p class="text-3xl font-bold">30</p>
                    <div class="help-bubble absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-green-700 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Toplam buzağı sayısını gösterir.</span>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-green-700"></div>
                    </div>
                </div>
                <div class="bg-yellow-500 text-white rounded-xl shadow p-4 relative">
                    <h5 class="text-lg font-semibold" id="heiferNumber">Düve Sayısı</h5>
                    <p class="text-3xl font-bold">50</p>
                    <div class="help-bubble absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Toplam dişi dana (düve) sayısını gösterir.</span>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-yellow-600"></div>
                    </div>
                </div>
                <div class="bg-red-600 text-white rounded-xl shadow p-4 relative">
                    <h5 class="text-lg font-semibold" id="bullNumber">Boğa Sayısı</h5>
                    <p class="text-3xl font-bold">15</p>
                    <div class="help-bubble absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-red-700 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Toplam erkek hayvan (boğa ve dana) sayısını gösterir.</span>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-700"></div>
                    </div>
                </div>
            </div>

            <!-- Menü Butonları -->
            <div id="allButtons" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <button id="cows" class="px-4 py-3 text-blue-700 font-bold border-2 border-blue-700 rounded-xl hover:bg-blue-300 cursor-pointer relative">
                    İnekler
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Tüm ineklerin listesini görüntüle.</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </button>
                <button id="animals" class="px-4 py-3 text-white font-bold bg-green-600 rounded-xl hover:bg-green-700 cursor-pointer relative">
                    Tüm Hayvanlar
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Bütün hayvanların listesini görüntüle.</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </button>
                <button id="calves" class="px-4 py-3 text-green-700 font-bold border-2 border-green-600 rounded-xl hover:bg-green-300 cursor-pointer relative">
                    Buzağılar
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Tüm buzağıların listesini görüntüle.</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </button>
                <button id="heifers" class="px-4 py-3 text-yellow-700 font-bold border-2 border-yellow-500 rounded-xl hover:bg-yellow-300 cursor-pointer relative">
                    Düveler
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Tüm düvelerin listesini görüntüle.</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </button>
                <button id="bulls" class="px-4 py-3 text-indigo-700 font-bold border-2 border-indigo-500 rounded-xl hover:bg-indigo-300 cursor-pointer relative">
                    Danalar
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Tüm danaların listesini görüntüle.</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </button>
                <button id="vaccines" class="px-4 py-3 text-red-700 font-bold border-2 border-red-500 rounded-xl hover:bg-red-300 cursor-pointer relative">
                    Aşılar
                    <div class="help-bubble -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Aşılanacak hayvanların listesini görüntüle.</span>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </button>
            </div>

            <!-- Veri Kutuları -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <!-- Yaklaşan Düveler Kutusu -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 relative">
                    <div class="bg-purple-600 text-white px-4 py-3 rounded-t-xl">
                        <h3 class="text-lg font-semibold">Yaklaşan Düveler</h3>
                    </div>
                    <div class="p-4 h-64 overflow-y-auto" id="closestHeifersContainer">
                        <!-- Veriler JavaScript ile doldurulacak -->
                    </div>
                    <div class="help-bubble top-1/2 left-full transform -translate-y-1/2 ml-4 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Doğum yaklaştığı için ayrılan düvelerin listesi.</span>
                        <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-800"></div>
                    </div>
                </div>

                <!-- Yaklaşan İnekler Kutusu -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 relative">
                    <div class="bg-blue-600 text-white px-4 py-3 rounded-t-xl">
                        <h3 class="text-lg font-semibold">Yaklaşan İnekler</h3>
                    </div>
                    <div class="p-4 h-64 overflow-y-auto" id="closestCowsContainer">
                        <!-- Veriler JavaScript ile doldurulacak -->
                    </div>
                    <div class="help-bubble top-1/2 left-full transform -translate-y-1/2 ml-4 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Doğum yapması beklenen ineklerin listesi.</span>
                        <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-800"></div>
                    </div>
                </div>

                <!-- Bilgi/Güncellemeler Kutusu -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-200 relative">
                    <div class="bg-green-600 text-white px-4 py-3 rounded-t-xl">
                        <h3 class="text-lg font-semibold">Son Güncellemeler</h3>
                    </div>
                    <div class="p-4 h-64 overflow-y-auto" id="infoContainer">
                        <!-- Veriler JavaScript ile doldurulacak -->
                    </div>
                    <div class="help-bubble top-1/2 left-full transform -translate-y-1/2 ml-4 bg-gray-800 text-xs p-2 rounded-lg shadow-md w-40 text-center text-white">
                        <span class="block">Uygulamadaki en son gelişmeleri ve bildirimleri gösterir.</span>
                        <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-800"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hello World paragrafı sol alt köşede -->
        <p class="fixed bottom-6 left-6 text-gray-800 font-medium bg-white px-3 py-2 rounded-lg shadow-md">
            App Version: v1.1.4
        </p>

        <div class="fixed bottom-6 right-6 z-50">
            <button
                id="settingsBtn"
                class="group bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-start w-12 h-12 hover:w-32 hover:rounded-full overflow-hidden cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="flex-shrink-0 w-6 h-6 ml-3 transition-all duration-300 group-hover:ml-2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>

                <span id="settings" class="font-medium text-m leading-none opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pl-5">Ayarlar</span>
            </button>
        </div>

        <!-- JavaScript for help bubbles -->
        <script>
            document.addEventListener('keydown', (event) => {
                if (event.key === 'F1' || event.keyCode === 112) {
                    event.preventDefault(); 
                    toggleHelpBubbles();
                }
            });
            

            document.getElementById('info-button').addEventListener('click', () => {
                toggleHelpBubbles();
            });

            function toggleHelpBubbles() {
                const helpBubbles = document.querySelectorAll('.help-bubble');
                helpBubbles.forEach(bubble => {
                    bubble.classList.toggle('visible');
                });
            }
        </script>
        <script src="../src/index.js"></script>
    </body>
</html>



* Ayarlar İçin Sayfa Ayarlandı. *
*/