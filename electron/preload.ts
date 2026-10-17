// Bridge (preload) operations.
import { ipcRenderer, contextBridge } from "electron";
import { SettingsData } from "../shared/interfaces";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) =>
            listener(event, ...args),
        );
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },

    // You can expose other APTs you need here.
    // ...
    // electron/preload.ts
});

contextBridge.exposeInMainWorld("api", {
    getCows: () => ipcRenderer.invoke("get-cows"),

    getCalves: () => ipcRenderer.invoke("get-calves"),

    getAnimals: () => ipcRenderer.invoke("get-animals"),

    getHeifers: () => ipcRenderer.invoke("get-heifers"),

    getBulls: () => ipcRenderer.invoke("get-bulls"),

    getVaccines: () => ipcRenderer.invoke("get-vaccines"),

    getVaccinesName: () => ipcRenderer.invoke("get-vaccines-name"),

    openAddAnimalWindow: (type: string) => ipcRenderer.send('open-add-animal-window', type),
    
    openAnimalDetailWindow: (animalId: number) => ipcRenderer.send('open-animal-detail-window', animalId),

    openUpdateAnimalWindow: (animalId: number) => ipcRenderer.send('open-update-animal-window', animalId),

    openAddVaccineWindow: () => ipcRenderer.send('open-add-vaccine-window'),
    
    closeWindow: () => ipcRenderer.send("close-window"),

    onRefreshData: (callback: any) => {
        const subscription = () => callback();
        ipcRenderer.on('refresh-all-data', subscription);
        
        return () => ipcRenderer.removeListener('refresh-all-data', subscription);
    },

    getCounts: () => ipcRenderer.invoke("get-counts"),

    getUpcomingEvents: () => ipcRenderer.invoke("get-upcoming-events"),

    getActivityLogs: () => ipcRenderer.invoke("get-activity-logs"),
});

contextBridge.exposeInMainWorld('updateAPI', {
    getState: () => ipcRenderer.invoke('get-update-state'),

    checkNow: () => ipcRenderer.invoke('check-for-updates'),

    onStateChanged: (callback: any) => {
        const subscription = (_event: Electron.IpcRendererEvent, state: unknown) => callback(state);
        ipcRenderer.on('update_state', subscription);
        return () => ipcRenderer.removeListener('update_state', subscription);
    },

    startDownload: () => ipcRenderer.invoke('start-download'),

    quitAndInstall: () => ipcRenderer.invoke('quit-and-install')
});

contextBridge.exposeInMainWorld('addAnimalAPI', {
    receiveAnimalType: (callback: any) => {
        const subscription = (_event: Electron.IpcRendererEvent, value: string) =>
            callback(value);
        ipcRenderer.on('animal-type-to-open', subscription);
        return () => ipcRenderer.removeListener('animal-type-to-open', subscription);
    },

    getMothersEarringNo: () => ipcRenderer.invoke('get-mothers-earring-no'),
    
    getBullsName: () => ipcRenderer.invoke('get-bulls-name'),

    addAnimal: (animalData: any[]) => ipcRenderer.invoke('add-animal-data', animalData)
}); 

contextBridge.exposeInMainWorld('animalDetailAPI', {
    receiveData: (callback: any) => {
        const subscription = (_event: Electron.IpcRendererEvent, value: any) =>
            callback(value);
        ipcRenderer.on('animal-detail-data', subscription);
        return () => ipcRenderer.removeListener('animal-detail-data', subscription);
    },
});

contextBridge.exposeInMainWorld('updateAnimalAPI', {
    receiveData: (callback: any) => {
        const subscription = (_event: Electron.IpcRendererEvent, value: any) =>
            callback(value);
        ipcRenderer.on('update-animal-data', subscription);
        return () => ipcRenderer.removeListener('update-animal-data', subscription);
    },

    updateAnimal: (animalData: any) => ipcRenderer.invoke('update-animal-data', animalData),
});

contextBridge.exposeInMainWorld('vaccineAPI', {
    getAnimalsData: (callback: any) => {
        const subscription = (_event: Electron.IpcRendererEvent, value: any) =>
            callback(value.animals, value.vaccinesName);
        ipcRenderer.on('animals-datas-for-vaccine', subscription);
        return () => ipcRenderer.removeListener('animals-datas-for-vaccine', subscription);
    },

    addVaccine: (vaccineData: any) => ipcRenderer.invoke('add-vaccine', vaccineData),

    deleteVaccine: (vaccineId: number) => ipcRenderer.invoke('delete-vaccine', vaccineId),
});

contextBridge.exposeInMainWorld("deathAnimalsAPI", {
    getDeletedAnimals: () => ipcRenderer.invoke("deathAnimals:getAll"),

    restoreAnimal: (id: number) => ipcRenderer.invoke("deathAnimals:restore", id),

    permanentDelete: (payload: { id: number; type: string }) => ipcRenderer.invoke("deathAnimals:permanentDelete", payload),
});

contextBridge.exposeInMainWorld("settingsAPI", {
    getSettingsData: (settingsData: SettingsData) => ipcRenderer.invoke("get-settings-data", settingsData),

    saveSettings: (settingsData: SettingsData) => ipcRenderer.invoke("save-settings-data", settingsData),
});

contextBridge.exposeInMainWorld("animalServiceAPI", {
    removeAnimal: (trashData: any) => ipcRenderer.invoke("remove-animal", trashData),

    gaveBirth: (allData: any) => ipcRenderer.invoke("gave-birth", allData),

    applyInsemination: (data: any) => ipcRenderer.invoke("apply-insemination", data),
});

contextBridge.exposeInMainWorld("authAPI", {
    login: (loginData: any) => ipcRenderer.invoke("log-in", loginData),

    signup: (signupData: any) => ipcRenderer.invoke("sign-up", signupData),

    getAuth: () => ipcRenderer.invoke("get-auth"),

    logout: () => ipcRenderer.invoke("log-out"),
});
