// To add shortcut to desktop
if (require('electron-squirrel-startup')) return;

// Frameworks
const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const path = require("path");
const { createClient } = require('@supabase/supabase-js');
// const os = require("os");
// const fs = require("fs");

// Need to connect supabase.
const supabaseUrl = 'https://keixqunsvrtxhtjbxqlr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaXhxdW5zdnJ0eGh0amJ4cWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjExMjQsImV4cCI6MjA2NzM5NzEyNH0.EU-7sz48RYWPR-Nn9hiuYlZvWVDNrMg2xvI3ha4Z0xk';
const supabase = createClient(supabaseUrl, supabaseKey);

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
                }
                else if (pageName === "cows") {
                    const datas = await getCowsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "heifers") {
                    const datas = await getHeifersDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "calves") {
                    const datas = await getCalvesDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "bulls") {
                    const datas = await getBullsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "vaccines") {
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
                mainWindow.webContents.send("sendDatas", await getAnimalsDatas());
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
        .then(() => {
            addAnimalMenu.webContents.send("sendAnimalType", animalType);
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
    animalDetailWindow.webContents.on(
        "before-input-event",
        (event, input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                animalDetailWindow.toggleDevTools();
            }
        }
    );
    // Dev Phase

    animalDetailWindow
        .loadFile(path.join(__dirname, "../views/animalDetail.html"))
        .then(async () => {

            if (datas.type === "cow") {
                const allDatas = await getCowDatas(datas);

                animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
            }
            else if (datas.type === "heifer") {
                const allDatas = await getHeiferDatas(datas);

                animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
            }
            else if (datas.type === "bull") {
                const allDatas = await getBullDatas(datas);

                animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
            }
            else if (datas.type === "calf") {
                const allDatas = await getCalfDatas(datas);

                animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
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

                updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
            }
            else if (datas.type === "heifer") {
                const allDatas = await getHeiferDatas(datas);

                updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
            }
            else if (datas.type === "bull") {
                const allDatas = await getBullDatas(datas);

                updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
            }
            else if (datas.type === "calf") {
                const allDatas = await getCalfDatas(datas);

                updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
            }
        });
});
// END OF THE MENUS


// FUNCTIONS
// Add Animal
ipcMain.on("ipcMain:addAnimal", async (event, datas) => {
    const { data: animalsData, error: animalsError } = await supabase.from("Animals").insert(datas.animalDatas);
    if (datas.animalDatas.Type === "cow") {
        const { data: cowsData, error: cowsError } = await supabase.from("Cows").insert(datas.cowDatas);
        if (cowsError) {
            event.sender.send("addResult", false);
        }
    }
    else if (datas.animalDatas.Type === "heifer") {
        const { data: heifersData, error: heifersError } = await supabase.from("Heifers").insert(datas.heiferDatas);
        if (heifersError) {
            event.sender.send("addResult", false);
        }
    }
    else if (datas.animalDatas.Type === "calf") {
        const { data: calvesData, error: calvesError } = await supabase.from("Calves").insert(datas.calfDatas);
        if (calvesError) {
            event.sender.send("addResult", false);
        }
    }
    if (animalsError) {
        event.sender.send("addResult", false);
    }
    else {
        event.sender.send("addResult", true);
    }
});

// Update Animal
ipcMain.on("ipcMain:updateAnimalDatas", async (event, allDatas) => {
    console.log("main.js: ", allDatas);
    if (allDatas.animalData.Type === "cow") {
        const { error } = await supabase.from("Cows").update(allDatas.cowData).eq("EarringNo", allDatas.animalData.EarringNo);
        if (error) {
            console.log("Bir hata oluştu: ", error);
        }
    }
    else if (allDatas.animalData.Type === "heifer") {
        const { error } = await supabase.from("Heifers").update(allDatas.heiferData).eq("EarringNo", allDatas.animalData.EarringNo);
        if (error) {
            console.log("Bir hata oluştu: ", error);
        }
    }
    else if (allDatas.animalData.Type === "calf") {
        console.log(allDatas.calfData)
        const { error } = await supabase.from("Calves").update(allDatas.calfData).eq("EarringNo", allDatas.animalData.EarringNo);
        if (error) {
            console.log("Bir hata oluştu: ", error);
        }
        else {
            console.log("Tamamlandi!");
        }
    }
    const { error } = await supabase.from("Animals").update(allDatas.animalData).eq("EarringNo", allDatas.animalData.EarringNo);
    if (error) {
        console.log("Bir hata oluştu: ", error);
    }
    else {
        console.log("İşlem başarıyla tamamlandı!");
    }
});

// Remove Animal
ipcMain.on("ipcMain:removeAnimal", async (event, datas) => {
    if (datas.Type === "cow") {
        const response = await supabase.from("Cows").delete().eq("EarringNo", datas.EarringNo);
        if (response.status === 204) {
            console.log("Islem basarili.");
        }
        else {
            console.log("Bir hata meydana geldi, Animals!\n", response.statusText);
        }
    }
    else if (datas.Type === "heifer") {
        const response = await supabase.from("Heifers").delete().eq("EarringNo", datas.EarringNo);
        if (response.status === 204) {
            console.log("Islem basarili.");
        }

        else {
            console.log("Bir hata meydana geldi, Animals!\n", response.statusText);
        }
    }
    else if (datas.Type === "calf") {
        const response = await supabase.from("Calves").delete().eq("EarringNo", datas.EarringNo);
        if (response.status === 204) {
            console.log("Islem basarili.");
        }
        else {
            console.log("Bir hata meydana geldi, Animals!\n", response.statusText);
        }
    }
    const response = await supabase.from("Animals").delete().eq("EarringNo", datas.EarringNo);
    if (response.status === 204) {
        console.log("İşlem Başarılı!");
    }
    else {
        console.log("Bir hata meydana geldi, Animals!\n", response.statusText);
    }

    if (datas.pageName === "animals") {
        event.sender.send("refresh", await getAnimalsDatas());
    }
    else if (datas.pageName === "cows") {
        event.sender.send("refresh", await getCowsDatas());
    }
    else if (datas.pageName === "heifers") {
        event.sender.send("refresh", await getHeifersDatas());
    }
    else if (datas.pageName === "calves") {
        event.sender.send("refresh", await getCalvesDatas());
    }
    else if (datas.pageName === "bulls") {
        event.sender.send("refresh", await getBullsDatas());
    }
});


// If all window(s) closed, shut down app.
app.on("window-all-closed", () => {
    app.quit();
});

// Functions of JS
// Get datas of one cow.
async function getCowDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: cowData, error: cowError } = await supabase.from("Cows").select("*").eq("EarringNo", datas.earringNo);
    const { data: calvesData, error: calvesError } = await supabase.from("Animals").select("*").eq("Type", "calf").eq("MotherEarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);
    // const { data: cowName, error: cowNameError } = await supabase.from("Animals").select("Name").eq("EarringNo", datas.earringNo);
    // cowData.Name = await cowName;

    const allDatas = { animalData: animalData, cowData: cowData, calvesData: calvesData, vaccinesData: vaccinesData };

    return allDatas;
}

// Get datas of one heifer.
async function getHeiferDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: heiferData, error: heiferError } = await supabase.from("Heifers").select("*").eq("EarringNo", datas.earringNo);
    const { data: calvesData, error: calvesError } = await supabase.from("Animals").select("*").eq("Type", "calf").eq("MotherEarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);

    const allDatas = { animalData: animalData, heiferData: heiferData, calvesData: calvesData, vaccinesData: vaccinesData };

    return allDatas;
}

// Get datas of one bull.
async function getBullDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);

    const allDatas = { animalData: animalData, vaccinesData: vaccinesData };

    return allDatas;

}

// Get datas of one calf.
async function getCalfDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: calfData, error: calfError } = await supabase.from("Calves").select("*").eq("EarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);

    if (animalError || vaccinesError) {
        console.log(animalError, "\n", vaccinesError)
    }

    const allDatas = { animalData: animalData, calfData: calfData, vaccinesData: vaccinesData };

    return allDatas;
}

// Get datas of whole animals.
async function getAnimalsDatas() {
    const { data, error } = await supabase.from('Animals').select('*');
    if (error) {
        // console.log("Bir hata meydana geldi!");
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

// Get datas of whole cows.
async function getCowsDatas() {
    const { data, error } = await supabase.from('Cows').select('*');
    if (error) {
        // console.log('Hata: ',error);
    }
    else {
        // console.log("Gelen Veriler: ",data);
    }

    return data
}

// Get datas of whole heifers.
async function getHeifersDatas() {
    const { data, error } = await supabase.from('Heifers').select('*');
    if (error) {
        // console.log("Bir hata meydana geldi!");
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

// Get datas of whole calves.
async function getCalvesDatas() {
    const { data, error } = await supabase.from('Calves').select('*');
    if (error) {
        // console.log("Bir hata meydana geldi!");
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

// Get datas of whole bulls.
async function getBullsDatas() {
    const { data, error } = await supabase.from('Animals').select('*').eq('Type', 'bull');
    if (error) {
        // console.log("Bir hata meydana geldi!11", error);
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

// Get datas of vaccines.
async function getVaccinesDatas() {
    const { data, error } = await supabase.from('Vaccines').select('*');
    if (error) {
        // Hata
    }
    else {
        // Veri
    }
    return data
}

// Update database's datas.
async function updateDatabase() {
    const calvesDatas = await getCalvesDatas();

    calvesDatas.forEach(async (calf) => {
        let calfBirthDate = new Date(calf.BirthDate);

        if (((getTodayDate() - calfBirthDate) / (1000 * 60 * 60 * 24)) >= 365) {
            console.log("Isleme baslaniyor...");
            // const response = await supabase.from("Cows").delete().eq("EarringNo", datas.EarringNo);
            // const { data: cowsData, error: cowsError } = await supabase.from("Cows").insert(datas.cowDatas);
            // const { error } = await supabase.from("Calves").update(allDatas.calfData).eq("EarringNo", allDatas.animalData.EarringNo);


            const responseDelete = await supabase.from("Calves").delete().eq("EarringNo", calf.EarringNo);

            if (calf.Gender) {
                const { data: addHeiferData, error: addHeiferError } = await supabase.from("Heifers").insert({ EarringNo: calf.EarringNo, Name: calf.Name, LastBirthDate: getTodayDate() });

                const { data: updateCalfData, error: updateCalfError } = await supabase.from("Animals").update({ Type: "heifer" }).eq("EarringNo", calf.EarringNo);

            }
            else {
                const { data: addBullData, error: addBullError } = await supabase.from("Animals").update({ Type: "bull" }).eq("EarringNo", calf.EarringNo);
            }
            const { data: infoData, error: infoError } = await supabase.from("Information").insert({ Info: (calf.EarringNo + ` küpe numaralı buzağı "Düve" olarak kaydedildi!`) });
            console.log(infoError);
            console.log("else bloğuna girildi.");
        }
    });


    const heifersDatas = await getHeifersDatas();
    let closestHeifers = [];

    heifersDatas.forEach(async (heifer) => {
        if ((getTodayDate() - new Date(heifer.LastBirthDate)) >= 40 || (getTodayDate() - new Date(heifer.LastBirthDate)) <= 90) {
            closestHeifers.push({ EarringNo: heifer.EarringNo, Name: heifer.Name });
        };
    });


    const cowsDatas = await getCowsDatas();
    let closestCows = [];

    cowsDatas.forEach(cow => {
        if ((((new Date(cow.InseminationDate) - getTodayDate()) / (1000 * 60 * 60 * 24)) + 280) <= 20) {
            closestCows.push({ EarringNo: cow.EarringNo, Name: cow.Name });
        };
    });

    const { data: info, error: infoError } = await supabase.from("Information").select("*");

    return { closestHeifers: closestHeifers, closestCows: closestCows, info: info }

}

// Get Today's date as type of Date.
function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}