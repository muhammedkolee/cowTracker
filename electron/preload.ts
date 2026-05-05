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
        const subscription = (_event: any) => callback();
        ipcRenderer.on('refresh-all-data', subscription);
        
        // Temizlik için bir fonksiyon döndür
        return () => ipcRenderer.removeListener('refresh-all-data', subscription);
    }
});

contextBridge.exposeInMainWorld('addAnimalAPI', {
    receiveAnimalType: (callback: any) => 
        ipcRenderer.on('animal-type-to-open', (_event, value) => callback(value)),

    getMothersEarringNo: () => ipcRenderer.invoke('get-mothers-earring-no'),
    
    getBullsName: () => ipcRenderer.invoke('get-bulls-name'),

    addAnimal: (animalData: any[]) => ipcRenderer.invoke('add-animal-data', animalData)
}); 

contextBridge.exposeInMainWorld('animalDetailAPI', {
    receiveData: (callback: any) => 
        ipcRenderer.on('animal-detail-data', (_event, value) => callback(value)),
});

contextBridge.exposeInMainWorld('updateAnimalAPI', {
    receiveData: (callback: any) => ipcRenderer.on('update-animal-data', (_event, value) => callback(value)),

    updateAnimal: (animalData: any) => ipcRenderer.invoke('update-animal-data', animalData),
});

contextBridge.exposeInMainWorld('vaccineAPI', {
    getAnimalsData: (callback: any) => ipcRenderer.on('animals-datas-for-vaccine', (_event, value) => callback(value.animals, value.vaccinesName)),

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

    saveSettings: (settingsData: SettingsData) => ipcRenderer.send("save-settings-data", settingsData),
});

contextBridge.exposeInMainWorld("animalServiceAPI", {
    removeAnimal: (trashData: any) => ipcRenderer.send("remove-animal", trashData),

    gaveBirth: (allData: any) => ipcRenderer.send("gave-birth", allData),

    applyInsemination: (data: any) => ipcRenderer.send("apply-insemination", data),
});

contextBridge.exposeInMainWorld("authAPI", {
    login: (loginData: any) => ipcRenderer.invoke("log-in", loginData),

    signup: (signupData: any) => ipcRenderer.invoke("sign-up", signupData),

    getAuth: () => ipcRenderer.invoke("get-auth"),

    logout: () => ipcRenderer.send("log-out"),
});
