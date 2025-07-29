const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("addAnimalAPI", {
    receiveAnimalType: (callback) => {
        ipcRenderer.on("sendAnimalType", (event, animalType) => {
            callback(animalType);
        });
    },

    addAnimal: (datas) => {
        ipcRenderer.send("ipcMain:addAnimal", datas);
    },

    addResult: (callback) => {
        ipcRenderer.on("addResult", (event, data) => {
            callback(data);
        });
    }
});

contextBridge.exposeInMainWorld("animalDetailAPI", {
    receiveDetailDatas: (callback) => {
        ipcRenderer.on("sendDetailDatas", (event, allDatas) => {
            callback(allDatas);
        });
    }
});

contextBridge.exposeInMainWorld("animalsAPI", {
    receiveDatas: (callback) => {
        ipcRenderer.on("sendDatas", (event, datas) => {
            console.log(datas);
            callback(datas);
        });
    },
});

contextBridge.exposeInMainWorld("updateAPI", {
    updateAnimalDatas: (allDatas) => {
        ipcRenderer.send("ipcMain:updateAnimalDatas", allDatas);
        console.log("preload.js: ", allDatas);
    }
});

contextBridge.exposeInMainWorld("electronAPI", {
    // ***
    openPage: (pageId) => {
        ipcRenderer.send("ipcMain:openPage", pageId);
    },

    // ***
    openMenu: () => {
        ipcRenderer.send("ipcMain:openMenu");
    },

    // ***
    openAddAnimalMenu: (animalType) => {
        ipcRenderer.send("ipcMain:openAddAnimalMenu", animalType);
    },

    // ***
    openAnimalDetail: (datas) => {
        ipcRenderer.send("ipcMain:openAnimalDetail", datas);
    },

    // ***
    openUpdateAnimal: (datas) => {
        // console.log(datas)
        ipcRenderer.send("ipcMain:openUpdateAnimal", datas);
    },

    receiveUpdateDatas: (callback) => {
        ipcRenderer.on("sendUpdateDatas", (event, allDatas) => {
            console.log(allDatas)
            callback(allDatas);
        });
    },

    openMainWindow: () => {
        ipcRenderer.send("ipcMain:getAnimalsDatas");
    },

    removeAnimal: (datas) => {
        ipcRenderer.send("ipcMain:removeAnimal", datas);
    },

    refresh: (callback) => {
        ipcRenderer.on("refresh", (event, datas) => {
            callback(datas);
        });
    },


});
