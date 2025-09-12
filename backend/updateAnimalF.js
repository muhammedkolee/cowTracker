const supabase = require("./databaseConnection");

async function updateAnimal(allDatas) {
    const { data: willRemoveAnimal, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", allDatas.animalData.Id);

    if (allDatas.animalData.Type == willRemoveAnimal[0].Type) {
        if (willRemoveAnimal[0].Type == "cow") {
            const error = await supabase
                .from("Cows")
                .update(allDatas.cowData)
                .eq("Id", allDatas.animalData.Id);
        } else if (willRemoveAnimal[0].Type == "heifer") {
            const error = await supabase
                .from("Heifers")
                .update(allDatas.heiferData)
                .eq("Id", allDatas.animalData.Id);
        } else if (willRemoveAnimal[0].Type == "calf") {
            const error = await supabase
                .from("Calves")
                .update(allDatas.calfData)
                .eq("Id", allDatas.animalData.Id);
        }
    } else {
        const animalId = willRemoveAnimal[0].Id;
        if (willRemoveAnimal[0].Type == "calf") {
            const response = await supabase
                .from("Calves")
                .delete()
                .eq("Id", willRemoveAnimal[0].Id);
        } else if (willRemoveAnimal[0].Type == "cow") {
            const response = await supabase
                .from("Cows")
                .delete()
                .eq("Id", willRemoveAnimal[0].Id);
        } else if (willRemoveAnimal[0].Type == "heifer") {
            const response = await supabase
                .from("Heifers")
                .delete()
                .eq("Id", willRemoveAnimal[0].Id);
        }

        if (allDatas.animalData.Type == "cow") {
            allDatas.cowData.Id = animalId;
            const { error } = await supabase
                .from("Cows")
                .insert(allDatas.cowData);
        } else if (allDatas.animalData.Type == "heifer") {
            allDatas.heiferData.Id = animalId;
            const { error } = await supabase
                .from("Heifers")
                .insert(allDatas.heiferData);
        } else if (allDatas.animalData.Type == "calf") {
            allDatas.calfData.Id = animalId;
            const { error } = await supabase
                .from("Calves")
                .insert(allDatas.calfData);
        }
    }

    const { error } = await supabase
        .from("Animals")
        .update(allDatas.animalData)
        .eq("Id", allDatas.animalData.Id);
    if (error) {
        return false;
    } else {
        return true;
    }
}

module.exports = updateAnimal;
