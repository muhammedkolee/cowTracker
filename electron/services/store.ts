import Store from 'electron-store';
import { SettingsData } from '../../shared/interfaces';

export const settingsStore = new Store<SettingsData>({
    name: "settings",
    defaults: {
    gestationDays: 280,
    dryOffDays: 220,
    calfWeaningDays: 30,
    calfToAdultDays: 365,
    email: ""
    }
});

export const authSessionStore = new Store({ name: "auth-session" });