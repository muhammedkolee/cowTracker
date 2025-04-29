// Frameworks
const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");

// JSON file was converted to JS dictionary.
let rawData = fs.readFileSync("animals.json");
let datas = JSON.parse(rawData);

// If app is ready, run this block.
app.on("ready", () => {
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
    // mainWindow.maximize();
    mainWindow.setMenu(null);

    // Load index.html to Main Window.
    mainWindow
        .loadFile(path.join(__dirname, "../views/index.html"))
        .then(() => {
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

    // To open page that user want to open. pageName => file name without .html
    ipcMain.on("ipcMain:openPage", (event, pageName) => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/" + pageName + ".html"))
            .then(() => {
                mainWindow.webContents.send("sendDatas", datas);
            });
    });

    // To open main menu.
    ipcMain.on("ipcMain:openMenu", () => {
        mainWindow
            .loadFile(path.join(__dirname, "../views/index.html"))
            .then(() => {
                mainWindow.webContents.send("sendDatas", datas);
            }); // Loading main page.
    });

    // To open Add Cow menu.
    ipcMain.on("ipcMain:openAddAnimalMenu", (event, animalType) => {
        const addAnimalMenu = new BrowserWindow({
            width: 800,
            height: 1000,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            }
        });

        addAnimalMenu.setMenu(null);

        addAnimalMenu.webContents.on("before-input-event", (event, input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                addAnimalMenu.toggleDevTools();
            }
        });

        
        addAnimalMenu.loadFile(path.join(__dirname, "../views/addAnimal.html")).then(() => {
            addAnimalMenu.webContents.send("sendAnimalType", animalType);
        });
    });

    ipcMain.on("ipcMain:openAnimalDetail", (event, datas) => {
        const animalDetailWindow = new BrowserWindow({
            width: 1100,
            height: 650,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        animalDetailWindow.setMenu(null);

        animalDetailWindow.webContents.on(
            "before-input-event",
            (event, input) => {
                if (input.key === "F12" && input.type === "keyDown") {
                    animalDetailWindow.toggleDevTools();
                }
            }
        );

        animalDetailWindow
            .loadFile(path.join(__dirname, "../views/animalDetail.html"))
            .then(() => {
                animalDetailWindow.webContents.send("sendDetailDatas", datas);
            });
    });

    ipcMain.on("ipcMain:openUpdateAnimal", (event, earringNumber) => {
        const updateAnimalWindow = new BrowserWindow({
            width: 1100,
            height: 650,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        updateAnimalWindow
            .loadFile(path.join(__dirname, "../views/updateAnimal.html"))
            .then(() => {
                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    earringNumber
                );
            });
    });
});

// If all window(s) closed, shut down app.
app.on("window-all-closed", () => {
    app.quit();
});
