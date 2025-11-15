// For auto update.
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.autoDownload = false;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

// For settings' datas.
const store = require("../backend/store.js");

// Frameworks
const { app, BrowserWindow, ipcMain, screen, dialog } = require("electron");
const path = require("path");
const ExcelJS = require("exceljs");

// Import files for backend.
const addAnimal = require("../backend/addAnimalF.js");
const updateAnimal = require("../backend/updateAnimalF.js");
const removeAnimal = require("../backend/removeAnimalF.js");
const addVaccine = require("../backend/addVaccineF.js");
const updateDatabase = require("../backend/updateDatabaseF.js");
const removeVaccine = require("../backend/removeVaccineF.js");
const supabase = require("../backend/databaseConnection.js");
const { error, info } = require("console");
const { eventNames } = require("process");

let mainWindow;

// If app is ready, this block will be run.
app.on("ready", async () => {
    // autoUpdater.checkForUpdatesAndNotify();
    
    // Synchronize cloud datas with local datas.
    try {
        await setAllLocalDatas();
        store.set("Vaccines", await getVaccinesDatas());
        store.set("updatedDatas", await updateDatabase());
    }
    catch {

    }
    // Get primary display to maximize window.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Create Main Window
    mainWindow = new BrowserWindow({
        width,
        height,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // It make window maximize.
    mainWindow.maximize();

    mainWindow.setMenu(null);
    
    // Load index.html to Main Window.
    mainWindow
    .loadFile(path.join(__dirname, "../views/index.html"))
    .then(async () => {
            const datas = {};
            datas.animalsDatas = store.get("Animals");
            datas.updatedDatas = store.get("updatedDatas");
            datas.appVersion = app.getVersion();
            mainWindow.webContents.send("sendDatas", datas);
        });
        
    //Dev
    //This block will be deleted after dev phase.
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            mainWindow.toggleDevTools();
        }
    });
    //Dev

    autoUpdater.checkForUpdates();

    // This block will be change.
    autoUpdater.on("checking-for-update", () => {
        log.info("Checking for update");
    });
    
    autoUpdater.on("update-available", (info) => {
        log.info("Update Available, Version: ", info.version);
        mainWindow.webContents.send("update-available", "info.version");
    });
    
    
    autoUpdater.on("update-not-available", () => {
        log.info("Update Not Available");
    });

    autoUpdater.on("error", (err) => {
        log.info("Error in Updater", err);
    });
    
    autoUpdater.on("update-downloaded", (info) => {
        log.info("Update successfully downloaded.", );
        autoUpdater.quitAndInstall();
    });

    ipcMain.on("updateResponse", (event, response) => {
        if (response) {
            log.info("User accepted dowloading the update");
            autoUpdater.downloadUpdate();
        }
        else {
            log.info("User denied the update.");
        }
    }); 
    // This block will be change.
    
    // EasterEgg
    mainWindow.webContents.on("before-input-event", (event, input) => {
       if (input.key === "m" && input.control && input.type === "keyDown") {
            mainWindow.loadFile(path.join(__dirname, "../views/egg.html"))
       } 
    });
    // EasterEgg

    ipcMain.on("ipcMain:openOfflinePage", () => {
        mainWindow.loadFile(path.join(__dirname, "../views/offlinePage.html"));
    });

    // To open page which user want to open.
    // pageName => file name without .html
    ipcMain.on("ipcMain:openPage", (event, pageName) => {
        mainWindow.loadFile(path.join(__dirname, "../views/" + pageName + ".html"));

        mainWindow.webContents.once("did-finish-load", async () => {
                if (pageName === "animals") {
                    const allDatas = {}; 
                    // allDatas.animalDatas = await getAnimalsDatas();
                    allDatas.animalDatas = store.get("Animals");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "cows") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getCowsDatas();
                    allDatas.animalDatas = store.get("Cows");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "heifers") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getHeifersDatas();
                    allDatas.animalDatas = store.get("Heifers");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "calves") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getCalvesDatas();
                    allDatas.animalDatas = store.get("Calves");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "bulls") {
                    const allDatas = {};
                    // allDatas.animalDatas = await getBullsDatas();
                    allDatas.animalDatas = store.get("Bulls");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "vaccines") {
                    const allDatas = {};
                    // allDatas.vaccineDatas = await getVaccinesDatas();
                    allDatas.vaccineNames = await getVaccinesNames();
                    allDatas.vaccineDatas = store.get("Vaccines");
                    allDatas.settingsDatas = store.get("settings");
                    mainWindow.webContents.send("sendDatas", allDatas);
                } else if (pageName === "settings") {
                    mainWindow.webContents.send("sendSettingsDatas", store.get("settings"));
                }
            });
    });

    // To open main menu.
    ipcMain.on("ipcMain:openMenu", () => {        
        mainWindow
            .loadFile(path.join(__dirname, "../views/index.html"))
            .then(async () => {
                const datas = {};
                datas.animalsDatas = store.get("Animals");
                datas.updatedDatas = store.get("updatedDatas");
                datas.appVersion = app.getVersion();
                mainWindow.webContents.send("sendDatas", datas);
            });
    });
});


// MENUS
// Add Animal menu.
ipcMain.on("ipcMain:openAddAnimalMenu", (event, animalType) => {
    const addAnimalMenu = new BrowserWindow({
        width: 800,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    addAnimalMenu.setMenu(null);

    // Dev Phase
    addAnimalMenu.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            addAnimalMenu.toggleDevTools();
        }
    });
    // Dev Phase

    addAnimalMenu
        .loadFile(path.join(__dirname, "../views/addAnimal.html"))
        .then(async () => {
            addAnimalMenu.webContents.send("sendAnimalType", animalType);
            addAnimalMenu.webContents.send(
                "sendMothersEarringNo",
                await getMotherEarringNos()
            );
            addAnimalMenu.webContents.send("sendBullsName", await getBullsName());
        });
});

// Animal Detail Menu
ipcMain.on("ipcMain:openAnimalDetail", (event, datas) => {
    const animalDetailWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    animalDetailWindow.setMenu(null);

    // Dev Phase
    animalDetailWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            animalDetailWindow.toggleDevTools();
        }
    });
    // Dev Phase

    animalDetailWindow
        .loadFile(path.join(__dirname, "../views/animalDetail.html"))
        .then(async () => {
            if (datas.type === "cow") {
                const allDatas = await getCowDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            } else if (datas.type === "heifer") {
                const allDatas = await getHeiferDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            } else if (datas.type === "bull") {
                const allDatas = await getBullDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            } else if (datas.type === "calf") {
                const allDatas = await getCalfDatas(datas);

                animalDetailWindow.webContents.send(
                    "sendDetailDatas",
                    allDatas
                );
            }
        });
});

// Update Animal Menu
ipcMain.on("ipcMain:openUpdateAnimal", (event, datas) => {
    const updateAnimalWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    updateAnimalWindow.setMenu(null);

    // Dev Phase
    updateAnimalWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            updateAnimalWindow.toggleDevTools();
        }
    });
    // Dev Phase

    updateAnimalWindow
        .loadFile(path.join(__dirname, "../views/updateAnimal.html"))
        .then(async () => {
            if (datas.type === "cow") {
                const allDatas = await getCowDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            } else if (datas.type === "heifer") {
                const allDatas = await getHeiferDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            } else if (datas.type === "bull") {
                const allDatas = await getBullDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            } else if (datas.type === "calf") {
                const allDatas = await getCalfDatas(datas);

                updateAnimalWindow.webContents.send(
                    "sendUpdateDatas",
                    allDatas
                );
            }

            updateAnimalWindow.webContents.send(
                "sendMothersEarringNo",
                await getMotherEarringNos()
            );

            updateAnimalWindow.webContents.send("sendBullsName", await getBullsName());

        });
});

// Open Add Vaccine page.
ipcMain.on("ipcMain:openAddVaccine", () => {
    const addVaccineWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    addVaccineWindow.setMenu(null);

    // Dev Phase
    addVaccineWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F12" && input.type === "keyDown") {
            addVaccineWindow.toggleDevTools();
        }
    });
    // Dev Phase

    addVaccineWindow
        .loadFile(path.join(__dirname, "../views/addVaccine.html"))
        .then(async () => {
            const { data: animalsDatas, error: animalsError } = await supabase
                .from("Animals")
                .select("EarringNo, Name, Id");
            if (animalsError) {
                log.info("main.js 384 | Aşı bilgileri çekilirken bir hata oluştu: ", animalsError);
            } else {
                addVaccineWindow.webContents.send(
                    "sendAnimalsDatas",
                    animalsDatas
                );
            }
        });
});
// END OF THE MENUS

// FUNCTIONS
// Add Animal
ipcMain.on("ipcMain:addAnimal", async (event, datas) => {
    if (await addAnimal(datas)) {
        event.sender.send("addResult", true);
    } else {
        event.sender.send("addResult", false);
    }

    mainWindow.webContents.send("refresh", await refreshDatas());
});

// Update Animal
ipcMain.on("ipcMain:updateAnimalDatas", async (event, updateDatas) => {
    if (await updateAnimal(updateDatas)) {
        event.sender.send("updateResult", true);
    } else {
        event.sender.send("updateResult", false);
    }
    mainWindow.webContents.send("refresh", await refreshDatas());
});

// Remove Animal
ipcMain.on("ipcMain:removeAnimal", async (event, datas) => {
    await removeAnimal(datas);
    mainWindow.webContents.send("refresh", await refreshDatas());
});

// Receive Vaccines' Datas
ipcMain.on("ipcMain:receiveVaccineDatas", async (event, vaccineDatas) => {
    await addVaccine(vaccineDatas);
    store.set("Vaccines", await getVaccinesDatas());
    const allDatas = {
        settingsDatas: store.get("settings"),
        vaccineDatas: store.get("Vaccines")
    }
    mainWindow.webContents.send("refresh", allDatas);
});

// Remove Vaccine from the database.
ipcMain.on("ipcMain:removeVaccine", async (event, vaccineId) => {
    await removeVaccine(vaccineId);
    store.set("Vaccines", await getVaccinesDatas());
    const allDatas = {
        settingsDatas: store.get("settings"),
        vaccineDatas: store.get("Vaccines")
    }
    mainWindow.webContents.send("refresh", allDatas);

});

// If animal gave birth.
ipcMain.on("ipcMain:gaveBirth", async (event, datas) => {
    const { data: cowData, error: cowError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    if (cowError) {
        log.info("main.js 450 | İnek doğurdu olarak işaretlenirken bir hata oluştu: ", cowError);
    }

    const allDatas = {};
    allDatas.animalData = cowData[0];
    allDatas.animalData.Type = "heifer";
    allDatas.heiferData = {
        Id: allDatas.animalData.Id,
        EarringNo: allDatas.animalData.EarringNo,
        LastBirthDate: datas.date,
        Name: allDatas.animalData.Name,
    };

    if (!updateAnimal(allDatas)) {
        log.info("main.js 464 | Hayvan Güncelleme sırasında bir hata oluştu");   
    }
    mainWindow.webContents.send("refresh", await refreshDatas());
});

// If animal was inseminated.
ipcMain.on("ipcMain:applyInsemination", async (event, datas) => {
    const { data: heiferData, error: heiferError } = await supabase.from("Animals").select("*").eq("Id", datas.animalId);
    if (heiferError) {
        log.info("main.js 472 | Düve tohumlama sırasında bir hata oluştu: ", heiferError);
    }

    const allDatas = {};
    allDatas.animalData = heiferData[0];
    allDatas.animalData.Type = "cow";
    allDatas.cowData = {
        Id: allDatas.animalData.Id,
        EarringNo: allDatas.animalData.EarringNo,
        Name: allDatas.animalData.Name,
        InseminationDate: datas.date,
        BullName: datas.bullName,
        CheckedDate: "1970-01-01"
    };

    if (updateAnimal(allDatas)) {
        await setAllLocalDatas();
    }
    else {
        log.info("main.js 491 | Bir hata oluştu:");
    }
    mainWindow.webContents.send("refresh", await refreshDatas());
});

// Save setting's datas to local.
ipcMain.on("ipcMain:saveSettingsDatas", (event, settinsDatas) => {
    store.set("settings.showInformationButton", settinsDatas.showInformationButton);
    store.set("settings.gestationDays", settinsDatas.gestationDays);
    store.set("settings.dryOffDays", settinsDatas.dryOffDays);
    store.set("settings.calfReduceToOneLiterDays", settinsDatas.calfReduceToOneLiterDays);
    store.set("settings.calfReduceToTwoLiterDays", settinsDatas.calfReduceToTwoLiterDays);
    store.set("settings.calfWeaningDays", settinsDatas.calfWeaningDays);
    store.set("settings.calfToAdultDays", settinsDatas.calfToAdultDays);
});

// Export file as xlsx which user want to export.
ipcMain.handle("exportExcel", async (event, datas) => {
    // let datas;
    // let fileName;
    // let headerMap;

    // if (pageName === "animals") {
    //     datas = await getAnimalsDatas();
    //     fileName = `Tüm Hayvanlar - ${new Date().toLocaleDateString("tr-TR")}.xlsx`;
    //     headerMap = {
    //         EarringNo: "Küpe No.",
    //         Name: "İsim",
    //         BirthDate: "Doğum Tarihi",
    //         MotherEarringNo: "Anne Küpe No.",
    //         MotherName: "Anne İsmi"
    //     }
    // }
    // else if (pageName === "cows") {
    //     datas = await getCowsDatas();
    //     fileName = `İnekler - ${new Date().toLocaleDateString("tr-TR")}.xlsx`;
    //     headerMap = {
    //         EarringNo: "Küpe No.",
    //         Name: "İsim",
    //         InseminationDate: "Tohumlama Tar.",
    //         BullName: "Dana İsmi",
    //         CheckedDate: "Gebelik Kontrol"
    //     }
    // }
    // else if (pageName === "heifers") {
    //     datas = await getHeifersDatas();
    //     fileName = `Düveler - ${new Date().toLocaleDateString("tr-TR")}.xlsx`;    
    //     headerMap = {
    //         EarringNo: "Küpe No.",
    //         Name: "İsim",
    //         LastBirthDate: "Son Doğurduğu Tar."
    //     }
    // }
    // else if (pageName === "calves") {
    //     datas = await getCalvesDatas();
    //     fileName = `Buzağılar - ${new Date().toLocaleDateString("tr-TR")}.xlsx`;
    //     headerMap = {
    //         EarringNo: "Küpe No.",
    //         Name: "İsim",
    //         BirthDate: "Doğum Tarihi",
    //         Gender: "Cinsiyet"            
    //     }
    // }
    // else if (pageName === "bulls") {
    //     datas = await getBullsDatas();
    //     fileName = `Danalar - ${new Date().toLocaleDateString("tr-TR")}.xlsx`;
    //     headerMap = {
    //         EarringNo: "Küpe No.",
    //         Name: "İsim",
    //         BirthDate: "Doğum Tarihi",
    //         MotherEarringNo: "Anne Küpe No.",
    //         MotherName: "Anne İsmi"
    //     }
    // }
    
    let fileName = `${datas.fileName} - ${new Date().toLocaleDateString("tr-TR")}.xlsx`;

    const {canceled, filePath } = await dialog.showSaveDialog({
        title: "Excel Dosyasını Kaydet",
        defaultPath: `${app.getPath("desktop")}/${fileName}`,
        filters: { name: "Excel Files", extensions: ["xlsx"] },
    });
    
    if (canceled || !filePath) {
        return false
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(fileName);

        // Başlıkları (headers) JSON objelerinin key'lerinden çıkar
        const headers = Object.keys(datas.tableData[0] || {});
        worksheet.columns = headers.map((key) => ({
            header: key,
            key: key,
            width: Math.max(
                key.length,
                ...datas.tableData.map((row) => (row[key] ? row[key].toString().length : 0))
            ) + 2,
        }));

        // Verileri ekle
        datas.tableData.forEach((row) => {
            worksheet.addRow(row);
        });

        // Stil: başlık satırını renklendir + border ekle
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF007ACC" },
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // Tüm hücrelere border ekle
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // header zaten yapıldı
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        await workbook.xlsx.writeFile(filePath);
        return filePath;
    } catch (err) {
        console.error("Excel export error:", err);
        return false;
    }

    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet(fileName);

    // worksheet.columns = Object.keys(datas[0])
    // .filter((key) => key !== "Id")
    // .filter((key) => key !== "Type")
    // .map((key) => ({
    //     header: headerMap[key] || key,
    //     key: key,
    //     width: Math.max(
    //         ...datas.map((row) => (row[key] ? row[key].toString().length : 0)),
    //         key.length
    //     ) + 2,
    // }));

    // datas.forEach((row) => {
    //     const newRow = {};
    //     Object.keys(row).forEach((key) => {
    //         if (row[key] && !isNaN(Date.parse(row[key]))) {
    //             newRow[key] = formatDateTR(row[key]);
    //         } else {
    //             newRow[key] = row[key];
    //         }
    //     });
    //     worksheet.addRow(newRow);
    // });


    // worksheet.eachRow((row, rowNumber) => {
    //     row.eachCell((cell) => {
    //         cell.border = {
    //             top: { style: "thin" },
    //             left: { style: "thin" },
    //             bottom: { style: "thin" },
    //             right: { style: "thin" },
    //         };
    //         if (rowNumber === 1) {
    //             // Başlık satırı
    //             cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    //             cell.fill = {
    //                 type: "pattern",
    //                 pattern: "solid",
    //                 fgColor: { argb: "FF007ACC" },
    //             };
    //         }
    //     });
    // });

    // Dosyayı kaydet
    // await workbook.xlsx.writeFile(filePath); 

    // return filePath
});
// END OF THE FUNCTIONS

// If all window(s) closed, shut down app.
app.on("window-all-closed", () => {
    app.quit();
});

// Functions of JS
// Get datas of one cow.
async function getCowDatas(datas) {
    console.log(datas)
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);

    const { data: cowData, error: cowError } = await supabase
        .from("Cows")
        .select("*")
        .eq("Id", datas.animalId);

    const { data: calvesData, error: calvesError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "calf")
        .eq("MotherEarringNo", datas.earringNo);

    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("AnimalId", datas.animalId);

    const allDatas = {
        animalData: animalData,
        cowData: cowData,
        calvesData: calvesData,
        vaccinesData: vaccinesData,
    };

    return allDatas;
}

// Get datas of one heifer.
async function getHeiferDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: heiferData, error: heiferError } = await supabase
        .from("Heifers")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: calvesData, error: calvesError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "calf")
        .eq("MotherEarringNo", datas.earringNo);
    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("AnimalId", datas.animalId);

    const allDatas = {
        animalData: animalData,
        heiferData: heiferData,
        calvesData: calvesData,
        vaccinesData: vaccinesData,
    };

    return allDatas;
}

// Get datas of one bull.
async function getBullDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("EarringNo", datas.earringNo);

    const allDatas = { animalData: animalData, vaccinesData: vaccinesData };

    return allDatas;
}

// Get datas of one calf.
async function getCalfDatas(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: calfData, error: calfError } = await supabase
        .from("Calves")
        .select("*")
        .eq("Id", datas.animalId);
    const { data: vaccinesData, error: vaccinesError } = await supabase
        .from("Vaccines")
        .select("*")
        .eq("EarringNo", datas.earringNo);

    if (animalError || vaccinesError) {
        log.info("main.js 608 | Buzağı bilgileri çekilirken bir hata oluştu: ", animalError, "\n", calfError, "\n", vaccinesError);
    }

    const allDatas = {
        animalData: animalData,
        calfData: calfData,
        vaccinesData: vaccinesData,
    };

    return allDatas;
}

// Get datas of whole animals.
async function getAnimalsDatas() {
    const { data, error } = await supabase
        .from("Animals")
        .select("*")
        .order("Type", { ascending: false });
    if (error) {
        log.info("main.js 627 | Hayvan bilgileri çekilirken bir hata oluştu: ", error);
    }
    return data;
}

// Get datas of whole cows.
async function getCowsDatas() {
    const { data: cowsData, error } = await supabase
        .from("Cows")
        .select("*, Animals (Breed, Note)")
        .order("InseminationDate", { ascending: true });
    if (error) {
        log.info("main.js 639 | İnek bilgileri çekilirken bir hata oluştu: ", error);
    }

    for (let cow of cowsData){
        const { data: calfData, error: calfError } = await supabase
        .from("Animals")
        .select("BirthDate")
        .eq("MotherEarringNo", cow.EarringNo)
        .order("BirthDate", { ascending: false })
        .limit(1)
        .maybeSingle()

        if (calfError) {
            console.log("Bir sorun oluştu.", calfError);
            cow.LastBirthDate = null;
            // continue;
        }
        cow.LastBirthDate = calfData?.BirthDate || null;
    }

    return cowsData;
}

// Get datas of whole heifers.
async function getHeifersDatas() {
    const { data, error } = await supabase
        .from("Heifers")
        .select("*, Animals (Breed, Note)")
        .order("LastBirthDate", { ascending: false });
    if (error) {
        log.info("main.js 651 | Düve bilgileri çekilirken bir hata oluştu: ", error);
    }
    return data;
}

// Get datas of whole calves.
async function getCalvesDatas() {
    const { data: calvesData, error: calvesError } = await supabase
        .from("Calves")
        .select(
            "*, Animals (MotherEarringNo, MotherName, Breed, Note)"
        )
        .order("BirthDate", { ascending: false });

    if (calvesError) {
        log.info("main.js 666 | Buzağı bilgileri çekilirken bir hata oluştu: ", error);
    }
    return calvesData;
}

// Get datas of whole bulls.
async function getBullsDatas() {
    const { data, error } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "bull")
        .order("BirthDate", { ascending: true });
    if (error) {
        log.info("main.js 679 | Dana bilgileri çekilirken bir hata oluştu: ", error);
    }
    return data;
}

async function getVaccinesNames() {
    const {data: allVaccineNames, error: vaccineError } = await supabase
    .from("Vaccines")
    .select("VaccineName", { ascending: true });

    const vaccineNames = [...new Set(allVaccineNames.map(v => v.VaccineName))];
    
    return vaccineNames;
}

// Get datas of vaccines.
async function getVaccinesDatas() {
    const { data, error } = await supabase
        .from("Vaccines")
        .select("Id, VaccineName, VaccineDate, Animals (Id, EarringNo, Name)")
        .order("VaccineDate", { ascending: false });
    if (error) {
        log.info("main.js 691 | Aşı bilgileri çekilirken bir hata oluştu: ", error);
    }
    return data;
}

// Get Mom's Earring Nos
async function getMotherEarringNos() {
    const { data, error } = await supabase
        .from("Animals")
        .select("EarringNo, Name")
        .in("Type", ["cow", "heifer"]);
    if (error) {
        log.info("main.js 701 | İnek küpe numaraları çekilirken bir hata oluştu: ", error);
    }
    return data;
}

// Get Bulls' Names
async function getBullsName() {
    const { data, error } = await supabase
        .from("Animals")
        .select("Name")
        .eq("Type", "bull");
    if (error) {
        log.info("main.js 891 | Dana isimleri çekilirken bir hata oluştu: ", error);
    }
    return data;
}

async function setAllLocalDatas() {
    store.set("Animals", await getAnimalsDatas());
    store.set("Cows", await getCowsDatas());
    store.set("Heifers", await getHeifersDatas());
    store.set("Calves", await getCalvesDatas());
    store.set("Bulls", await getBullsDatas());
}

async function refreshDatas() {
    await setAllLocalDatas();
    const pageName = path.basename(mainWindow.webContents.getURL());
    const allDatas = {
        settingsDatas: store.get("settings"),
    }
    if (pageName === "cows.html") {
        allDatas.animalDatas = store.get("Cows");
    }
    else if (pageName === "heifers.html") {
        allDatas.animalDatas = store.get("Heifers");
    }
    else if (pageName === "calves.html") {
        allDatas.animalDatas = store.get("Calves");
    }
    else if (pageName === "bulls.html") {
        allDatas.animalDatas = store.get("Bulls");
    }
    else if (pageName === "animals.html") {
        allDatas.animalDatas = store.get("Animals");
    }

    return allDatas;
}

function formatDateTR(value) {
    if (!value) return value;
    const date = new Date(value);
    if (isNaN(date)) return value;
    return new Intl.DateTimeFormat("tr-TR").format(date); 
}

/*
2-) Silinen hayvanlar için trash sayfası yapılacak.
3-) Mouse'dan geri tuşuna basıldığında veya alt + sol ok tuşuna basıldığında openMenu() fonksyionu çalıştırılacak.

* Tabloları Excel Dosyasına Çevirme Fonksiyonu Eklendi *
*/