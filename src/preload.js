const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("loading", {
    isOnline: (status) => ipcRenderer.send('getStatus', status),

    getDatas: () => ipcRenderer.invoke('sendLoadingDatas')

});

contextBridge.exposeInMainWorld("offline", {
    // isOnline: (status) => ipcRenderer.invoke('getStatus', status),

    receiveNewDatas: (callback) => {
        ipcRenderer.on("sendNewDatas", (event, newDatas) => {
            callback(newDatas);
        });
    }
});

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
    },

    receiveMothersEarringNo: (callback) => {
        ipcRenderer.on("sendMothersEarringNo", (event, EarringNos) => {
            callback(EarringNos);
        });
    },

    receiveBullsName: (callback) => {
        ipcRenderer.on("sendBullsName", (event, Names) => {
            callback(Names);
        });
    },
});

contextBridge.exposeInMainWorld("animalDetailAPI", {
    receiveDetailDatas: (callback) => {
        ipcRenderer.on("sendDetailDatas", (event, allDatas) => {
            callback(allDatas);
        });
    },
});

contextBridge.exposeInMainWorld("animalsAPI", {
    receiveDatas: (callback) => {
        ipcRenderer.on("sendDatas", (event, allDatas) => {
            console.log(allDatas)
            callback(allDatas);
        });
    },
});

contextBridge.exposeInMainWorld("updateAPI", {
    updateAnimalDatas: (allDatas) => {
        ipcRenderer.send("ipcMain:updateAnimalDatas", allDatas);
    },

    updateResult: (callback) => {
        ipcRenderer.on("updateResult", (event, data) => {
            callback(data);
        });
    },
});

contextBridge.exposeInMainWorld("vaccineAPI", {
    openAddVaccine: () => {
        ipcRenderer.send("ipcMain:openAddVaccine");
    },

    receiveAnimalsDatas: (callback) => {
        ipcRenderer.on("sendAnimalsDatas", (event, animalsDatas) => {
            callback(animalsDatas);
        });
    },

    removeVaccine: (vaccineId) => {
        ipcRenderer.send("ipcMain:removeVaccine", vaccineId);
    },

    sendVaccineDatas: (vaccineDatas) => {
        ipcRenderer.send("ipcMain:receiveVaccineDatas", vaccineDatas);
    },
});

contextBridge.exposeInMainWorld("settingsAPI", {
    receiveSettingsDatas: (callback) => {
        ipcRenderer.on("sendSettingsDatas", (event, settingsDatas) => {
            callback(settingsDatas);
        });
    },

    saveSettingsDatas: (settingsDatas) => {
        ipcRenderer.send("ipcMain:saveSettingsDatas", settingsDatas);
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
        ipcRenderer.send("ipcMain:openUpdateAnimal", datas);
    },

    receiveUpdateDatas: (callback) => {
        ipcRenderer.on("sendUpdateDatas", (event, allDatas) => {
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

    gaveBirth: (datas) => {
        ipcRenderer.send("ipcMain:gaveBirth", datas);
    },

    applyInsemination: (datas) => {
        ipcRenderer.send("ipcMain:applyInsemination", datas);
    },

    updateAvailable: (callback) => {
        ipcRenderer.on("update-available", (event, version) => {
            callback(version);  
        });
    },

    updateResponse: (response) => {
        ipcRenderer.send("updateResponse", response);
    },

    exportExcel: (pageName) => {
        ipcRenderer.invoke("exportExcel", pageName);
    },

    login: (existUserData) => {
        console.log("login calisti");
        ipcRenderer.send("logInData", existUserData);
    },

    receiveLoginResult: (callback) => {
        ipcRenderer.on("sendLoginResult", (event, result) => {
            callback(result);
        });
    },

    signUp: (newUserData) => {
        ipcRenderer.send("signUpData", newUserData);
    },

    receiveSignUpResult: (callback) => {
        ipcRenderer.on("sendSignUpResult", (event, result) => {
            callback(result);
        });
    }
});
