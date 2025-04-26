const { contextBridge, ipcRenderer, ipcMain } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    openPage: (pageId) => {
        ipcRenderer.send("ipcMain:openPage", pageId);
    },

    openMenu: () => {
        ipcRenderer.send("ipcMain:openMenu");
    },

    openAddCowMenu: () => {
        ipcRenderer.send("ipcMain:openAddCowMenu");
    },

    receiveDatas: (callback) => {
        ipcRenderer.on("sendDatas", (event, datas) => {
            callback(datas);
        });
    }
});