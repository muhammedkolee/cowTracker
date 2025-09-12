const supabase = require("./databaseConnection");

async function removeVaccine(vaccineId) {
    if (typeof vaccineId == "string") {
        const response = await supabase
            .from("Vaccines")
            .delete()
            .eq("Id", vaccineId);
    } else {
        vaccineId.forEach(async (Id) => {
            const response = await supabase
                .from("Vaccines")
                .delete()
                .eq("Id", Id);
        });
    }
}

module.exports = removeVaccine;
