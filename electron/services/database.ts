// This file exist for database operations.
import { createClient } from "@supabase/supabase-js";
import { authSessionStore, settingsStore } from "./store";

// Rehbere göre electron-vite'da modern yol budur:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

var earringNoForCalves = "t";
var typeForUpdate = "";

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
        if (error) return false;
        return data;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();

        if (error) return false;
        return true;
    },

    async getAuth() {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return !!session;
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
                Name
            )
			`,
            )
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
            console.log(cowError);
        }

        const { data: deathCowData, error: deathCowError } = await supabase
            .from("DeletedAnimals")
            .select("EarringNo, Name")
            .in("Type", ["cow", "heifer"])
            .eq("user_id", user?.id);

        if (deathCowError) {
            console.log(deathCowError);
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
            console.log(
                "Dana isimleri çekilirken bir hata oluştu: ",
                aliveBullError,
            );
        }

        const { data: deathBullData, error: deathBullError } = await supabase
            .from("DeletedAnimals")
            .select("Name")
            .eq("Type", "bull")
            .eq("user_id", user?.id);

        if (deathBullError) {
            console.log(
                "Silinmiş dana isimleri çekilirken bir hata oluştu: ",
                deathBullError,
            );
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
        const { data } = await supabase.from("Animals").select("Type").eq("user_id", user?.id);

        const counts = data?.reduce((acc: Record<string, number>, row) => {
            acc[row.Type] = (acc[row.Type] || 0) + 1;
            return acc;
        }, {});

        return counts
    },

    async getUpcomingEvents() {
    const today = new Date();

    const { data: heifers } = await supabase
        .from("Heifers")
        .select("EarringNo, Name, LastBirthDate")
        .not("LastBirthDate", "is", null);

    const emptyHeifers = (heifers ?? [])
        .map((h: any) => ({
            name: h.Name,
            earringNo: h.EarringNo,
            daysLeft: Math.ceil((today.getTime() - new Date(h.LastBirthDate).getTime()) / 86400000),
        }))
        .filter((h: any) => h.daysLeft > 60);

    const { data: cows } = await supabase
        .from("Cows")
        .select("EarringNo, Name, InseminationDate, LastBirthDate");

    const emptyCows = (cows ?? [])
        .filter((c: any) => c.LastBirthDate && !c.InseminationDate)
        .map((c: any) => ({
            name: c.Name,
            earringNo: c.EarringNo,
            daysLeft: Math.ceil((today.getTime() - new Date(c.LastBirthDate).getTime()) / 86400000),
        }))
        .filter((c: any) => c.daysLeft > 60);

    const upcomingCows = (cows ?? [])
        .filter((c: any) => c.InseminationDate)
        .map((c: any) => {
            const birth = new Date(c.InseminationDate);
            birth.setDate(birth.getDate() + 280);
            const daysLeft = Math.ceil((birth.getTime() - today.getTime()) / 86400000);
            return { name: c.Name, earringNo: c.EarringNo, daysLeft };
        })
        .filter((c: any) => c.daysLeft <= 20);

    return { heifers: emptyHeifers, cows: upcomingCows, emptyCows };
    },

    async getActivityLogs() {
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000).toISOString();

        // 365+ günlük buzağıları bul
        const { data: calves } = await supabase
            .from("Calves")
            .select("*, Animals(*)");

        const oldCalves = (calves ?? []).filter((c: any) => {
            const age = Math.ceil((today.getTime() - new Date(c.BirthDate).getTime()) / 86400000);
            return age >= settingsStore.get("calfToAdultDays");
    });

    // Her biri için statü güncelle
    for (const calf of oldCalves) {
        const newType = calf.Gender === true ? "heifer" : "bull";

        // Animals tablosunu güncelle
        await supabase.from("Animals").update({ Type: newType }).eq("Id", calf.AnimalId);

        // Calves tablosundan sil
        await supabase.from("Calves").delete().eq("Id", calf.Id);

        if (newType === "heifer") {
            // Heifers tablosuna ekle
            await supabase.from("Heifers").insert({
                AnimalId: calf.AnimalId,
                EarringNo: calf.Animals?.EarringNo,
                Name: calf.Animals?.Name,
                LastBirthDate: null,
            });
        }

        // ActivityLogs tablosuna kaydet
        await supabase.from("ActivityLogs").insert({
            AnimalId: calf.AnimalId,
            EarringNo: calf.Animals?.EarringNo,
            AnimalName: calf.Animals?.Name,
            OldType: "calf",
            NewType: newType,
            ChangedAt: today.toISOString(),
        });
    }

    // Son 7 günün loglarını getir
    const { data: logs } = await supabase
        .from("ActivityLogs")
        .select("*")
        .gte("ChangedAt", sevenDaysAgo)
        .order("ChangedAt", { ascending: false });

    return logs ?? [];
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
            console.log(error);
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

        if (animalError) console.log(animalError);

        earringNoForCalves = animalData.EarringNo;

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

    async getAnimalCalves() {
        const {data: { user } } = await supabase.auth.getUser();
        if (earringNoForCalves) {
            const { data: calvesData, error: calvesError } = await supabase
                .from("Animals")
                .select("EarringNo, Name, BirthDate")
                .eq("MotherEarringNo", earringNoForCalves)
                .eq("user_id", user?.id);

            if (calvesError) return [];

            const { data: deathCalvesData, error: deathCalvesError } =
                await supabase
                    .from("DeletedAnimals")
                    .select("EarringNo, Name, BirthDate, DeathDate, Reason")
                    .eq("MotherEarringNo", earringNoForCalves)
                    .eq("user_id", user?.id);

            if (deathCalvesError) console.log(deathCalvesError);

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

        if (animalError) console.log(animalError);

        earringNoForCalves = animalData.EarringNo;

        typeForUpdate = animalData.Type;

        return animalData;
    },

    async getDataAsType(animalId: number) {
        const {data: { user } } = await supabase.auth.getUser();
        if (typeForUpdate == "cow") {
            const { data, error } = await supabase
                .from("Cows")
                .select("*")
                .eq("Id", animalId)
                .eq("user_id", user?.id)
                .single();

            if (error) console.log(error);

            return data;
        } else if (typeForUpdate == "heifer") {
            const { data, error } = await supabase
                .from("Heifers")
                .select("*")
                .eq("Id", animalId)
                .eq("user_id", user?.id)
                .single();

            if (error) console.log(error);

            return data;
        } else if (typeForUpdate == "calf") {
            const { data, error } = await supabase
                .from("Calves")
                .select("*")
                .eq("Id", animalId)
                .eq("user_id", user?.id)
                .single();

            if (error) console.log(error);

            return data;
        }
    },

    async updateAnimal(animalData: any) {
        const {data: { user } } = await supabase.auth.getUser();
        try {
            const { animalDatas, cowDatas, heiferDatas, calfDatas } =
                animalData;

            // Update Animals table
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
                .eq("Id", animalDatas.Id);

            if (animalError) throw animalError;

            // Update type-specific tables
            if (animalDatas.Type === "cow" && cowDatas) {
                const { error: cowError } = await supabase
                    .from("Cows")
                    .update({
                        InseminationDate: cowDatas.InseminationDate,
                        BullName: cowDatas.BullName,
                        CheckedDate: cowDatas.CheckedDate,
                    })
                    .eq("user_id", user?.id)
                    .eq("Id", cowDatas.Id);

                if (cowError) throw cowError;
            } else if (animalDatas.Type === "heifer" && heiferDatas) {
                const { error: heiferError } = await supabase
                    .from("Heifers")
                    .update({
                        LastBirthDate: heiferDatas.LastBirthDate,
                    })
                    .eq("user_id", user?.id)
                    .eq("Id", heiferDatas.Id);

                if (heiferError) throw heiferError;
            } else if (animalDatas.Type === "calf" && calfDatas) {
                const { error: calfError } = await supabase
                    .from("Calves")
                    .update({
                        Gender: calfDatas.Gender,
                    })
                    .eq("user_id", user?.id)
                    .eq("Id", calfDatas.Id);

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
            .select("Id, EarringNo, Name, MotherEarringNo, MotherName")
            .eq("user_id", user?.id);

        if (error) console.log(error);

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

        if (error) console.log(error);

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

    async deleteAnimal(id: number, type: string) {
        const {data: { user } } = await supabase.auth.getUser();
        if (type == "cow") {
            const { error } = await supabase.from("Cows")
                            .delete()
                            .eq("user_id", user?.id)
                            .eq("Id", id);
            if (error) return false;
        } else if (type == "calf") {
            const { error } = await supabase
                .from("Calves")
                .delete()
                .eq("user_id", user?.id)
                .eq("Id", id);
            if (error) return false;
        } else if (type == "heifer") {
            const { error } = await supabase
                .from("Heifers")
                .delete()
                .eq("user_id", user?.id)
                .eq("Id", id);
            if (error) return false;
        }

        const { error } = await supabase.from("Animals")
                            .delete()
                            .eq("user_id", user?.id)
                            .eq("Id", id);

        if (error) {
            console.log(error);
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
        const {data: { user } } = await supabase.auth.getUser();
        const { data: animalData, error: animalError } = await supabase
            .from("Animals")
            .update({ Type: "cow" })
            .eq("Id", data.Id)
            .eq("user_id", user?.id)
            .select()
            .single();

        if (animalError) console.log(animalError);

        const { error: heiferError } = await supabase
            .from("Cows")
            .insert({
                EarringNo: animalData.EarringNo,
                Name: animalData.Name,
                Id: animalData.Id,
                InseminationDate: data.InseminationDate,
                BullName: data.BullName,
                CheckedDate: data.CheckedDate,
                LastBirthDate: data.LastBirthDate,
                user_id: user?.id
            });
        if (heiferError) return false;

        const { error } = await supabase
            .from("Heifers")
            .delete()
            .eq("user_id", user?.id)
            .eq("Id", data.Id);
        if (error) return false;
        return true;
    },

    async gaveBirth(allData: any) {
        const {data: { user } } = await supabase.auth.getUser();
        const { data: animalData, error: animalError } = await supabase
            .from("Animals")
            .update({ Type: "heifer" })
            .eq("user_id", user?.id)
            .eq("Id", allData.MotherId)
            .select()
            .single();
        if (animalError) console.log(animalError);

        const { error: changedError } = await supabase
            .from("Heifers")
            .insert({
                Id: animalData.Id,
                EarringNo: animalData.EarringNo,
                Name: animalData.Name,
                LastBirthDate: allData.CalfDatas.BirthDate,
                user_id: user?.id
            });
        if (changedError) {
            console.log(changedError);
            return false;
        }

        const { error } = await supabase
            .from("Cows")
            .delete()
            .eq("user_id", user?.id)
            .eq("Id", allData.MotherId);
        if (error) {
            console.log(error);
            return false;
        }

        const { data: calfData, error: calfError } = await supabase
            .from("Animals")
            .insert({
                BirthDate: allData.CalfDatas.BirthDate,
                MotherEarringNo: animalData.EarringNo,
                MotherName: animalData.Name,
                Type: "calf",
                Breed: animalData.Breed,
                IsDeleted: false,
                EarringNo: allData.CalfDatas.EarringNo,
                Name: allData.CalfDatas.Name,
                user_id: user?.id
            })
            .select()
            .single();
        if (calfError) {
            console.log(calfError);
            return false;
        }

        const { error: calvesError } = await supabase
            .from("Calves")
            .insert({
                EarringNo: allData.CalfDatas.EarringNo,
                Name: allData.CalfDatas.Name,
                BirthDate: allData.CalfDatas.BirthDate,
                Gender: allData.CalfDatas.Gender,
                Id: calfData.Id,
                user_id: user?.id
            });
        if (calvesError) {
            console.log(calvesError);
            return false;
        }
        return true;
    },
};
