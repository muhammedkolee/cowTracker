const supabase = require("./databaseConnection");

async function permanentDelete(Id) {
    const { data, error } = await supabase
        .from("Animals")
        .select("Type")
        .eq("Id", Id)
        .single()


    if (data.Type == "cow") {
        const response = await supabase
            .from("Cows")
            .delete()
            .eq("Id", Id)
    } else if (data.Type == "heifer") {
        const response = await supabase
            .from("Heifers")
            .delete()
            .eq("Id", Id)
    } else if (data.Type == "calf") {
        const response = await supabase
            .from("Calves")
            .delete()
            .eq("Id", Id)
    }
    
    const response = await supabase
        .from("Animals")
        .delete()
        .eq("Id", Id)

    const response2 = await supabase
        .from("DeletedAnimals")
        .delete()
        .eq("Id", Id)
}

module.exports = permanentDelete;