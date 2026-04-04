const supabase = require("./databaseConnection");
const store = require("../backend/store.js");

// function removeAnimalOffline(datas) {
//     console.log("removeanimalf: " ,datas)
//     if (datas.Type === "cow") {
//         store.set("Cows", store.get("Cows").filter(cow => cow.Id !== datas.animalId));
//     }
//     else if (datas.Type === "heifer") {
//         store.set("Heifers", store.get("Heifers").filter(heifer => heifer.Id !== datas.animalId));
//     }
//     else if (datas.Type === "calf") {
//         store.set("Calves", store.get("Calves").filter(calf => calf.Id !== datas.animalId));
//     }

//     const deletedAnimal = store.get("Animals").find(animal => animal.Id === datas.animalId);

//     if (!deletedAnimal) {
//         console.log("false")
//         return false;
//     }

//     deletedAnimal.Reason = "Deneme";
//     deletedAnimal.DeathDate = new Date().toISOString().split('T')[0];

//     store.set("deletedAnimals", [...store.get("deletedAnimals") || [], deletedAnimal])

//     store.set("Animals", (store.get("Animals") || []).filter(animal => animal.Id !== datas.animalId));

//     store.set("lastUpdatedAt", new Date().toISOString());

//     return true;
// }

// Move to Trash Can
async function removeAnimal(datas) {
    const { data: animalData, error: animalError } = await supabase
        .from("Animals")
        .select("*")
        .eq("Id", datas.animalId)
        .single();

    const { data: addedAnimal, error: addedError } = await supabase
        .from("DeletedAnimals")
        .insert({
            Id: animalData.Id,
            EarringNo: animalData.EarringNo,
            Name: animalData.Name,
            MotherEarringNo: animalData.MotherEarringNo,
            MotherName: animalData.MotherName,
            Reason: datas.Reason,
            BirthDate: animalData.BirthDate,
            DeathDate: datas.DeathDate,
            Type: animalData.Type,
            Breed: animalData.Breed,
            user_id: animalData.user_id,
            Note: animalData.Note,
        });

    console.log("error: ", addedError); 
    // console.log("error: ", animalError); 

    // if (datas.Type === "cow") {
    //     const response = await supabase
    //         .from("Cows")
    //         .delete()
    //         .eq("Id", datas.animalId);
    // } else if (datas.Type === "heifer") {
    //     const response = await supabase
    //         .from("Heifers")
    //         .delete()
    //         .eq("Id", datas.animalId);
    // } else if (datas.Type === "calf") {
    //     console.log("calf");
    //     const response = await supabase
    //         .from("Calves")
    //         .delete()
    //         .eq("Id", datas.animalId);

    //     console.log(response);
    // }

    const response = await supabase
        .from("Animals")
        .update({"IsDeleted": true})
        .eq("Id", datas.animalId);

    console.log("response in removeAnimalF: ", response)

    return;
}

module.exports = { removeAnimal };
