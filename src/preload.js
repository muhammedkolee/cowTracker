const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    openPage: (pageId) => {
        ipcRenderer.send("ipcMain:openPage", pageId);
    },

    openMenu: () => {
        ipcRenderer.send("ipcMain:openMenu");
    },

    openAddAnimalMenu: (animalType) => {
        ipcRenderer.send("ipcMain:openAddAnimalMenu", animalType);
    },

    receiveDatas: (callback) => {
        ipcRenderer.on("sendDatas", (event, datas) => {
            callback(datas);
        });
    },

    openAnimalDetail: (datas) => {
        ipcRenderer.send("ipcMain:openAnimalDetail", datas);
    },

    receiveDetailDatas: (callback) => {
        ipcRenderer.on("sendDetailDatas", (event, datas) => {
            callback(datas);
        });
    },

    openUpdateAnimal: (earringNumber) => {
        ipcRenderer.send("ipcMain:openUpdateAnimal", earringNumber);
    },

    receiveUpdateDatas: (callback) => {
        ipcRenderer.on("sendUpdateDatas", (event, datas) => {
            callback(datas);
        });
    },

    receiveAnimalType: (callback) => {
        ipcRenderer.on("sendAnimalType", (event, animalType) => {
            callback(animalType);
        });
    },
    
});
