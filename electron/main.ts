// This file manage windows, base settings and etc..
import { app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
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

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
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

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    // Test active push message to Renderer-process.
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString(),
        );
    });

    win.setMenu(null);
    win.maximize();

    win.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                win?.webContents.toggleDevTools();
            }
        },
    );

    // globalShortcut.register("F12", () => {
    //     const win = BrowserWindow.getFocusedWindow();
    //     if (win) win.webContents.toggleDevTools();
    // });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
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

app.whenReady().then(createWindow);

// IPC Handler'lar (Örnekler)
ipcMain.handle("get-settings-data", async () => {
    settingsStore.set("email", await authService.getEmail());
    // console.log(await authService.getEmail());
    return settingsStore.store;
});

ipcMain.on("save-settings-data", (_, newSettingsData) => {
    settingsStore.set(newSettingsData);
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

ipcMain.handle("add-animal-data", async (event, animalData) => {
    return await addDataServices.addAnimal(animalData);
});

ipcMain.handle("update-animal-data", async (event, animalData) => {
    return await updateAnimalService.updateAnimal(animalData);
});

ipcMain.handle("add-vaccine", async (event, vaccineData) => {
    return await vaccineService.addVaccine(vaccineData);
});

ipcMain.handle("delete-vaccine", async (event, vaccineId) => {
    await vaccineService.deleteVaccine(vaccineId);
    if (win) win.webContents.send("refresh-all-data");
});

ipcMain.on("close-window", (event) => {
    if (win) {
        win.webContents.send("refresh-all-data");
    }

    const currentWin = BrowserWindow.fromWebContents(event.sender);
    if (currentWin) currentWin.close();
});

ipcMain.on("remove-animal", async (_, trashData: {Id: number, DeathDate: Date, Reason: string}) => {
    await AnimalService.removeAnimal(trashData.Id, trashData.DeathDate, trashData.Reason);
})

// Silinen hayvanları getir
ipcMain.handle("deathAnimals:getAll", async () => {
    return await deletedAnimalsService.getDeletedAnimals();
});

// Geri al — IsDeleted = false yap, DeletedAnimals'tan sil
ipcMain.handle("deathAnimals:restore", async (_, id) => {
    return await AnimalService.revertAnimal(id);
});

// Kalıcı sil — DeletedAnimals + Animals + Type tablosundan sil
ipcMain.handle(
    "deathAnimals:permanentDelete",
    async (_, payload: { id: number; type: string }) => {
        return await AnimalService.deleteAnimal(payload.id, payload.type);
    },
);

ipcMain.on("gave-birth", async (__dirname, allData: any) => {
    await AnimalService.gaveBirth(allData);
});

ipcMain.on("apply-insemination", async (__dirname, data: any) => {
    await AnimalService.applyInsemination(data);
    // console.log(data)
});

ipcMain.handle("log-in", async (_, loginData: any) => {
    return await authService.login(loginData.email, loginData.password);
});

ipcMain.handle("sign-up", async (_, signupData: any) => {
    return await authService.signup(signupData.fullName, signupData.mail, signupData.password);
});

ipcMain.handle("get-auth", async(_) => {
    return await authService.getAuth();
});

ipcMain.on("log-out", async (_) => {
    const result = await authService.logout();
    console.log(result);
    // if (result) {
        
    // }
});

// electron/main.ts
ipcMain.on("open-add-animal-window", async (_, type) => {
    const addAnimalWindow = new BrowserWindow({
        width: 600,
        height: 800,
        show: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    addAnimalWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                addAnimalWindow.webContents.toggleDevTools();
            }
        },
    );

    if (VITE_DEV_SERVER_URL) {
        addAnimalWindow.loadURL(`${VITE_DEV_SERVER_URL}src/add-animal.html`);
    } else {
        addAnimalWindow.loadFile(path.join(RENDERER_DIST, "add-animal.html"));
    }

    addAnimalWindow.once("ready-to-show", () => {
        addAnimalWindow.show();

        // KRİTİK NOKTA: Pencere hazır olduğunda tipi gönderiyoruz
        addAnimalWindow.webContents.send("animal-type-to-open", type);

        // Form için gerekli listeleri de hemen gönderelim (Veya AddAnimalPage içinde useEffect ile de çekebilirsin)
        // databaseService'den verileri alıp gönderiyoruz:
        // databaseService.getMothersEarringNo().then(mothers => {
        //    addAnimalWindow.webContents.send('mothers-data', mothers);
        // });

        // databaseService.getBullsName().then(bulls => {
        //    addAnimalWindow.webContents.send('bulls-data', bulls);
        // });
    });
});

ipcMain.on("open-animal-detail-window", async (event, animalId: number) => {
    const detailWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#f8fafc",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    detailWindow.setMenu(null);

    // Veritabanından tüm ilişkili verileri çek
    const animal = await animalDetailServices.getAnimalDetail(animalId);
    const vaccines = await animalDetailServices.getAnimalVaccines(animalId);
    const calves = await animalDetailServices.getAnimalCalves(animalId);

    detailWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                detailWindow.webContents.toggleDevTools();
            }
        },
    );

    if (VITE_DEV_SERVER_URL) {
        detailWindow.loadURL(`${VITE_DEV_SERVER_URL}src/animal-detail.html`);
    } else {
        detailWindow.loadFile(path.join(RENDERER_DIST, "animal-detail.html"));
    }

    detailWindow.once("ready-to-show", () => {
        detailWindow.show();
        // Veriyi pencereye fırlat
        detailWindow.webContents.send("animal-detail-data", {
            animal,
            vaccines,
            calves,
        });
    });
});

ipcMain.on("open-update-animal-window", async (event, animalId: number) => {
    const updateWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#f8fafc",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    updateWindow.setMenu(null);

    // Veritabanından tüm ilişkili verileri çek
    const animal = await updateAnimalService.getAnimalDatas(animalId);
    const datasForType = await updateAnimalService.getDataAsType(animalId);

    updateWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                updateWindow.webContents.toggleDevTools();
            }
        },
    );

    if (VITE_DEV_SERVER_URL) {
        updateWindow.loadURL(`${VITE_DEV_SERVER_URL}src/update-animal.html`);
    } else {
        updateWindow.loadFile(path.join(RENDERER_DIST, "update-animal.html"));
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
        backgroundColor: "#f8fafc",
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    });

    addVaccineWindow.setMenu(null);

    addVaccineWindow.webContents.on(
        "before-input-event",
        (_event: Electron.Event, input: Electron.Input) => {
            if (input.key === "F12" && input.type === "keyDown") {
                addVaccineWindow.webContents.toggleDevTools();
            }
        },
    );

    const animals = await vaccineService.getAnimalsData();
    const vaccinesName = await databaseService.getVaccinesName();

    if (VITE_DEV_SERVER_URL) {
        addVaccineWindow.loadURL(`${VITE_DEV_SERVER_URL}src/add-vaccine.html`);
    } else {
        addVaccineWindow.loadFile(path.join(RENDERER_DIST, "add-vaccine.html"));
    }

    addVaccineWindow.once("ready-to-show", () => {
        addVaccineWindow.show();
        // Veriyi pencereye fırlat
        addVaccineWindow.webContents.send("animals-datas-for-vaccine", {
            animals,
            vaccinesName,
        });
    });
});
