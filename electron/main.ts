// This file manage windows, base settings and etc..
import { app, BrowserWindow } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { autoUpdater } from 'electron-updater';
import path from "node:path";

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

import { join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: join(process.cwd(), ".env") });

import { ipcMain } from "electron";
import {
    addDataServices,
    databaseService,
    animalDetailServices,
    updateAnimalService,
    vaccineService,
    deletedAnimalsService,
    AnimalService,
    authService,
} from "./services/database";
import { settingsStore } from "./services/store";
import Store from "electron-store";

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

Store.initRenderer();

let win: BrowserWindow | null;
let updateCheckTimer: NodeJS.Timeout | null = null;
let isCheckingForUpdates = false;

type UpdateState = {
    status: "none" | "checking" | "available" | "downloading" | "finished" | "error";
    version?: string;
    progress?: number;
    releaseNotes?: string;
    message?: string;
};

let updateState: UpdateState = { status: "none" };

function normalizeReleaseNotes(releaseNotes: unknown): string | undefined {
    if (typeof releaseNotes === "string") return releaseNotes;
    if (Array.isArray(releaseNotes)) {
        const notes = releaseNotes
            .map((item) => {
                if (typeof item === "string") return item;
                if (item && typeof item === "object" && "note" in item) {
                    return String(item.note);
                }
                return "";
            })
            .filter(Boolean)
            .join("\n");
        return notes || undefined;
    }
    return undefined;
}

function sendUpdateState(mainWindow = win) {
    if (!mainWindow || mainWindow.isDestroyed() || mainWindow.webContents.isDestroyed()) return;
    mainWindow.webContents.send("update_state", updateState);
}

function setupUpdater() {
    autoUpdater.on("checking-for-update", () => {
        updateState = { status: "checking" };
    });

    autoUpdater.on("update-available", (info) => {
        updateState = {
            status: "available",
            version: info.version,
            progress: 0,
            releaseNotes: normalizeReleaseNotes(info.releaseNotes),
        };
        sendUpdateState();
    });

    autoUpdater.on("update-not-available", () => {
        updateState = { status: "none" };
    });

    autoUpdater.on("download-progress", (progress) => {
        updateState = {
            ...updateState,
            status: "downloading",
            progress: progress.percent,
        };
        sendUpdateState();
    });

    autoUpdater.on("update-downloaded", (info) => {
        updateState = {
            ...updateState,
            status: "finished",
            version: info.version,
            progress: 100,
        };
        sendUpdateState();
    });

    autoUpdater.on("error", (error) => {
        console.error("Güncelleme hatası:", error);
        updateState = {
            ...updateState,
            status: "error",
            message: "Güncelleme işlemi tamamlanamadı. İnternet bağlantınızı kontrol edip uygulamayı yeniden başlatın.",
        };
        sendUpdateState();
    });
}

async function checkUpdates(): Promise<boolean> {
    if (!app.isPackaged) return false;
    if (isCheckingForUpdates || updateState.status === "downloading" || updateState.status === "finished") {
        return false;
    }
    isCheckingForUpdates = true;
    try {
        await autoUpdater.checkForUpdates();
        return true;
    } catch (error) {
        console.error("Güncelleme kontrolü başlatılamadı:", error);
        return false;
    } finally {
        isCheckingForUpdates = false;
    }
}

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(__dirname, '../public/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    // Test active push message to Renderer-process.
    // win.webContents.on("did-finish-load", () => {
    //     win?.webContents.send(
    //         "main-process-message",
    //         new Date().toLocaleString(),
    //     );
    // });

    win.setMenu(null);
    win.maximize();

    // Dev
    /*
    win.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                win?.webContents.toggleDevTools();
            }
        },
    );
    */
    


    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }

    win.webContents.once("did-finish-load", () => {
        void checkUpdates();
    });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (updateCheckTimer) {
        clearInterval(updateCheckTimer);
        updateCheckTimer = null;
    }
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    setupUpdater();
    createWindow();
    updateCheckTimer = setInterval(() => void checkUpdates(), 4 * 60 * 60 * 1000);
});

// IPC Handlers
ipcMain.handle("get-update-state", () => updateState);

ipcMain.handle("check-for-updates", () => checkUpdates());

ipcMain.handle('start-download', async () => {
    if (updateState.status !== "available" && updateState.status !== "error") {
        return false;
    }
    updateState = { ...updateState, status: "downloading", progress: 0 };
    sendUpdateState();
    await autoUpdater.downloadUpdate();
    return true;
});

ipcMain.handle('quit-and-install', () => {
    autoUpdater.quitAndInstall(false, true);
});

ipcMain.handle("get-settings-data", async () => {
    settingsStore.set("email", await authService.getEmail());
    // console.log(await authService.getEmail());
    return settingsStore.store;
});

ipcMain.handle("save-settings-data", (_, newSettingsData) => {
    settingsStore.set(newSettingsData);
    return true;
});

ipcMain.handle("get-cows", async () => {
    return await databaseService.getCows();
});

ipcMain.handle("get-calves", async () => {
    return await databaseService.getCalves();
});

ipcMain.handle("get-animals", async () => {
    return await databaseService.getAnimals();
});

ipcMain.handle("get-heifers", async () => {
    return await databaseService.getHeifers();
});

ipcMain.handle("get-bulls", async () => {
    return await databaseService.getBulls();
});

ipcMain.handle("get-vaccines", async () => {
    return await databaseService.getVaccines();
});

ipcMain.handle("get-vaccines-name", async () => {
    return await databaseService.getVaccinesName();
});

ipcMain.handle("get-mothers-earring-no", async () => {
    return await databaseService.getMothersEarringNo();
});

ipcMain.handle("get-bulls-name", async () => {
    return await databaseService.getBullsName();
});

ipcMain.handle("add-animal-data", async (_, animalData) => {
    return await addDataServices.addAnimal(animalData);
});

ipcMain.handle("update-animal-data", async (_, animalData) => {
    return await updateAnimalService.updateAnimal(animalData);
});

ipcMain.handle("add-vaccine", async (_, vaccineData) => {
    return await vaccineService.addVaccine(vaccineData);
});

ipcMain.handle("delete-vaccine", async (_, vaccineId) => {
    const deleted = await vaccineService.deleteVaccine(vaccineId);
    if (deleted && win) win.webContents.send("refresh-all-data");
    return deleted;
});

ipcMain.on("close-window", (event) => {
    if (win) {
        win.webContents.send("refresh-all-data");
    }

    const currentWin = BrowserWindow.fromWebContents(event.sender);
    if (currentWin) currentWin.close();
});

ipcMain.handle("remove-animal", async (_, trashData: {Id: number, DeathDate: Date, Reason: string}) => {
    const removed = await AnimalService.removeAnimal(trashData.Id, trashData.DeathDate, trashData.Reason);
    if (removed && win) win.webContents.send("refresh-all-data");
    return removed;
});

ipcMain.handle("deathAnimals:getAll", async () => {
    return await deletedAnimalsService.getDeletedAnimals();
});

ipcMain.handle("deathAnimals:restore", async (_, id) => {
    return await AnimalService.revertAnimal(id);
});

ipcMain.handle(
    "deathAnimals:permanentDelete",
    async (_, payload: { id: number; type: string }) => {
        return await AnimalService.deleteAnimal(payload.id);
    },
);

ipcMain.handle("gave-birth", async (_, allData: any) => {
    const saved = await AnimalService.gaveBirth(allData);
    if (saved && win) win.webContents.send("refresh-all-data");
    return saved;
});

ipcMain.handle("apply-insemination", async (_, data: any) => {
    const saved = await AnimalService.applyInsemination(data);
    if (saved && win) win.webContents.send("refresh-all-data");
    return saved;
});

ipcMain.handle("log-in", async (_, loginData: any) => {
    return await authService.login(loginData.email, loginData.password);
});

ipcMain.handle("sign-up", async (_, signupData: any) => {
    return await authService.signup(signupData.fullName, signupData.mail, signupData.password);
});

ipcMain.handle("get-auth", async () => {
    return await authService.getAuth();
});

ipcMain.handle("get-counts", async () => {
    return await databaseService.getCounts();
});

ipcMain.handle("get-upcoming-events", async () => {
    return await databaseService.getUpcomingEvents();
});

ipcMain.handle("get-activity-logs", async () => {
    return await databaseService.getActivityLogs();
});

ipcMain.handle("log-out", async () => {
    return await authService.logout();
});

// electron/main.ts
ipcMain.on("open-add-animal-window", async (_, type) => {
    const addAnimalWindow = new BrowserWindow({
        width: 600,
        height: 800,
        show: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });


    // Dev
    /* 
    addAnimalWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                addAnimalWindow.webContents.toggleDevTools();
            }
        },
    );
    */

    if (VITE_DEV_SERVER_URL) {
        addAnimalWindow.loadURL(`${VITE_DEV_SERVER_URL}src/add-animal.html`);
    } else {
        addAnimalWindow.loadFile(path.join(RENDERER_DIST, "src/add-animal.html"));
    }

    addAnimalWindow.once("ready-to-show", () => {
        addAnimalWindow.show();

        addAnimalWindow.webContents.send("animal-type-to-open", type);

        // databaseService.getMothersEarringNo().then(mothers => {
        //    addAnimalWindow.webContents.send('mothers-data', mothers);
        // });

        // databaseService.getBullsName().then(bulls => {
        //    addAnimalWindow.webContents.send('bulls-data', bulls);
        // });
    });
});

ipcMain.on("open-animal-detail-window", async (_, animalId: number) => {
    const detailWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, '../public/icon.ico'),
        backgroundColor: "#f8fafc",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    detailWindow.setMenu(null);

    const animal = await animalDetailServices.getAnimalDetail(animalId);
    const vaccines = await animalDetailServices.getAnimalVaccines(animalId);
    const calves = await animalDetailServices.getAnimalCalves(animal.EarringNo);

    // Dev
    /*
    detailWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                detailWindow.webContents.toggleDevTools();
            }
        },
    );
    */

    if (VITE_DEV_SERVER_URL) {
        detailWindow.loadURL(`${VITE_DEV_SERVER_URL}src/animal-detail.html`);
    } else {
        detailWindow.loadFile(path.join(RENDERER_DIST, "src/animal-detail.html"));
    }

    detailWindow.once("ready-to-show", () => {
        detailWindow.show();
        detailWindow.webContents.send("animal-detail-data", {
            animal,
            vaccines,
            calves,
        });
    });
});

ipcMain.on("open-update-animal-window", async (_, animalId: number) => {
    const updateWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, '../public/icon.ico'),
        backgroundColor: "#f8fafc",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    updateWindow.setMenu(null);

    const animal = await updateAnimalService.getAnimalDatas(animalId);
    const datasForType = await updateAnimalService.getDataAsType(animalId, animal.Type);

    // Dev
    /*
    updateWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                updateWindow.webContents.toggleDevTools();
            }
        },
    );
    */

    if (VITE_DEV_SERVER_URL) {
        updateWindow.loadURL(`${VITE_DEV_SERVER_URL}src/update-animal.html`);
    } else {
        updateWindow.loadFile(path.join(RENDERER_DIST, "src/update-animal.html"));
    }

    updateWindow.once("ready-to-show", () => {
        updateWindow.show();
        // Veriyi pencereye fırlat
        updateWindow.webContents.send("update-animal-data", {
            animal,
            datasForType,
        });
    });
});

ipcMain.on("open-add-vaccine-window", async () => {
    const addVaccineWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, '../public/icon.ico'),
        backgroundColor: "#f8fafc",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    addVaccineWindow.setMenu(null);


    // Dev
    /*
    addVaccineWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                addVaccineWindow.webContents.toggleDevTools();
            }
        },
    );
    */

    const animals = await vaccineService.getAnimalsData();
    const vaccinesName = await databaseService.getVaccinesName();

    if (VITE_DEV_SERVER_URL) {
        addVaccineWindow.loadURL(`${VITE_DEV_SERVER_URL}src/add-vaccine.html`);
    } else {
        addVaccineWindow.loadFile(path.join(RENDERER_DIST, "src/add-vaccine.html"));
    }

    addVaccineWindow.once("ready-to-show", () => {
        addVaccineWindow.show();
        addVaccineWindow.webContents.send("animals-datas-for-vaccine", {
            animals,
            vaccinesName,
        });
    });
});
