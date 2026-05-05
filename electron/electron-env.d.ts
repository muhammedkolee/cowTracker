/// <reference types="vite-plugin-electron/electron-env" />

import { SettingsData } from "../shared/interfaces";

declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * The built directory structure
         *
         * ```tree
         * ├─┬─┬ dist
         * │ │ └── index.html
         * │ │
         * │ ├─┬ dist-electron
         * │ │ ├── main.js
         * │ │ └── preload.js
         * │
         * ```
         */
        APP_ROOT: string;
        /** /dist/ or /public/ */
        VITE_PUBLIC: string;
    }
}

// Used in Renderer process, expose in `preload.ts`
// interface Window {
//   ipcRenderer: import('electron').IpcRenderer
// }

interface Window {
    ipcRenderer: import("electron").IpcRenderer,
    addAnimalAPI: {
        receiveAnimalType: (callback: (type: string) => void) => void;
        getMothersEarringNo: () => Promise<any[]>;
        getBullsName: () => Promise<any[]>;
    },
    updateAnimalAPI: {
        receiveAnimalType: (callback: (type: string) => void) => void;
        getMothersEarringNo: () => Promise<any[]>;
        getBullsName: () => Promise<any[]>;
        receiveData: (callback: (data: any) => void) => void;
        updateAnimal: (animalData: any) => Promise<boolean>;
    },
    settingsAPI: {
        getSettingsData: () => SettingsData;
    }
}
