const supabase = require("./databaseConnection");

async function addAnimal(datas) {
    const { data, error } = await supabase
        .from("Animals")
        .insert(datas.animalDatas)
        .select();

    if (datas.animalDatas.Type === "cow") {
        datas.cowDatas.Id = data[0].Id;
        console.log("calisti");

        const { data: cowsData, error: cowsError } = await supabase
            .from("Cows")
            .insert(datas.cowDatas);
        if (cowsError) {
            console.log(cowsError);
            return false;
        }
    } else if (datas.animalDatas.Type === "heifer") {
        datas.heiferDatas.Id = data[0].Id;

        const { data: heifersData, error: heifersError } = await supabase
            .from("Heifers")
            .insert(datas.heiferDatas);
        if (heifersError) {
            return false;
        }
    } else if (datas.animalDatas.Type === "calf") {
        datas.calfDatas.Id = data[0].Id;

        const { data: calvesData, error: calvesError } = await supabase
            .from("Calves")
            .insert(datas.calfDatas);
        if (calvesError) {
            return false;
        }
    }
    if (error) {
        return false;
    } else {
        return true;
    }
}

module.exports = addAnimal;
