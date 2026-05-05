// This file exist for database operations.
import { createClient } from "@supabase/supabase-js";
import { authSessionStore } from "./store";

// Rehbere göre electron-vite'da modern yol budur:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

var earringNoForCalves = "t";
var typeForUpdate = "";

if (!supabaseUrl || !supabaseAnonKey) {
    // Eğer hala boş geliyorsa, ön eki MAIN_VITE_ olarak değiştirmeyi deneyeceğiz
    throw new Error(
        "Supabase URL veya Key alınamadı. Lütfen .env dosyasını ve ön ekleri kontrol et.",
    );
}

const supabaseAuthAdapter = {
    getItem: (key: string): string | null => authSessionStore.get(key) as string | null,
    setItem: (key: string, value: string) => authSessionStore.set(key, value),
    removeItem: (key: string) => authSessionStore.delete(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
            storage: supabaseAuthAdapter,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false
        }
});

export const authService = {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
        if (error) throw error;
        return { success: true, user: data.user };
    },

    async signup(fullname: string, mail: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email: mail, password: password, options: { data: {display_name: fullname } } });
        if (error) return false;
        return data;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();

        if (error) return false;
        return true;
    },

    async getAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        console.log(session);
        return !!session;
    },

    async getEmail() {
        const { data: { session } } = await supabase.auth.getSession();
        console.log(session);
        return session?.user.email;
    }
}

export const databaseService = {
    async getCows() {
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
            .order("InseminationDate", { ascending: true });

        if (error) throw error;
        return data;
    },

    async getCalves() {
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
            .order("BirthDate", { ascending: false });

        if (error) throw error;
        return data;
    },

    async getAnimals() {
        const { data, error } = await supabase
            .from("Animals")
            .select(
                `
			*
			`,
            )
            .eq("IsDeleted", false)
            .order("Type", { ascending: false });

        if (error) throw error;

        return data;
    },

    async getHeifers() {
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
            .order("LastBirthDate", { ascending: true });

        if (error) throw error;
        return data;
    },

    async getBulls() {
        const { data, error } = await supabase
            .from("Animals")
            .select(
                `
			*
			`,
            )
            .eq("Type", "bull")
            .eq("IsDeleted", false)
            .order("BirthDate", { ascending: false });

        if (error) throw error;
        return data;
    },

    async getVaccines() {
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
            .order("VaccineDate", { ascending: true });

        if (error) throw error;
        return data;
    },

    async getVaccinesName() {
        const { data, error } = await supabase.from("Vaccines").select(`
			VaccineName
			`);

        if (error) throw error;

        const allNames = data.map((item) => item.VaccineName);

        const uniqueNames = [...new Set(allNames)];
        return uniqueNames.sort();
    },

    // For Add Animal API
    async getMothersEarringNo(): Promise<any[]> {
        const { data: aliveCowData, error: cowError } = await supabase
            .from("Animals")
            .select("EarringNo, Name")
            .in("Type", ["cow", "heifer"]);

        if (cowError) {
            console.log(cowError);
        }

        const { data: deathCowData, error: deathCowError } = await supabase
            .from("DeletedAnimals")
            .select("EarringNo, Name")
            .in("Type", ["cow", "heifer"]);

        if (deathCowError) {
            console.log(deathCowError);
        }

        const alive = aliveCowData ?? [];
        const dead = deathCowData ?? [];

        console.log([
            ...new Map(
                [...alive, ...dead].map((item) => [item.EarringNo, item]),
            ).values(),
        ]);

        return [
            ...new Map(
                [...alive, ...dead].map((item) => [item.EarringNo, item]),
            ).values(),
        ];
    },

    async getBullsName(): Promise<any[]> {
        const { data: aliveBullData, error: aliveBullError } = await supabase
            .from("Animals")
            .select("Name")
            .eq("Type", "bull");

        if (aliveBullError) {
            console.log(
                "Dana isimleri çekilirken bir hata oluştu: ",
                aliveBullError,
            );
        }

        const { data: deathBullData, error: deathBullError } = await supabase
            .from("DeletedAnimals")
            .select("Name")
            .eq("Type", "bull");

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
};

export const addDataServices = {
    async addAnimal(datas: any[]): Promise<boolean> {
        // const { data: { user }, error: userError } = await supabase.auth.getUser();
        // datas.animalDatas.user_id = user.id;

        const { data, error } = await supabase
            .from("Animals")
            .insert(datas.animalDatas)
            .select();

        if (error) {
            console.log(error);
            return false;
        }

        console.log(datas);
        if (datas.animalDatas.Type === "cow") {
            datas.cowDatas.Id = data[0].Id;
            // datas.cowDatas.user_id = user.id;

            const { data: cowsData, error: cowsError } = await supabase
                .from("Cows")
                .insert(datas.cowDatas);

            if (cowsError) {
                const result = await supabase
                    .from("Animals")
                    .delete()
                    .eq("Id", datas.cowDatas.Id);

                return false;
            }
        } else if (datas.animalDatas.Type == "heifer") {
            datas.heiferDatas.Id = data[0].Id;
            // user_id

            const { data: heiferData, error: heiferError } = await supabase.from("Heifers").insert(datas.heiferDatas);

            if (heiferError) {
                const result = await supabase
                    .from("Animals")
                    .delete()
                    .eq("Id", datas.heiferDatas.Id);

                return false;
            }
        } else if (datas.animalDatas.Type == "calf") {
            datas.calfDatas.Id = data[0].Id;
            // user_id

            const { data: calfData, error: calfError } = await supabase.from("Calves").insert(datas.calfDatas);

            if (calfError) {
                const result = await supabase
                    .from("Animals")
                    .delete()
                    .eq("Id", datas.calfDatas.Id);

                return false;                
            }
        }
        return true;
    },
};

export const animalDetailServices = {
    async getAnimalDetail(animalId: number) {
        const { data: animalData, error: animalError } = await supabase
            .from("Animals")
            .select("*")
            .eq("Id", animalId)
            .single();
        earringNoForCalves = animalData.EarringNo;
        console.log(animalData);
        return animalData;

        // if (animalData.Type === 'cow' || animalData.Type === 'heifer') {
        //     const {data: calvesData, error: calvesError } = await supabase.from("Animals").select('EarringNo, Name, BirthDate').eq("MotherEarringNo", animalData.EarringNo);
        //     allData.calvesData = calvesData;
        // }

        // const { data: vaccinesData, error: vaccinesError } = await supabase.from("Vaccines").select("VaccineName, VaccineDate").eq("AnimalId", animalId)
    },

    async getAnimalVaccines(animalId: number) {
        const { data: vaccinesData, error: vaccinesError } = await supabase
            .from("Vaccines")
            .select("VaccineName, VaccineDate")
            .eq("AnimalId", animalId);
        if (vaccinesError) return [];
        console.log(vaccinesData);
        return vaccinesData;
    },

    async getAnimalCalves(animalId: number) {
        if (earringNoForCalves) {
            const { data: calvesData, error: calvesError } = await supabase
                .from("Animals")
                .select("EarringNo, Name, BirthDate")
                .eq("MotherEarringNo", earringNoForCalves);
            if (calvesError) return [];

            const { data: deathCalvesData, error: deathCalvesError } =
                await supabase
                    .from("DeletedAnimals")
                    .select("EarringNo, Name, BirthDate, DeathDate, Reason")
                    .eq("MotherEarringNo", earringNoForCalves);
            console.log(calvesData);

            const allCalvesData = calvesData.concat(deathCalvesData);
            return allCalvesData;
        }
        return [];
    },
};

export const updateAnimalService = {
    async getAnimalDatas(animalId: number) {
        const { data: animalData, error: animalError } = await supabase
            .from("Animals")
            .select("*")
            .eq("Id", animalId)
            .single();
        earringNoForCalves = animalData.EarringNo;

        typeForUpdate = animalData.Type;

        return animalData;
    },

    async getDataAsType(animalId: number) {
        if (typeForUpdate == "cow") {
            const { data, error } = await supabase
                .from("Cows")
                .select("*")
                .eq("Id", animalId)
                .single();

            return data;
        } else if (typeForUpdate == "heifer") {
            const { data, error } = await supabase
                .from("Heifers")
                .select("*")
                .eq("Id", animalId)
                .single();

            return data;
        } else if (typeForUpdate == "calf") {
            const { data, error } = await supabase
                .from("Calves")
                .select("*")
                .eq("Id", animalId)
                .single();

            return data;
        }
    },

    async updateAnimal(animalData: any) {
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
                    .eq("Id", cowDatas.Id);

                if (cowError) throw cowError;
            } else if (animalDatas.Type === "heifer" && heiferDatas) {
                const { error: heiferError } = await supabase
                    .from("Heifers")
                    .update({
                        LastBirthDate: heiferDatas.LastBirthDate,
                    })
                    .eq("Id", heiferDatas.Id);

                if (heiferError) throw heiferError;
            } else if (animalDatas.Type === "calf" && calfDatas) {
                const { error: calfError } = await supabase
                    .from("Calves")
                    .update({
                        Gender: calfDatas.Gender,
                    })
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
        const { data, error } = await supabase
            .from("Animals")
            .select("Id, EarringNo, Name, MotherEarringNo, MotherName");
        console.log(data);
        return data;
    },

    async addVaccine(vaccineData: any) {
        const { animalIds, vaccineName, vaccineDate } = vaccineData;

        const records = animalIds.map((animalId: number) => ({
            AnimalId: animalId,
            VaccineName: vaccineName,
            VaccineDate: new Date(vaccineDate),
        }));

        const { error } = await supabase.from("Vaccines").insert(records);

        console.log(error);

        if (error) {
            return false;
        }
        return true;
    },

    async deleteVaccine(vaccineId: number) {
        const { error } = await supabase
            .from("Vaccines")
            .delete()
            .eq("Id", vaccineId);

        if (error) return false;
        return true;
    },
};

export const deletedAnimalsService = {
    async getDeletedAnimals() {
        const { data, error } = await supabase
            .from("Animals")
            .select("*")
            .eq("IsDeleted", true)
            .order("DeathDate", { ascending: false });
        return data;
    },
};

export const AnimalService = {
    async removeAnimal(Id: number, DeathDate: Date, Reason: string) {
        const { error } = await supabase.from("Animals").update({"IsDeleted": true, "DeathDate": DeathDate, "Reason": Reason }).eq("Id", Id);
        console.log(error)
        if (error) return false;
        return true;
    },

    async deleteAnimal(id: number, type: string) {
        
        if (type == 'cow') {
            const { error } = await supabase.from("Cows").delete().eq("Id", id);
            if (error) return false;
        } else if (type == 'calf') {
            const { error } = await supabase.from("Calves").delete().eq("Id", id);
            if (error) return false;
        } else if (type == 'heifer') {
            const { error } = await supabase.from("Heifers").delete().eq("Id", id);
            if (error) return false; 
        }

        const { error } = await supabase.from("Animals").delete().eq("Id", id);

        if (error) {
            console.log(error);
            return false;
        }
        return true;
    },

    async revertAnimal(id: number) {
        const { error } = await supabase.from("Animals").update({"IsDeleted": false}).eq("Id", id);
        if (error) return false;
        return true;
    },

    async applyInsemination(data: any) {
        const {data: animalData, error: animalError } = await supabase.from("Animals").update({"Type": 'cow'}).eq("Id", data.Id).select().single();
        if (animalError) console.log(animalError);

        const { data: heiferData, error: heiferError } = await supabase.from("Cows").insert({"EarringNo": animalData.EarringNo, "Name": animalData.Name, "Id": animalData.Id, "InseminationDate": data.InseminationDate, "BullName": data.BullName, "CheckedDate": data.CheckedDate, "LastBirthDate": data.LastBirthDate });
        if (heiferError) return false;

        const { error } = await supabase.from("Heifers").delete().eq("Id", data.Id);
        if (error) return false;
        return true;
    },

    async gaveBirth(allData: any) {
        const {data: animalData, error: animalError } = await supabase.from("Animals").update({"Type": 'heifer'}).eq("Id", allData.MotherId).select().single();
        if (animalError) console.log(animalError);

        const { data: changedData, error: changedError } = await supabase.from("Heifers").insert({"Id": animalData.Id, "EarringNo": animalData.EarringNo, "Name": animalData.Name, "LastBirthDate": allData.CalfDatas.BirthDate});
        if (changedError) {console.log(changedError); return false}

        const { error } = await supabase.from("Cows").delete().eq("Id", allData.MotherId);
        if (error) {console.log(error); return false}
        
        const { data: calfData, error: calfError } = await supabase.from("Animals").insert({"BirthDate": allData.CalfDatas.BirthDate, "MotherEarringNo": animalData.EarringNo, "MotherName": animalData.Name, "Type": 'calf', "Breed": animalData.Breed, "IsDeleted": false, "EarringNo": allData.CalfDatas.EarringNo, "Name": allData.CalfDatas.Name}).select().single();
        if (calfError) {console.log(calfError);return false};

        const { data: calvesData, error: calvesError } = await supabase.from("Calves").insert({"EarringNo": allData.CalfDatas.EarringNo, "Name": allData.CalfDatas.Name, "BirthDate": allData.CalfDatas.BirthDate, "Gender": allData.CalfDatas.Gender, "Id": calfData.Id});
        if (calvesError) {console.log(calvesError);return false};
        return true;
    }
};
