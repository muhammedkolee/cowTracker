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

            openAddAnimalWindow: (type: string) => void;

            openAnimalDetailWindow: (animalId: number) => void;

            openUpdateAnimalWindow: (animalId: number) => void;

            openAddVaccineWindow: () => void;

            closeWindow: () => void;

            onRefreshData: (callback: () => void) => () => void;

            getCounts: () => Promise<any[]>;

            getUpcomingEvents: () => Promise<any[]>;

            getActivityLogs: () => Promise<any[]>;

            // vite-env.d.ts
        };

        updateAPI: {
            getState: () => Promise<{
                status: "none" | "checking" | "available" | "downloading" | "finished" | "error";
                version?: string;
                progress?: number;
                releaseNotes?: string;
                message?: string;
            }>;

            checkNow: () => Promise<boolean>;

            onStateChanged: (callback: (state: {
                status: "none" | "checking" | "available" | "downloading" | "finished" | "error";
                version?: string;
                progress?: number;
                releaseNotes?: string;
                message?: string;
            }) => void) => () => void;

            startDownload: () => Promise<boolean>;

            quitAndInstall: () => Promise<void>;
        };

        addAnimalAPI: {
            getMothersEarringNo: () => Promise<any>;
            getBullsName: () => Promise<any>;
            receiveAnimalType: (callback: (type: string) => void) => () => void;

            addAnimal: (animalData: any) => Promise<boolean>;
        };

        animalDetailAPI: {
            receiveData: (
                callback: (payload: {
                    animal: any;
                    vaccines: any[];
                    calves: any[];
                }) => void,
            ) => () => void;
        };

        updateAnimalAPI: {
            receiveData: (callback: (data: {animal: any, datasForType: any}) => void) => () => void;

            updateAnimal: (data: any) => Promise<boolean>;
        };

        vaccineAPI: {
            getAnimalsData: (
                callback: (data: AnimalData[], names: string[]) => void,
            ) => () => void;

            addVaccine: (data: any) => Promise<boolean>;

            deleteVaccine: (vaccineId: number) => Promise<boolean>;
        };

        deathAnimalsAPI: {
            getDeletedAnimals: () => Promise<any[]>;

            restoreAnimal: (id: number) => Promise<boolean>;

            permanentDelete: (payload: { id: number; type: string }) => Promise<boolean>;
        };

        settingsAPI: {
            getSettingsData: () => Promise<SettingsData>;

			saveSettings: (data: SettingsData) => Promise<boolean>;
        };

        authAPI: {
            login: (payload: { email: string; password: string }) => Promise<{ success: boolean }>;

            signup: (payload: {
                fullName: string;
                email: string;
                password: string;
            }) => Promise<{ success: boolean; requiresEmailConfirmation: boolean }>;

            getAuth: () => Promise<boolean>;

            logout: () => Promise<boolean>;
        };
        animalServiceAPI: {
			removeAnimal: (trashData: any) => Promise<boolean>;

			gaveBirth: (data: any) => Promise<boolean>;

			applyInsemination: (data: any) => Promise<boolean>;
		};
    }
}

declare const __APP_VERSION__: string;
