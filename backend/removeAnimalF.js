const supabase = require("./databaseConnection");

async function removeAnimal(datas) {
    if (datas.Type === "cow") {
        const response = await supabase
            .from("Cows")
            .delete()
            .eq("EarringNo", datas.EarringNo);
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
            .eq("EarringNo", datas.EarringNo);
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
            .eq("EarringNo", datas.EarringNo);
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
        .eq("EarringNo", datas.EarringNo);
    if (response.status === 204) {
        console.log("İşlem Başarılı!");
    } else {
        console.log("Bir hata meydana geldi, Animals!\n", response.statusText);
    }

    if (datas.pageName === "animals") {
        event.sender.send("refresh", await getAnimalsDatas());
    } else if (datas.pageName === "cows") {
        event.sender.send("refresh", await getCowsDatas());
    } else if (datas.pageName === "heifers") {
        event.sender.send("refresh", await getHeifersDatas());
    } else if (datas.pageName === "calves") {
        event.sender.send("refresh", await getCalvesDatas());
    } else if (datas.pageName === "bulls") {
        event.sender.send("refresh", await getBullsDatas());
    }
}

module.exports = removeAnimal;