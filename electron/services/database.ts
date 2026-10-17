// This file exist for database operations.
import { createClient } from "@supabase/supabase-js";
import { authSessionStore, settingsStore } from "./store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Supabase URL veya Key alınamadı. Lütfen .env dosyasını ve ön ekleri kontrol et.",
    );
}

const supabaseAuthAdapter = {
    getItem: (key: string): string | null =>
        authSessionStore.get(key) as string | null,
    setItem: (key: string, value: string) => authSessionStore.set(key, value),
    removeItem: (key: string) => authSessionStore.delete(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: supabaseAuthAdapter,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
});

// async function getUser() {
//     const {data: { user } } = await supabase.auth.getUser();
//     return user;
// }

// const user = getUser();

export const authService = {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;
        return { success: true, user: data.user };
    },

    async signup(fullname: string, mail: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email: mail,
            password: password,
            options: { data: { display_name: fullname } },
        });
        if (error) throw error;
        return {
            success: true,
            requiresEmailConfirmation: !data.session,
        };
    },

    async logout() {
        const { error } = await supabase.auth.signOut();

        if (error) return false;
        return true;
    },

    async getAuth() {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        return !error && !!user;
    },

    async getEmail() {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.user.email;
    },
};

export const databaseService = {
    async getCows() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Cows")
            .select(
                `
			*,
			Animals!inner (
				Breed,
				Note,
                IsDeleted
				)
			`,
            )
            .eq("Animals.IsDeleted", false)
            .eq("user_id", user?.id)
            .order("InseminationDate", { ascending: true });

        if (error) throw error;
        return data;
    },

    async getCalves() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Calves")
            .select(
                `
			Id,
			EarringNo,
			Name,
			BirthDate,
			Gender,
			user_id,
            Animals!inner (
                MotherEarringNo,
                MotherName,
                Breed,
                IsDeleted,
                Note
            )
			`,
            )
            .eq("Animals.IsDeleted", false)
            .eq("user_id", user?.id)
            .order("BirthDate", { ascending: false });

        if (error) throw error;
        return data;
    },

    async getAnimals() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Animals")
            .select(
                `
			*
			`,
            )
            .eq("IsDeleted", false)
            .eq("user_id", user?.id)
            .order("Type", { ascending: false });

        if (error) throw error;

        return data;
    },

    async getHeifers() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Heifers")
            .select(
                `
			*,
            Animals!inner(
                Breed,
                IsDeleted,
                Note
            )
			`,
            )
            .eq("Animals.IsDeleted", false)
            .eq("user_id", user?.id)
            .order("LastBirthDate", { ascending: true });

        if (error) throw error;
        return data;
    },

    async getBulls() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Animals")
            .select(
                `
			*
			`,
            )
            .eq("Type", "bull")
            .eq("IsDeleted", false)
            .eq("user_id", user?.id)
            .order("BirthDate", { ascending: false });

        if (error) throw error;
        return data;
    },

    async getVaccines() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Vaccines")
            .select(
                `
			*,
            Animals!inner (
                EarringNo,
                Name,
                IsDeleted
            )
			`,
            )
            .eq("Animals.IsDeleted", false)
            .eq("user_id", user?.id)
            .order("VaccineDate", { ascending: true });

        if (error) throw error;
        return data;
    },

    async getVaccinesName() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Vaccines")
            .select(
                `
			VaccineName
			`,
            )
            .eq("user_id", user?.id);

        if (error) throw error;

        const allNames = data.map((item) => item.VaccineName);

        const uniqueNames = [...new Set(allNames)];
        return uniqueNames.sort();
    },

    // For Add Animal API
    async getMothersEarringNo(): Promise<any[]> {
        const {data: { user } } = await supabase.auth.getUser();
        const { data: aliveCowData, error: cowError } = await supabase
            .from("Animals")
            .select("EarringNo, Name")
            .in("Type", ["cow", "heifer"])
            .eq("user_id", user?.id);

        if (cowError) {
            throw cowError;
        }

        const { data: deathCowData, error: deathCowError } = await supabase
            .from("DeletedAnimals")
            .select("EarringNo, Name")
            .in("Type", ["cow", "heifer"])
            .eq("user_id", user?.id);

        if (deathCowError) {
            throw deathCowError;
        }

        const alive = aliveCowData ?? [];
        const dead = deathCowData ?? [];

        return [
            ...new Map(
                [...alive, ...dead].map((item) => [item.EarringNo, item]),
            ).values(),
        ];
    },

    async getBullsName(): Promise<any[]> {
        const {data: { user } } = await supabase.auth.getUser();
        const { data: aliveBullData, error: aliveBullError } = await supabase
            .from("Animals")
            .select("Name")
            .eq("Type", "bull")
            .eq("user_id", user?.id);

        if (aliveBullError) {
            throw aliveBullError;
        }

        const { data: deathBullData, error: deathBullError } = await supabase
            .from("DeletedAnimals")
            .select("Name")
            .eq("Type", "bull")
            .eq("user_id", user?.id);

        if (deathBullError) {
            throw deathBullError;
        }

        const alive = aliveBullData ?? [];
        const dead = deathBullData ?? [];

        return [
            ...new Map(
                [...alive, ...dead].map((item) => [item.Name, item]),
            ).values(),
        ];
    },

    async getCounts() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Animals")
            .select("Type")
            .eq("IsDeleted", false)
            .eq("user_id", user?.id);

        if (error) throw error;

        return (data ?? []).reduce((acc: Record<string, number>, row) => {
            acc[row.Type] = (acc[row.Type] || 0) + 1;
            return acc;
        }, { cow: 0, heifer: 0, bull: 0, calf: 0 });
    },

    async getUpcomingEvents() {
        const {data: { user } } = await supabase.auth.getUser();
        const today = new Date();
        const gestationDays = settingsStore.get("gestationDays");

        const { data: heifers, error: heifersError } = await supabase
            .from("Heifers")
            .select("EarringNo, Name, LastBirthDate, Animals!inner(IsDeleted)")
            .eq("Animals.IsDeleted", false)
            .eq("user_id", user?.id)
            .not("LastBirthDate", "is", null);

        if (heifersError) throw heifersError;

        const emptyHeifers = (heifers ?? [])
            .map((heifer) => ({
                name: heifer.Name,
                earringNo: heifer.EarringNo,
                days: Math.ceil(
                    (today.getTime() - new Date(heifer.LastBirthDate).getTime()) /
                        86400000,
                ),
            }))
            .filter((heifer) => heifer.days > 60);

        const { data: cows, error: cowsError } = await supabase
            .from("Cows")
            .select("EarringNo, Name, InseminationDate, LastBirthDate, Animals!inner(IsDeleted)")
            .eq("Animals.IsDeleted", false)
            .eq("user_id", user?.id);

        if (cowsError) throw cowsError;

        const emptyCows = (cows ?? [])
            .filter((cow) => cow.LastBirthDate && !cow.InseminationDate)
            .map((cow) => ({
                name: cow.Name,
                earringNo: cow.EarringNo,
                days: Math.ceil(
                    (today.getTime() - new Date(cow.LastBirthDate).getTime()) /
                        86400000,
                ),
            }))
            .filter((cow) => cow.days > 60);

        const upcomingCows = (cows ?? [])
            .filter((cow) => cow.InseminationDate)
            .map((cow) => {
                const birth = new Date(cow.InseminationDate);
                birth.setDate(birth.getDate() + gestationDays);
                return {
                    name: cow.Name,
                    earringNo: cow.EarringNo,
                    days: Math.ceil(
                        (birth.getTime() - today.getTime()) / 86400000,
                    ),
                };
            })
            .filter((cow) => cow.days <= 20);

        return { heifers: emptyHeifers, cows: upcomingCows, emptyCows };
    },

    async getActivityLogs() {
        const {data: { user } } = await supabase.auth.getUser();
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

        const { error: promotionError } = await supabase.rpc(
            "promote_mature_calves",
            { p_min_age_days: settingsStore.get("calfToAdultDays") },
        );
        if (promotionError) throw promotionError;

        const { data: logs, error: logsError } = await supabase
            .from("ActivityLogs")
            .select("AnimalId, EarringNo, AnimalName, OldType, NewType, ChangedAt")
            .eq("user_id", user?.id)
            .gte("ChangedAt", sevenDaysAgo)
            .order("ChangedAt", { ascending: false });

        if (logsError) throw logsError;

        return (logs ?? []).map((log) => ({
            animalId: log.AnimalId,
            earringNo: log.EarringNo,
            animalName: log.AnimalName,
            oldType: log.OldType,
            newType: log.NewType,
            changedAt: log.ChangedAt,
        }));
    }
};

export const addDataServices = {
    async addAnimal(datas: any): Promise<boolean> {
        const {data: { user } } = await supabase.auth.getUser();

        datas.animalDatas.user_id = user?.id;
        const { data, error } = await supabase
            .from("Animals")
            .insert(datas.animalDatas)
            .select();

        if (error) {
            return false;
        }

        if (datas.animalDatas.Type === "cow") {
            datas.cowDatas.Id = data[0].Id;
            datas.cowDatas.user_id = user?.id;

            const { error: cowsError } = await supabase
                .from("Cows")
                .insert(datas.cowDatas);

            if (cowsError) {
                await supabase
                    .from("Animals")
                    .delete()
                    .eq("Id", datas.cowDatas.Id);

                return false;
            }
        } else if (datas.animalDatas.Type == "heifer") {
            datas.heiferDatas.Id = data[0].Id;
            datas.heiferDatas.user_id = user?.id;

            const { error: heiferError } = await supabase
                .from("Heifers")
                .insert(datas.heiferDatas);

            if (heiferError) {
                await supabase
                    .from("Animals")
                    .delete()
                    .eq("Id", datas.heiferDatas.Id);

                return false;
            }
        } else if (datas.animalDatas.Type == "calf") {
            datas.calfDatas.Id = data[0].Id;
            datas.calfDatas.user_id = user?.id;

            const { error: calfError } = await supabase
                .from("Calves")
                .insert(datas.calfDatas);

            if (calfError) {
                await supabase
                    .from("Animals")
                    .delete()
                    .eq("user_id", user?.id)
                    .eq("Id", datas.calfDatas.Id);

                return false;
            }
        }
        return true;
    },
};

export const animalDetailServices = {
    async getAnimalDetail(animalId: number) {
        const {data: { user } } = await supabase.auth.getUser();
        const { data: animalData, error: animalError } = await supabase
            .from("Animals")
            .select("*")
            .eq("Id", animalId)
            .eq("user_id", user?.id)
            .single();

        if (animalError) throw animalError;

        if (animalData.Type === 'cow') {
            const { data: cowData, error: cowError} = await supabase.from("Cows").select("InseminationDate, LastBirthDate, CheckedDate").eq("user_id", user?.id).eq("Id", animalId).single();
            if (cowError) return [];
            return { ...animalData, ...cowData }
        }
        else if (animalData.Type === 'heifer') {
            const { data: heiferData, error: heiferError} = await supabase.from("Heifers").select("LastBirthDate").eq("user_id", user?.id).eq("Id", animalId).single();

            if (heiferError) return [];

            return { ...animalData, ...heiferData }
        }
        else if (animalData.Type === 'calf') {
            const { data: calfData, error: calfError} = await supabase.from("Calves").select("Gender").eq("user_id", user?.id).eq("Id", animalId).single();

            if (calfError) return [];

            return { ...animalData, ...calfData }
        }

        return animalData;
    },

    async getAnimalVaccines(animalId: number) {
        const {data: { user } } = await supabase.auth.getUser();
        const { data: vaccinesData, error: vaccinesError } = await supabase
            .from("Vaccines")
            .select("VaccineName, VaccineDate")
            .eq("user_id", user?.id)
            .eq("AnimalId", animalId);

        if (vaccinesError) return [];
        return vaccinesData;
    },

    async getAnimalCalves(motherEarringNo?: string) {
        const {data: { user } } = await supabase.auth.getUser();
        if (motherEarringNo) {
            const { data: calvesData, error: calvesError } = await supabase
                .from("Animals")
                .select("EarringNo, Name, BirthDate")
                .eq("MotherEarringNo", motherEarringNo)
                .eq("user_id", user?.id);

            if (calvesError) return [];

            const { data: deathCalvesData, error: deathCalvesError } =
                await supabase
                    .from("DeletedAnimals")
                    .select("EarringNo, Name, BirthDate, DeathDate, Reason")
                    .eq("MotherEarringNo", motherEarringNo)
                    .eq("user_id", user?.id);

            if (deathCalvesError) throw deathCalvesError;

            const allCalvesData = calvesData.concat(deathCalvesData || []);
            return allCalvesData;
        }
        return [];
    },
};

export const updateAnimalService = {
    async getAnimalDatas(animalId: number) {
        const {data: { user } } = await supabase.auth.getUser();
        const { data: animalData, error: animalError } = await supabase
            .from("Animals")
            .select("*")
            .eq("Id", animalId)
            .eq("user_id", user?.id)
            .single();

        if (animalError) throw animalError;

        return animalData;
    },

    async getDataAsType(animalId: number, animalType: string) {
        const {data: { user } } = await supabase.auth.getUser();
        if (animalType == "cow") {
            const { data, error } = await supabase
                .from("Cows")
                .select("*")
                .eq("Id", animalId)
                .eq("user_id", user?.id)
                .single();

            if (error) throw error;

            return data;
        } else if (animalType == "heifer") {
            const { data, error } = await supabase
                .from("Heifers")
                .select("*")
                .eq("Id", animalId)
                .eq("user_id", user?.id)
                .single();

            if (error) throw error;

            return data;
        } else if (animalType == "calf") {
            const { data, error } = await supabase
                .from("Calves")
                .select("*")
                .eq("Id", animalId)
                .eq("user_id", user?.id)
                .single();

            if (error) throw error;

            return data;
        }
    },

    async updateAnimal(animalData: any) {
        const {data: { user } } = await supabase.auth.getUser();
        try {
            const { animalDatas, cowDatas, heiferDatas, calfDatas } =
                animalData;

            const { error: animalError } = await supabase
                .from("Animals")
                .update({
                    EarringNo: animalDatas.EarringNo,
                    Name: animalDatas.Name,
                    BirthDate: animalDatas.BirthDate,
                    MotherEarringNo: animalDatas.MotherEarringNo,
                    MotherName: animalDatas.MotherName,
                    Breed: animalDatas.Breed,
                    Note: animalDatas.Note,
                })
                .eq("user_id", user?.id)
                .eq("Id", animalDatas.Id)
                .select("Id")
                .single();

            if (animalError) throw animalError;

            if (animalDatas.Type === "cow" && cowDatas) {
                const { error: cowError } = await supabase
                    .from("Cows")
                    .update({
                        EarringNo: animalDatas.EarringNo,
                        Name: animalDatas.Name,
                        InseminationDate: cowDatas.InseminationDate,
                        BullName: cowDatas.BullName,
                        CheckedDate: cowDatas.CheckedDate,
                        LastBirthDate: cowDatas.LastBirthDate,
                    })
                    .eq("user_id", user?.id)
                    .eq("Id", cowDatas.Id)
                    .select("Id")
                    .single();

                if (cowError) throw cowError;
            } else if (animalDatas.Type === "heifer" && heiferDatas) {
                const { error: heiferError } = await supabase
                    .from("Heifers")
                    .update({
                        EarringNo: animalDatas.EarringNo,
                        Name: animalDatas.Name,
                        LastBirthDate: heiferDatas.LastBirthDate,
                    })
                    .eq("user_id", user?.id)
                    .eq("Id", heiferDatas.Id)
                    .select("Id")
                    .single();

                if (heiferError) throw heiferError;
            } else if (animalDatas.Type === "calf" && calfDatas) {
                const { error: calfError } = await supabase
                    .from("Calves")
                    .update({
                        EarringNo: animalDatas.EarringNo,
                        Name: animalDatas.Name,
                        BirthDate: animalDatas.BirthDate,
                        Gender: calfDatas.Gender,
                    })
                    .eq("user_id", user?.id)
                    .eq("Id", calfDatas.Id)
                    .select("Id")
                    .single();

                if (calfError) throw calfError;
            }

            return true;
        } catch (error) {
            console.error("Update animal error:", error);
            return false;
        }
    },
};

export const vaccineService = {
    async getAnimalsData() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Animals")
            .select("Id, EarringNo, Name, Type, MotherEarringNo, MotherName")
            .eq("IsDeleted", false)
            .eq("user_id", user?.id);

        if (error) throw error;

        return data;
    },

    async addVaccine(vaccineData: any) {
        const {data: { user } } = await supabase.auth.getUser();
        const { animalIds, vaccineName, vaccineDate } = vaccineData;

        const records = animalIds.map((animalId: number) => ({
            AnimalId: animalId,
            VaccineName: vaccineName,
            VaccineDate: new Date(vaccineDate),
            user_id: user?.id,
        }));

        const { error } = await supabase.from("Vaccines").insert(records);

        if (error) {
            return false;
        }
        return true;
    },

    async deleteVaccine(vaccineId: number) {
        const {data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("Vaccines")
            .delete()
            .eq("user_id", user?.id)
            .eq("Id", vaccineId);

        if (error) return false;
        return true;
    },
};

export const deletedAnimalsService = {
    async getDeletedAnimals() {
        const {data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("Animals")
            .select("*")
            .eq("IsDeleted", true)
            .eq("user_id", user?.id)
            .order("DeathDate", { ascending: false });

        if (error) throw error;

        return data;
    },
};

export const AnimalService = {
    async removeAnimal(Id: number, DeathDate: Date, Reason: string) {
        const {data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("Animals")
            .update({ IsDeleted: true, DeathDate: DeathDate, Reason: Reason })
            .eq("user_id", user?.id)
            .eq("Id", Id);
        if (error) return false;
        return true;
    },

    async deleteAnimal(id: number) {
        const {data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from("Animals")
                            .delete()
                            .eq("user_id", user?.id)
                            .eq("Id", id);

        if (error) {
            return false;
        }
        return true;
    },

    async revertAnimal(id: number) {
        const {data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("Animals")
            .update({ IsDeleted: false })
            .eq("user_id", user?.id)
            .eq("Id", id);

        if (error) return false;
        return true;
    },

    async applyInsemination(data: any) {
        const { data: result, error } = await supabase.rpc(
            "apply_insemination",
            {
                p_animal_id: data.Id,
                p_insemination_date: data.InseminationDate,
                p_bull_name: data.BullName || null,
                p_checked_date: data.CheckedDate || null,
                p_last_birth_date: data.LastBirthDate || null,
            },
        );
        if (error) throw error;
        return result === true;
    },

    async gaveBirth(allData: any) {
        const { data: calfId, error } = await supabase.rpc("record_birth", {
            p_mother_id: allData.MotherId,
            p_birth_date: allData.CalfDatas.BirthDate,
            p_calf_gender: allData.CalfDatas.Gender,
            p_calf_earring_no: allData.CalfDatas.EarringNo || null,
            p_calf_name: allData.CalfDatas.Name || null,
        });
        if (error) throw error;
        return typeof calfId === "number";
    },
};
