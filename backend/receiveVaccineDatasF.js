const supabase = require("./databaseConnection");

async function receiveVaccineDatas(vaccineDatas) {
    if (vaccineDatas.all) {
        const { data, error } = await supabase.from("Animals").select("*");

        data.forEach(async (animal) => {
            const { error } = await supabase
                .from("Vaccines")
                .insert({
                    VaccineName: vaccineDatas.VaccineName,
                    VaccineDate: vaccineDatas.VaccineDate,
                    AnimalId: animal.Id,
                });
            if (error) {
                console.log("Bir hata oluştu, fonksiyon durduruluyor.");
                return;
            }
        });
    } else if (vaccineDatas.types) {
        const animalsList = [];
        if (vaccineDatas.types.cows) {
            const { data: cowData, error: cowError } = await supabase
                .from("Cows")
                .select("*");
            cowData.forEach(async (cow) => {
                const { error } = await supabase
                    .from("Vaccines")
                    .insert({
                        VaccineName: vaccineDatas.VaccineName,
                        VaccineDate: vaccineDatas.VaccineDate,
                        AnimalId: cow.Id,
                    });
            });
        }
        if (vaccineDatas.types.heifers) {
            const { data: heiferData, error: heiferError } = await supabase
                .from("Heifers")
                .select("*");
            heiferData.forEach(async (heifer) => {
                const { error } = await supabase
                    .from("Vaccines")
                    .insert({
                        VaccineName: vaccineDatas.VaccineName,
                        VaccineDate: vaccineDatas.VaccineDate,
                        AnimalId: heifer.Id,
                    });
            });
        }
        if (vaccineDatas.types.calves) {
            const { data: calvesData, error: calvesError } = await supabase
                .from("Calves")
                .select("*");
            calvesData.forEach(async (calf) => {
                const { error } = await supabase
                    .from("Vaccines")
                    .insert({
                        VaccineName: vaccineDatas.VaccineName,
                        VaccineDate: vaccineDatas.VaccineDate,
                        AnimalId: calf.Id,
                    });
            });
        }
        if (vaccineDatas.types.bulls) {
            const { data: bullsData, error: bullsError } = await supabase
                .from("Animals")
                .select("*")
                .eq("Type", "bull");
            bullsData.forEach(async (bull) => {
                const { error } = await supabase
                    .from("Vaccines")
                    .insert({
                        VaccineName: vaccineDatas.VaccineName,
                        VaccineDate: vaccineDatas.VaccineDate,
                        AnimalId: bull.Id,
                    });
            });
        }
    } else if (vaccineDatas.AnimalId) {
        const { error } = await supabase.from("Vaccines").insert(vaccineDatas);
        if (error) {
            console.log(error);
        }
    }
}

module.exports = receiveVaccineDatas;