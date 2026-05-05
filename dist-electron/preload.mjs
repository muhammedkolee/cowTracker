"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
  // electron/preload.ts
});
electron.contextBridge.exposeInMainWorld("api", {
  getCows: () => electron.ipcRenderer.invoke("get-cows"),
  getCalves: () => electron.ipcRenderer.invoke("get-calves"),
  getAnimals: () => electron.ipcRenderer.invoke("get-animals"),
  getHeifers: () => electron.ipcRenderer.invoke("get-heifers"),
  getBulls: () => electron.ipcRenderer.invoke("get-bulls"),
  getVaccines: () => electron.ipcRenderer.invoke("get-vaccines"),
  getVaccinesName: () => electron.ipcRenderer.invoke("get-vaccines-name"),
  openAddAnimalWindow: (type) => electron.ipcRenderer.send("open-add-animal-window", type),
  openAnimalDetailWindow: (animalId) => electron.ipcRenderer.send("open-animal-detail-window", animalId),
  openUpdateAnimalWindow: (animalId) => electron.ipcRenderer.send("open-update-animal-window", animalId),
  openAddVaccineWindow: () => electron.ipcRenderer.send("open-add-vaccine-window"),
  closeWindow: () => electron.ipcRenderer.send("close-window"),
  onRefreshData: (callback) => {
    const subscription = (_event) => callback();
    electron.ipcRenderer.on("refresh-all-data", subscription);
    return () => electron.ipcRenderer.removeListener("refresh-all-data", subscription);
  }
});
electron.contextBridge.exposeInMainWorld("addAnimalAPI", {
  receiveAnimalType: (callback) => electron.ipcRenderer.on("animal-type-to-open", (_event, value) => callback(value)),
  getMothersEarringNo: () => electron.ipcRenderer.invoke("get-mothers-earring-no"),
  getBullsName: () => electron.ipcRenderer.invoke("get-bulls-name"),
  addAnimal: (animalData) => electron.ipcRenderer.invoke("add-animal-data", animalData)
});
electron.contextBridge.exposeInMainWorld("animalDetailAPI", {
  receiveData: (callback) => electron.ipcRenderer.on("animal-detail-data", (_event, value) => callback(value))
});
electron.contextBridge.exposeInMainWorld("updateAnimalAPI", {
  receiveData: (callback) => electron.ipcRenderer.on("update-animal-data", (_event, value) => callback(value)),
  updateAnimal: (animalData) => electron.ipcRenderer.invoke("update-animal-data", animalData)
});
electron.contextBridge.exposeInMainWorld("vaccineAPI", {
  getAnimalsData: (callback) => electron.ipcRenderer.on("animals-datas-for-vaccine", (_event, value) => callback(value.animals, value.vaccinesName)),
  addVaccine: (vaccineData) => electron.ipcRenderer.invoke("add-vaccine", vaccineData),
  deleteVaccine: (vaccineId) => electron.ipcRenderer.invoke("delete-vaccine", vaccineId)
});
electron.contextBridge.exposeInMainWorld("deathAnimalsAPI", {
  getDeletedAnimals: () => electron.ipcRenderer.invoke("deathAnimals:getAll"),
  restoreAnimal: (id) => electron.ipcRenderer.invoke("deathAnimals:restore", id),
  permanentDelete: (payload) => electron.ipcRenderer.invoke("deathAnimals:permanentDelete", payload)
});
electron.contextBridge.exposeInMainWorld("settingsAPI", {
  getSettingsData: (settingsData) => electron.ipcRenderer.invoke("get-settings-data", settingsData),
  saveSettings: (settingsData) => electron.ipcRenderer.send("save-settings-data", settingsData)
});
electron.contextBridge.exposeInMainWorld("animalServiceAPI", {
  removeAnimal: (trashData) => electron.ipcRenderer.send("remove-animal", trashData),
  gaveBirth: (allData) => electron.ipcRenderer.send("gave-birth", allData),
  applyInsemination: (data) => electron.ipcRenderer.send("apply-insemination", data)
});
electron.contextBridge.exposeInMainWorld("authAPI", {
  login: (loginData) => electron.ipcRenderer.invoke("log-in", loginData),
  signup: (signupData) => electron.ipcRenderer.invoke("sign-up", signupData),
  getAuth: () => electron.ipcRenderer.invoke("get-auth"),
  logout: () => electron.ipcRenderer.send("log-out")
});
