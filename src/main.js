// For auto update.
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.autoDownload = false;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

// For settings' datas.
const store = require("../backend/store.js");

// Frameworks
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { createClient, AuthPKCEGrantCodeExchangeError } = require("@supabase/supabase-js");

// Import files for backend.
const addAnimal = require("../backend/addAnimalF.js");
const updateAnimal = require("../backend/updateAnimalF.js");
const removeAnimal = require("../backend/removeAnimalF.js");
const addVaccine = require("../backend/addVaccineF.js");
const updateDatabase = require("../backend/updateDatabaseF.js");
const removeVaccine = require("../backend/removeVaccineF.js");
const supabase = require("../backend/databaseConnection.js");
const { error, info } = require("console");
const { eventNames } = require("process");

let mainWindow;
let isUpdateAvailable = false;

// If app is ready, run this block.
app.on("ready", async () => {
    // autoUpdater.checkForUpdatesAndNotify();
    
    // Synchronize cloud datas with local datas.
    try {
        await setAllLocalDatas();
        store.set("Vaccines", await getVaccinesDatas());
        store.set("updatedDatas", await updateDatabase());
    }
    catch {

    }
    // Get primary display to maximize window.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Create Main Window
    mainWindow = new BrowserWindow({
        width,
        height,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // It make window maximize.
    mainWindow.maximize();

    mainWindow.setMenu(null);
    
    // Load index.html to Main Window.
    mainWindow
    .loadFile(path.join(__dirname, "../views/index.html"))
    .then(async () => {
        const datas = {};
            datas.animalsDatas = store.get("Animals");
            datas.updatedDatas = store.get("updatedDatas");
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

    autoUpdater.checkForUpdates();

    // This block will be change.
    autoUpdater.on("checking-for-update", () => {
        log.info("Checking for update");
    });
    
    autoUpdater.on("update-available", (info) => {
        log.info("Update Available, Version: ", info.version);
        mainWindow.webContents.send("update-available", "info.version");
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

    ipcMain.on("updateResponse", (event, response) => {
        if (response) {
            log.info("User accepted dowloading the update");
            autoUpdater.downloadUpdate();
        }
        else {
            log.info("User denied the update.");
        }
    });
    
    // This block will be change.
    
    // EasterEgg
    mainWindow.webContents.on("before-input-event", (event, input) => {
       if (input.key === "m" && input.control && input.type === "keyDown") {
            mainWindow.loadFile(path.join(__dirname, "../views/egg.html"))
       } 
    });
    // EasterEgg

    ipcMain.on("ipcMain:openOfflinePage", () => {
        mainWindow.loadFile(path.join(__dirname, "../views/offlinePage.html"));
    });

    // To open page which user want to open.
    // pageName => file name without .html
    ipcMain.on("ipcMain:openPage", (event, pageName) => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/" + pageName + ".html"))
            .then(async () => {
                console.log(path.basename(mainWindow.webContents.getURL()));    //pageName.html
                // Get animal datas and send datas to preload.
                if (pageName === "animals") {
                    const allDatas = {}; 
                    // allDatas.animalDatas = await getAnimalsDatas();
                    allDatas.animalDatas = store.get("Animals");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "cows") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getCowsDatas();
                    allDatas.animalDatas = store.get("Cows");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "heifers") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getHeifersDatas();
                    allDatas.animalDatas = store.get("Heifers");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "calves") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getCalvesDatas();
                    allDatas.animalDatas = store.get("Calves");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "bulls") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getBullsDatas();
                    allDatas.animalDatas = store.get("Bulls");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "vaccines") {
                    const allDatas = {};
                    // allDatas.vaccineDatas = await getVaccinesDatas();
                    allDatas.vaccineDatas = store.get("Vaccines");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "settings") {
                    mainWindow.webContents.send("sendSettingsDatas", store.get("settings"));
                }
            });
    });

    // To open main menu.
    ipcMain.on("ipcMain:openMenu", () => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/index.html"))
            .then(async () => {
                const datas = {};
                datas.animalsDatas = store.get("Animals");
                datas.updatedDatas = store.get("updatedDatas");
                mainWindow.webContents.send("sendDatas", datas);
            });
    });
});


if(store.get("settings.showInformationButton")) {
    isUpdateAvailable = true;
}

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
    if (await addAnimal(datas)) {
        event.sender.send("addResult", true);
    } else {
        event.sender.send("addResult", false);
    }

    mainWindow.webContents.send("refresh", await refreshDatas());
});

// Update Animal
ipcMain.on("ipcMain:updateAnimalDatas", async (event, updateDatas) => {
    if (await updateAnimal(updateDatas)) {
        event.sender.send("updateResult", true);
    } else {
        event.sender.send("updateResult", false);
    }
    console.log("Updatedetd");
    mainWindow.webContents.send("refresh", await refreshDatas());
});

// Remove Animal
ipcMain.on("ipcMain:removeAnimal", async (event, datas) => {
    await removeAnimal(datas);
    mainWindow.webContents.send("refresh", await refreshDatas());
});

ipcMain.on("ipcMain:receiveVaccineDatas", async (event, vaccineDatas) => {
    await addVaccine(vaccineDatas);
    store.set("Vaccines", await getVaccinesDatas());
    const allDatas = {
        settingsDatas: store.get("settings"),
        vaccineDatas: store.get("Vaccines")
    }
    mainWindow.webContents.send("refresh", allDatas);
});

ipcMain.on("ipcMain:removeVaccine", async (event, vaccineId) => {
    await removeVaccine(vaccineId);
    store.set("Vaccines", await getVaccinesDatas());
    const allDatas = {
        settingsDatas: store.get("settings"),
        vaccineDatas: store.get("Vaccines")
    }
    mainWindow.webContents.send("refresh", allDatas);

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
    mainWindow.webContents.send("refresh", await refreshDatas());
});

ipcMain.on("ipcMain:saveSettingsDatas", (event, settinsDatas) => {
    store.set("settings.showInformationButton", settinsDatas.showInformationButton);
    store.set("settings.gestationDays", settinsDatas.gestationDays);
    store.set("settings.dryOffDays", settinsDatas.dryOffDays);
    store.set("settings.calfReduceToOneLiterDays", settinsDatas.calfReduceToOneLiterDays);
    store.set("settings.calfReduceToTwoLiterDays", settinsDatas.calfReduceToTwoLiterDays);
    store.set("settings.calfWeaningDays", settinsDatas.calfWeaningDays);
    store.set("settings.calfToAdultDays", settinsDatas.calfToAdultDays);
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
    const settingsDatas = {
        showInformationButton: store.get("settings.showInformationButton"),
        gestationDays: store.get("settings.gestationDays"),
        dryOffDays: store.get("settings.dryOffDays"),
        calfReduceToOneLiterDays: store.get("settings.calfReduceToOneLiterDays"),
        calfReduceToTwoLiterDays: store.get("settings.calfReduceToTwoLiterDays"),
        calfWeaningDays: store.get("settings.calfWeaningDays"),
        calfToAdultDays: store.get("settings.calfToAdultDays")
    };

    return settingsDatas;
}

async function setAllLocalDatas() {
    store.set("Animals", await getAnimalsDatas());
    store.set("Cows", await getCowsDatas());
    store.set("Heifers", await getHeifersDatas());
    store.set("Calves", await getCalvesDatas());
    store.set("Bulls", await getBullsDatas());
}

async function refreshDatas() {
    await setAllLocalDatas();
    const pageName = path.basename(mainWindow.webContents.getURL());
    const allDatas = {
        settingsDatas: store.get("settings"),
    }
    if (pageName === "cows.html") {
        allDatas.animalDatas = store.get("Cows");
    }
    else if (pageName === "heifers.html") {
        allDatas.animalDatas = store.get("Heifers");
    }
    else if (pageName === "calves.html") {
        allDatas.animalDatas = store.get("Calves");
    }
    else if (pageName === "bulls.html") {
        allDatas.animalDatas = store.get("Bulls");
    }
    else if (pageName === "animals.html") {
        allDatas.animalDatas = store.get("Animals");
    }

    return allDatas;
}
/*
1-) Yeni gelen güncellemeler için kullanıcı onayı alınacak.
2-) Silinen hayvanlar için trash sayfası yapılacak.

* Veriler lokalden görüntüleniyor. *
*/