const supabase = require("./databaseConnection");

async function addVaccine(vaccineDatas) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (vaccineDatas.all) {
        const { data, error } = await supabase.from("Animals").select("*").eq("user_id", user.id);

        for (const animal of data) {
            const { error } = await supabase.from("Vaccines").insert({
                VaccineName: vaccineDatas.VaccineName,
                VaccineDate: vaccineDatas.VaccineDate,
                AnimalId: animal.Id,
                user_id: user.id
            });
            if (error) {
                return;
            }
        }

        // data.forEach(async (animal) => {
        //     const { error } = await supabase.from("Vaccines").insert({
        //         VaccineName: vaccineDatas.VaccineName,
        //         VaccineDate: vaccineDatas.VaccineDate,
        //         AnimalId: animal.Id,
        //     });
        //     if (error) {
        //         return;
        //     }
        // });
    } else if (vaccineDatas.types) {
        if (vaccineDatas.types.cows) {
            const { data: cowData, error: cowError } = await supabase
                .from("Animals")
                .select("*")
                .eq("Type", "cow")
                .eq("user_id", user.id);
            
            for (const cow of cowData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: cow.Id,
                    user_id: user.id
                });
            }
            
            //     cowData.forEach(async (cow) => {
            //     const { error } = await supabase.from("Vaccines").insert({
            //         VaccineName: vaccineDatas.VaccineName,
            //         VaccineDate: vaccineDatas.VaccineDate,
            //         AnimalId: cow.Id,
            //     });
            // });
        }
        if (vaccineDatas.types.heifers) {
            const { data: heiferData, error: heiferError } = await supabase
                .from("Animals")
                .select("*")
                .eq("Type", "heifer")
                .eq("user_id", user.id);
            
            for (const heifer of heiferData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: heifer.Id,
                    user_id: user.id
                });
            }
            
            //     heiferData.forEach(async (heifer) => {
            //     const { error } = await supabase.from("Vaccines").insert({
            //         VaccineName: vaccineDatas.VaccineName,
            //         VaccineDate: vaccineDatas.VaccineDate,
            //         AnimalId: heifer.Id,
            //     });
            // });
        }
        if (vaccineDatas.types.calves) {
            const { data: calvesData, error: calvesError } = await supabase
                .from("Animals")
                .select("*")
                .eq("Type", "calf")
                .eq("user_id", user.id);
            
            for (const calf of calvesData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: calf.Id,
                    user_id: user.id
                });
            }

            //     calvesData.forEach(async (calf) => {
            //     const { error } = await supabase.from("Vaccines").insert({
            //         VaccineName: vaccineDatas.VaccineName,
            //         VaccineDate: vaccineDatas.VaccineDate,
            //         AnimalId: calf.Id,
            //     });
            // });
        }
        if (vaccineDatas.types.bulls) {
            const { data: bullsData, error: bullsError } = await supabase
                .from("Animals")
                .select("*")
                .eq("Type", "bull")
                .eq("user_id", user.id);
            
            for (const bull of bullsData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: bull.Id,
                    user_id: user.id
                });
            }
            
                // bullsData.forEach(async (bull) => {
                // const { error } = await supabase.from("Vaccines").insert({
                //     VaccineName: vaccineDatas.VaccineName,
                //     VaccineDate: vaccineDatas.VaccineDate,
                //     AnimalId: bull.Id,
                // });
            // });
        }
    } else if (vaccineDatas.AnimalIds && vaccineDatas.AnimalIds.length > 0) {
        const records = vaccineDatas.AnimalIds.map((id) => ({
            AnimalId: id,
            VaccineName: vaccineDatas.VaccineName,
            VaccineDate: vaccineDatas.VaccineDate,
            user_id: user.id
        }));


        const { error } = await supabase.from("Vaccines").insert(records);
    }
}

module.exports = addVaccine;