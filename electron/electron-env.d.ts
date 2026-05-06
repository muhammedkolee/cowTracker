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
    api: {
		getCows: () => Promise<any[]>;
		getCalves: () => Promise<any[]>;
		getAnimals: () => Promise<any[]>;
		getHeifers: () => Promise<any[]>;
		getBulls: () => Promise<any[]>;
		getVaccines: () => Promise<any[]>;		
		getVaccinesName: () => Promise<any[]>;
		openAddAnimalWindow: (type: string) => Promise<any[]>;
		openAnimalDetailWindow: (animalId: number) => Promise<any[]>;
		openUpdateAnimalWindow: (animalId: number) => Promise<any[]>;
		openAddVaccineWindow: () => Promise<any[]>;
		closeWindow: () => Promise<any[]>;
		onRefreshData: () => Promise<any[]>;
		getCounts: () => Promise<any[]>;
		getUpcomingEvents: () => Promise<any[]>;
		getActivityLogs: () => Promise<any[]>;
    },
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
    },
    authAPI: {
		login: (payload: { mail: string, password: string }) => boolean,
		signup: (payload: { fullName: string, mail: string, password: string }) => boolean,
		getAuth: () => boolean;
		logout: () => void;
    },
	settingsAPI: {
		getSettingsData: () => SettingsData;
	},
	deathAnimalsAPI: {
		getDeletedAnimals: () => any[];
		restoreAnimal: (id: number) => any;
		permanentDelete: (payload: {id: number, type: string}) => any; 
	},
	vaccineAPI: {
		getAnimalsData: () => any[];
		addVaccine: () => any[];
		deleteVaccine: (vaccineId: number) => any;
	},

}
