/// <reference types="vite/client" />

import { SettingsData } from "../shared/interfaces";

declare global {
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

            onRefreshData: (callback: (data) => void) => void;

            getCounts: () => Promise<any[]>;

            getUpcomingEvents: () => Promise<any[]>;

            getActivityLogs: () => Promise<any[]>;

            // vite-env.d.ts
        };

        addAnimalAPI: {
            getMothersEarringNo: () => Promise<any>;
            getBullsName: () => Promise<any>;
            receiveAnimalType: (callback: (type: string) => void) => void;

            receiveMothersEarringNo: () => any[];

            receiveBullsName: () => any[];

            addAnimal: (animalData) => any[];

            // receiveAnimalType: () => Promise<any[]>;
        };

        animalDetailAPI: {
            receiveData: (
                callback: (payload: {
                    animal: any;
                    vaccines: any[];
                    calves: any[];
                }) => void,
            ) => any[];
        };

        updateAnimalAPI: {
            receiveData: (callback: (data: {animal: any, datasForType: any}) => void) => void;

            updateAnimal: (data: any) => any;
        };

        vaccineAPI: {
            getAnimalsData: (
                callback: (data: AnimalData[], names: string[]) => void,
            ) => void;

            addVaccine: (data: any) => void;

            deleteVaccine: (vaccineId: number) => any;
        };

        deathAnimalsAPI: {
            getDeletedAnimals: () => any[];

            restoreAnimal: (id: number) => any;

            permanentDelete: (payload: { id: number; type: string }) => any;
        };

        settingsAPI: {
            getSettingsData: () => SettingsData;

			saveSettings: (data: any) => void;
        };

        authAPI: {
            login: (payload: { email: string; password: string }) => boolean;

            signup: (payload: {
                fullName: string;
                email: string;
                password: string;
            }) => boolean;

            getAuth: () => boolean;

            logout: () => void;
        };
        animalServiceAPI: {
			removeAnimal: (trashData: any) => void;

			gaveBirth: (data) => void;

			applyInsemination: (data: any) => void;
		};
    }
}

declare const __APP_VERSION__: string;
