const supabase = require("./databaseConnection");

async function addAnimal(datas) {
    const { data: animalsData, error: animalsError } = await supabase
        .from("Animals")
        .insert(datas.animalDatas);

    if (datas.animalDatas.Type === "cow") {
        const { data: cowsData, error: cowsError } = await supabase
            .from("Cows")
            .insert(datas.cowDatas);
        if (cowsError) {
            // event.sender.send("addResult", false);
            return false
        }
    } else if (datas.animalDatas.Type === "heifer") {
        const { data: heifersData, error: heifersError } = await supabase
            .from("Heifers")
            .insert(datas.heiferDatas);
        if (heifersError) {
            // event.sender.send("addResult", false);
            return false
        }
    } else if (datas.animalDatas.Type === "calf") {
        const { data: calvesData, error: calvesError } = await supabase
            .from("Calves")
            .insert(datas.calfDatas);
        if (calvesError) {
            // event.sender.send("addResult", false);
            return false
        }
    }
    if (animalsError) {
        // event.sender.send("addResult", false);
        return false
    } else {
        // event.sender.send("addResult", true);
        return true
    }
}

// event.sender.send("addResult", true);
module.exports = addAnimal;