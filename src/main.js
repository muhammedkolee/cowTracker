// To add shortcut to desktop
if (require("electron-squirrel-startup")) return;

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

// If app is ready, run this block.
app.on("ready", async () => {
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

    // To open page which user want to open. pageName => file name without .html
    ipcMain.on("ipcMain:openPage", (event, pageName) => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/" + pageName + ".html"))
            .then(async () => {
                // Get animal datas and send datas to preload.
                if (pageName === "animals") {
                    const datas = await getAnimalsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                } else if (pageName === "cows") {
                    const datas = await getCowsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                } else if (pageName === "heifers") {
                    const datas = await getHeifersDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                } else if (pageName === "calves") {
                    const datas = await getCalvesDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                } else if (pageName === "bulls") {
                    const datas = await getBullsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                } else if (pageName === "vaccines") {
                    const datas = await getVaccinesDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
            });
    });

    // To open main menu.
    ipcMain.on("ipcMain:openMenu", () => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/index.html"))
            .then(async () => {
                mainWindow.webContents.send(
                    "sendDatas",
                    await getAnimalsDatas()
                );
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
        .then( async () => {
            addAnimalMenu.webContents.send("sendAnimalType", animalType);
            console.log("Veri iletildi.")
            addAnimalMenu.webContents.send("sendMothersEarringNo", await getMotherEarringNos());
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
            const {data: animalsDatas, error: animalsError} = await supabase.from("Animals").select("EarringNo, Name");
            if (animalsError){
                console.log(animalsError)
            }
            else {
                addVaccineWindow.webContents.send("sendAnimalsDatas", animalsDatas);
            }
        });
});
// END OF THE MENUS


// FUNCTIONS
// Add Animal
ipcMain.on("ipcMain:addAnimal", async (event, datas) => {
    if(addAnimal(datas)) {
        event.sender.send("addResult", true);
    } else {
        event.sender.send("addResult", false);
    }
});

// Update Animal
ipcMain.on("ipcMain:updateAnimalDatas", async (event, allDatas) => {
    console.log("allDatas: ", allDatas)
    console.log("allDatas.animalData: ", allDatas.animalData)
    console.log("allDatas.calfData: ", allDatas.calfData)
    if (updateAnimal(allDatas)) {
        event.sender.send("updateResult", true);
    }
    else {
        event.sender.send("updateResult", false);
    }
});

// Remove Animal
ipcMain.on("ipcMain:removeAnimal", async (event, datas) => {
    removeAnimal(datas);
    
    if (datas.pageName === "animals") {
        event.sender.send("refresh", await getAnimalsDatas());
    } else if (datas.pageName === "cows") {
        event.sender.send("refresh", await getCowsDatas());
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
    // const { data: cowName, error: cowNameError } = await supabase.from("Animals").select("Name").eq("EarringNo", datas.earringNo);
    // cowData.Name = await cowName;

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
    const { data, error } = await supabase.from("Animals").select("*");
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole cows.
async function getCowsDatas() {
    const { data, error } = await supabase.from("Cows").select("*");
    if (error) {
        // console.log('Hata: ',error);
    } else {
        // console.log("Gelen Veriler: ",data);
    }

    return data;
}

// Get datas of whole heifers.
async function getHeifersDatas() {
    const { data, error } = await supabase.from("Heifers").select("*");
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole calves.
async function getCalvesDatas() {
    const { data, error } = await supabase.from("Calves").select("*");
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole bulls.
async function getBullsDatas() {
    const { data, error } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "bull");
    if (error) {
        // console.log("Bir hata meydana geldi!11", error);
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of vaccines.
async function getVaccinesDatas() {
    const { data, error } = await supabase.from("Vaccines").select("*");
    if (error) {
        // Hata
    } else {
        // Veri
    }
    return data;
}

// Get Mom's Earring Nos
async function getMotherEarringNos() {
    const { data, error } = await supabase.from("Cows").select("EarringNo, Name");
    if (error) {
        console.log("Bir hata oluştu: ", error);
    }
    console.log(data);
    return data;
}