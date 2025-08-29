const supabase = require("./databaseConnection");

async function removeAnimal(datas) {
    if (datas.Type === "cow") {
        const response = await supabase
            .from("Cows")
            .delete()
            .eq("Id", datas.animalId);
        if (response.status === 204) {
            console.log("Islem basarili.");
        } else {
            console.log(
                "Bir hata meydana geldi, Animals!\n",
                response.statusText
            );
        }
    } else if (datas.Type === "heifer") {
        const response = await supabase
            .from("Heifers")
            .delete()
            .eq("Id", datas.animalId);
        if (response.status === 204) {
            console.log("Islem basarili.");
        } else {
            console.log(
                "Bir hata meydana geldi, Animals!\n",
                response.statusText
            );
        }
    } else if (datas.Type === "calf") {
        const response = await supabase
            .from("Calves")
            .delete()
            .eq("Id", datas.animalId);
        if (response.status === 204) {
            console.log("Islem basarili.");
        } else {
            console.log(
                "Bir hata meydana geldi, Animals!\n",
                response.statusText
            );
        }
    }
    const response = await supabase
        .from("Animals")
        .delete()
        .eq("Id", datas.animalId);
    if (response.status === 204) {
        console.log("İşlem Başarılı!");
    } else {
        console.log("Bir hata meydana geldi, Animals!\n", response.statusText);
    }

    return;
}

module.exports = removeAnimal;
