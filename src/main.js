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
    mainWindow.loadFile(path.join(__dirname, "../views/index.html"));

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
        mainWindow.loadFile(path.join(__dirname, "../views/index.html")); // Loading main page.
    });

    // To open Add Cow menu.
    ipcMain.on("ipcMain:openAddCowMenu", () => {
        const addCowMenu = new BrowserWindow({
            width: 800,
            height: 600,
        });

        addCowMenu.setMenu(null);

        addCowMenu.loadFile(path.join(__dirname, "../views/cow_add.html"));
    });
});

// If all window(s) closed, shut down app.
app.on("window-all-closed", () => {
    app.quit();
});
