// To add shortcut to desktop
if (require("electron-squirrel-startup")) return;

// For auto update.
const { autoUpdater } = require("electron-updater");

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
const { error } = require("console");

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

* Ayarlar İçin Sayfa Ayarlandı. *
*/