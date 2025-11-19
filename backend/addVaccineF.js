const supabase = require("./databaseConnection");

async function addVaccine(vaccineDatas) {
    if (vaccineDatas.all) {
        const { data, error } = await supabase.from("Animals").select("*");

        for (const animal of data) {
            const { error } = await supabase.from("Vaccines").insert({
                VaccineName: vaccineDatas.VaccineName,
                VaccineDate: vaccineDatas.VaccineDate,
                AnimalId: animal.Id,
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
                .eq("Type", "cow");
            
            for (const cow of cowData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: cow.Id,
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
                .eq("Type", "heifer");
            
            for (const heifer of heiferData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: heifer.Id,
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
                .eq("Type", "calf");
            
            for (const calf of calvesData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: calf.Id,
                });
                console.log("eklendi: ", calf.Id);
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
                .eq("Type", "bull");
            
            for (const bull of bullsData) {
                const { error } = await supabase.from("Vaccines").insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: bull.Id,
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
    } else if (vaccineDatas.AnimalId) {
        const { error } = await supabase.from("Vaccines").insert(vaccineDatas);
    }
}

module.exports = addVaccine;