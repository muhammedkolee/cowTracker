const supabase = require("./databaseConnection");

async function removeVaccine(vaccineId) {
    console.log(typeof vaccineId);
    if (typeof vaccineId == "string") {
        const response = await supabase
            .from("Vaccines")
            .delete()
            .eq("Id", vaccineId);
        console.log("ife girildi.");
        if (response.status == 204) {
            console.log("İşlem Başarılı.");
        } else {
            console.log("Bir hata meydana geldiii.");
        }
    } else {
        vaccineId.forEach(async (Id) => {
            const response = await supabase
                .from("Vaccines")
                .delete()
                .eq("Id", Id);
            if (response.status != 204) {
                console.log("Bir hata olustu.");
            }
        });
    }
}

module.exports = removeVaccine;
