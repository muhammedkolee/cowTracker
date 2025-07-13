// Frameworks
const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { createClient } = require('@supabase/supabase-js');

// Need to connect supabase.
const supabaseUrl = 'https://keixqunsvrtxhtjbxqlr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaXhxdW5zdnJ0eGh0amJ4cWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjExMjQsImV4cCI6MjA2NzM5NzEyNH0.EU-7sz48RYWPR-Nn9hiuYlZvWVDNrMg2xvI3ha4Z0xk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Database files and directories' path.
// const userDataPath = app.getPath("userData");
// const dbsPath = path.join(userDataPath, "dbs");
// const backupsPath = path.join(userDataPath, "backups");

// If app is ready, run this block. 
app.on("ready", () => {
    // Get primary display to maximize window.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
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
            const datas = await getAnimalsDatas();
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

    // To open page which user want to open. pageName => file name without .html
    ipcMain.on("ipcMain:openPage", (event, pageName) => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/" + pageName + ".html"))
            .then(async () => {
                // Get animal datas and send datas to preload.
                if (pageName === "animals"){
                    const datas = await getAnimalsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "cows"){
                    const datas = await getCowsDatas();
                    console.log(datas);
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "heifers"){
                    const datas = await getHeifersDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "calves"){
                    const datas = await getCalvesDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "bulls"){
                    const datas = await getBullsDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
                else if (pageName === "vaccines"){
                    const datas = await getVaccinesDatas();
                    mainWindow.webContents.send("sendDatas", datas);
                }
            });
    });

    // To open main menu.
    ipcMain.on("ipcMain:openMenu", () => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/index.html"))
            .then(() => {
                mainWindow.webContents.send("sendDatas", getAnimalsDatas());
            });
    });

    // To open Add Animal menu.
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
            .then(async() => {

                if (datas.type === "cow"){
                    const allDatas = await getCowDatas(datas);
                    console.log(allDatas);

                    animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
                }
                else if (datas.type === "heifer"){
                    const allDatas = await getHeiferDatas(datas);

                    animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
                }
                else if (datas.type === "bull"){
                    const allDatas = await getBullDatas(datas);

                    animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
                }
                else if (datas.type === "calf"){
                    const allDatas = await getCalfDatas(datas);

                    animalDetailWindow.webContents.send("sendDetailDatas", allDatas);
                }
            });
    });

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
                if (datas.type === "cow"){
                    const allDatas = await getCowDatas(datas);

                    updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
                }
                else if (datas.type === "heifer"){
                    const allDatas = await getHeiferDatas(datas);

                    updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
                }
                else if (datas.type === "bull"){
                    const allDatas = await getBullDatas(datas);

                    updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
                }
                else if (datas.type === "calf"){
                    const allDatas = await getCalfDatas(datas);

                    updateAnimalWindow.webContents.send("sendUpdateDatas", allDatas);
                }
            });
    });

    ipcMain.on("ipcMain:addAnimal", async (event, datas) => {
       const { data: animalsData, error: animalsError } = await supabase.from("Animals").insert(datas.animalDatas);
        if (datas.animalDatas.Type === "cow") {
            const { data: cowsData, error: cowsError } = await supabase.from("Cows").insert(datas.cowDatas);
            if (cowsError){
                event.sender.send("addResult", false);
            }
        }
        else if (datas.animalDatas.Type === "heifer") {
            const { data: heifersData, error: heifersError } = await supabase.from("Heifers").insert(datas.heiferDatas);
            if (heifersError) {
                console.log(heifersError);
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

    ipcMain.on("ipcMain:updateAnimalDatas", (event, allDatas) => {
        if (allDatas.animalData.Type === "cow"){
            const { error } = supabase.from("Cows").update(allDatas.cowData).eq(allDatas.animalData.EarringNo);
            if (error){
                console.log("Bir hata oluştu: ", error);
            }
        }
        else if (allDatas.animalData.Type === "heifer"){
            const { error } = supabase.from("Heifers").update(allDatas.heiferData).eq(allDatas.animalData.EarringNo);
            if (error){
                console.log("Bir hata oluştu: ", error);
            }
        }
        else if (allDatas.animalData.Type === "calf"){
            const { error } = supabase.from("Calves").update(allDatas.calfData).eq(allDatas.animalData.EarringNo);
            if (error){
                console.log("Bir hata oluştu: ", error);
            }
        }
        const { error } = supabase.from("Animals").update(allDatas.animalData).eq(allDatas.animalData.EarringNo);
        if (error) {
            console.log("Bir hata oluştu: ", error);
        }
        else {
            console.log("İşlem başarıyla tamamlandı!");
        }
    });
});

// If all window(s) closed, shut down app.
app.on("window-all-closed", () => {
    app.quit();
});

async function getCowDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: cowData, error: cowError} = await supabase.from("Cows").select("*").eq("EarringNo", datas.earringNo);
    const { data: calvesData, error: calvesError} = await supabase.from("Animals").select("*").eq("Type", "calf").eq("MotherEarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError} = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);
    // const { data: cowName, error: cowNameError } = await supabase.from("Animals").select("Name").eq("EarringNo", datas.earringNo);
    // cowData.Name = await cowName;

    const allDatas = {animalData: animalData, cowData: cowData, calvesData: calvesData, vaccinesData: vaccinesData};

    return allDatas;
}

async function getHeiferDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: heiferData, error: heiferError } = await supabase.from("Heifers").select("*").eq("EarringNo", datas.earringNo);
    const { data: calvesData, error: calvesError } = await supabase.from("Animals").select("*").eq("Type", "calf").eq("MotherEarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);

    const allDatas = {animalData: animalData, heiferData: heiferData, calvesData: calvesData, vaccinesData: vaccinesData};

    return allDatas;
}

async function getBullDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);

    const allDatas = {animalData: animalData, vaccinesData: vaccinesData};

    return allDatas;

}

async function getCalfDatas(datas) {
    const { data: animalData, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", datas.earringNo);
    const { data: calfData, error: calfError } = await supabase.from("Calves").select("*").eq("EarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("*").eq("EarringNo", datas.earringNo);               
    
    if (animalError || vaccinesError){
        console.log(animalError, "\n", vaccinesError)
    }

    const allDatas = {animalData: animalData,calfData: calfData, vaccinesData: vaccinesData};
    
    return allDatas;
}

async function getAnimalsDatas(){
    const { data, error } = await supabase.from('Animals').select('*');
    if (error){
        // console.log("Bir hata meydana geldi!");
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}


async function getCowsDatas() {
    const { data, error } = await supabase.from('Cows').select('*'); 
    if (error){
        // console.log('Hata: ',error);
    }
    else {
        // console.log("Gelen Veriler: ",data);
    }

    return data
}


async function getHeifersDatas() {
    const { data, error } = await supabase.from('Heifers').select('*');
    if (error){
        // console.log("Bir hata meydana geldi!");
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

async function getCalvesDatas(){
    const { data, error } = await supabase.from('Calves').select('*');
    if (error){
        // console.log("Bir hata meydana geldi!");
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

async function getBullsDatas(){
    const { data, error } = await supabase.from('Animals').select('*').eq('Type', 'bull');
    if (error){
        // console.log("Bir hata meydana geldi!11", error);
    }
    else {
        // console.log("Gelen Veriler: ", data);
    }
    return data
}

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

/*
    *** cows sayfasında cow name gözükmüyor => (yalnızca cowDatas alınıyor.)
    heifers => (?)
    bulls => Tarihsel verileri düzelt, dananın kaç günlük olduğu gözükmüyor.
    calves => Buzağının erillik/dişilik value'leri string değere göre değil booelan değere dönüştürüldü.
*/

