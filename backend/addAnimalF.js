const supabase = require("./databaseConnection");

async function addAnimal(datas) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    datas.animalDatas.user_id = user.id;

    const { data, error } = await supabase
        .from("Animals")
        .insert(datas.animalDatas)
        .select();

    if (error) {
        console.log(error);
        return false;
    }
    
    if (datas.animalDatas.Type === "cow") {
        datas.cowDatas.Id = data[0].Id;
        datas.cowDatas.user_id = user.id;
        
        const { data: cowsData, error: cowsError } = await supabase
        .from("Cows")
        .insert(datas.cowDatas);
        
        if (cowsError) {
            const result = await supabase
                .from("Animals")
                .delete()
                .eq("Id", datas.cowDatas.Id)

            return false;
        }
    } else if (datas.animalDatas.Type === "heifer") {
        datas.heiferDatas.Id = data[0].Id;
        datas.heiferDatas.user_id = user.id;
        
        const { data: heifersData, error: heifersError } = await supabase
        .from("Heifers")
        .insert(datas.heiferDatas);
        if (heifersError) {
            console.log(heifersError);

            const result = await supabase
                .from("Animals")
                .delete()
                .eq("Id", datas.heiferDatas.Id)

            return false;
        }
    } else if (datas.animalDatas.Type === "calf") {
        datas.calfDatas.Id = data[0].Id;
        datas.calfDatas.user_id = user.id;
        
        const { data: calvesData, error: calvesError } = await supabase
        .from("Calves")
        .insert(datas.calfDatas);
        if (calvesError) {
            const result = await supabase
                .from("Animals")
                .delete()
                .eq("Id", datas.calfDatas.Id)
                
            return false;
        }
    }

    return true;
}

module.exports = addAnimal;
