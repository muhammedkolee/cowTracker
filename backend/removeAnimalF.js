const supabase = require("./databaseConnection");

async function removeAnimal(datas) {
    
    if (datas.Type === "cow") {
        const response = await supabase
        .from("Cows")
        .delete()
        .eq("Id", datas.animalId);
    } else if (datas.Type === "heifer") {
        const response = await supabase
        .from("Heifers")
        .delete()
        .eq("Id", datas.animalId);
    } else if (datas.Type === "calf") {
        const response = await supabase
        .from("Calves")
        .delete()
        .eq("Id", datas.animalId);
    }
    
    const response = await supabase
        .from("Animals")
        .delete()
        .eq("Id", datas.animalId);

    return;
}

module.exports = removeAnimal;
