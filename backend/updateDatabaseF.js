const supabase = require("./databaseConnection");

// FOR THE MAIN FUNCTIONS
// Get datas of whole animals.
async function getAnimalsDatas() {
    const { data, error } = await supabase.from("Animals").select("*");
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole cows.
async function getCowsDatas() {
    const { data, error } = await supabase.from("Cows").select("*");
    if (error) {
        // console.log('Hata: ',error);
    } else {
        // console.log("Gelen Veriler: ",data);
    }

    return data;
}

// Get datas of whole heifers.
async function getHeifersDatas() {
    const { data, error } = await supabase.from("Heifers").select("*");
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole calves.
async function getCalvesDatas() {
    const { data, error } = await supabase.from("Calves").select("*");
    if (error) {
        // console.log("Bir hata meydana geldi!");
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

// Get datas of whole bulls.
async function getBullsDatas() {
    const { data, error } = await supabase
        .from("Animals")
        .select("*")
        .eq("Type", "bull");
    if (error) {
        // console.log("Bir hata meydana geldi!11", error);
    } else {
        // console.log("Gelen Veriler: ", data);
    }
    return data;
}

async function updateDatabase() {
    // Get datas of calves.
    const calvesDatas = await getCalvesDatas();

    calvesDatas.forEach(async (calf) => {
        let calfBirthDate = new Date(calf.BirthDate);

        if ((getTodayDate() - calfBirthDate) / (1000 * 60 * 60 * 24) >= 365) {
            // Delete the calf from the database.
            const responseDelete = await supabase
                .from("Calves")
                .delete()
                .eq("EarringNo", calf.EarringNo);

            // If calf is a girl, insert Heifers.
            if (calf.Gender) {
                const { data: addHeiferData, error: addHeiferError } =
                    await supabase.from("Heifers").insert({
                        EarringNo: calf.EarringNo,
                        Name: calf.Name,
                        LastBirthDate: getTodayDate(),
                    });

                // Update data of Animals table
                const { data: updateCalfData, error: updateCalfError } =
                    await supabase
                        .from("Animals")
                        .update({ Type: "heifer" })
                        .eq("EarringNo", calf.EarringNo);
            }
            // If calf is a boy, insert Bulls.
            else {
                const { data: addBullData, error: addBullError } =
                    await supabase
                        .from("Animals")
                        .update({ Type: "bull" })
                        .eq("EarringNo", calf.EarringNo);
            }
            const { data: infoData, error: infoError } = await supabase
                .from("Information")
                .insert({
                    Info:
                        calf.EarringNo +
                        ` küpe numaralı buzağı "Düve" olarak kaydedildi!`,
                });
            console.log(infoError);
        }
    });

    const heifersDatas = await getHeifersDatas();
    let closestHeifers = [];

    // 1000 * 60 * 60 * 24 => Convert milisecond to day
    heifersDatas.forEach(async (heifer) => {
        if (
            (getTodayDate() - new Date(heifer.LastBirthDate)) /
                (1000 * 60 * 60 * 24) >=
                40 &&
            (getTodayDate() - new Date(heifer.LastBirthDate)) /
                (1000 * 60 * 60 * 24) <=
                90
        ) {
            console.log("adw");
            closestHeifers.push({
                EarringNo: heifer.EarringNo,
                Name: heifer.Name,
                Date:
                    (getTodayDate() - new Date(heifer.LastBirthDate)) /
                    (1000 * 60 * 60 * 24),
            });
        }
    });

    const cowsDatas = await getCowsDatas();
    let closestCows = [];

    cowsDatas.forEach((cow) => {
        if (
            (new Date(cow.InseminationDate) - getTodayDate()) /
                (1000 * 60 * 60 * 24) +
                280 <=
            20
        ) {
            closestCows.push({
                EarringNo: cow.EarringNo,
                Name: cow.Name,
                Date:
                    (new Date(cow.InseminationDate) - getTodayDate()) /
                        (1000 * 60 * 60 * 24) +
                    280,
            });
        }
    });

    const { data: infoDatas, error: infoError } = await supabase
        .from("Information")
        .select("*");

    infoDatas.forEach(async (info) => {
        if (
            (new Date() - new Date(info.CreatedAt)) / (1000 * 60 * 60 * 24) >
            5
        ) {
            const error = await supabase
                .from("Information")
                .delete()
                .eq("Info", info.Info);
        }
    });

    return {
        closestHeifers: closestHeifers,
        closestCows: closestCows,
        info: infoDatas,
    };
}

function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0"); // Ocak = 0
    let day = String(today.getDate()).padStart(2, "0");

    return new Date(`${year}-${month}-${day}`);
}

module.exports = updateDatabase;
