const supabase = require("./databaseConnection");

async function removeVaccine(vaccineId) {
    const response = await supabase.from("Vaccines").delete().eq("Id", vaccineId);

    if (response.status == 204) {
        console.log("İşlem Başarılı.");
    }
    else {
        console.log("Bir hata meydana geldiii.");
    }
}

module.exports = removeVaccine;