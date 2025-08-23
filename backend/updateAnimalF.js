const supabase = require("./databaseConnection");

async function updateAnimal(allDatas) {
    const { data: willRemoveAnimal, error: animalError } = await supabase.from("Animals").select("*").eq("EarringNo", allDatas.animalData.EarringNo);
    
    if (allDatas.animalData.Type == willRemoveAnimal[0].Type) {
        const error = await supabase.from(`${String(willRemoveAnimal[0].Type).charAt(0).toUpperCase() + String(willRemoveAnimal[0].Type).slice(1)}s`).update(allDatas.animalData).eq("EarringNo", allDatas.animalData.EarringNo);
    }

    else {

        if (allDatas.animalData.Type === "cow") {
            const { error } = await supabase
            .from("Cows")
            .insert(allDatas.cowData)
            if (error) {
                console.log("Bir hata oluştu: ", error);
            }
        } else if (allDatas.animalData.Type === "heifer") {
            const { error } = await supabase
            .from("Heifers")
            .insert(allDatas.heiferData)
            if (error) {
                console.log(error);
            }
        } else if (allDatas.animalData.Type === "calf") {
            const { error } = await supabase
            .from("Calves")
                .insert(allDatas.calfData)
                if (error) {
                    console.log("Bir hata oluştu: ", error);
                }
        }

        const response = await supabase.from(`${String(willRemoveAnimal[0].Type).charAt(0).toUpperCase() + String(willRemoveAnimal[0].Type).slice(1)}s`).delete().eq("EarringNo", allDatas.animalData.EarringNo);
        if (response.statusText === 204) {
            console.log("Hayvan basari ile silindi!");
        }
        else {
            console.log("Hayvan silme islemi sirasinda bir hata olustu: ", response.statusText);
        }
    }

    const { error } = await supabase
        .from("Animals")
        .update(allDatas.animalData)
        .eq("EarringNo", allDatas.animalData.EarringNo);
    if (error) {
        return false
    } else {
        return true
    }


}

module.exports = updateAnimal;