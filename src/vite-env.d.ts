/// <reference types="vite/client" />

import { SettingsData } from "../shared/interfaces";

interface Window {
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

		// vite-env.d.ts
		
	},

	addAnimalAPI: {
        getMothersEarringNo(): unknown;
        getBullsName(): unknown;
		receiveAnimalType: () => string;

		receiveMothersEarringNo: () => any[];
		
		receiveBullsName: () => any[];

		addAnimal: (animalData) => any[];
		
		// receiveAnimalType: () => Promise<any[]>;
	},

	animalDetailAPI: {
		receiveData: () => any[];
	},

	updateAnimalAPI: {
		receiveData: () => any[];

		updateAnimal: () => any[];
	},

	vaccineAPI: {
		getAnimalsData: () => any[];

		addVaccine: () => any[];

		deleteVaccine: (vaccineId: number) => any;
	},

	deathAnimalsAPI: {
		getDeletedAnimals: () => any[];

		restoreAnimal: (id: number) => any;

		permanentDelete: (payload: {id: number, type: string}) => any; 
	},

	settingsAPI: {
		getSettingsData: () => SettingsData;
	},

	authAPI: {
		login: (payload: { mail: string, password: string }) => boolean,

		signup: (payload: { fullName: string, mail: string, password: string }) => boolean,

		getAuth: () => boolean;

		logout: () => void;
	}
 }

declare const __APP_VERSION__: string;