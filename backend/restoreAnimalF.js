const supabase = require("./databaseConnection");

async function restoreAnimal(animalId) {
    const deleteResponse = await supabase
        .from("DeletedAnimals")
        .delete()
        .eq("Id", animalId)

    const restoreResponse = await supabase
        .from("Animals")
        .update({"IsDeleted": false})
        .eq("Id", animalId);

    console.log("deleteResponse: ", deleteResponse, "\nrestoreResponse: ", restoreResponse)

    return true
}

module.exports = restoreAnimal;