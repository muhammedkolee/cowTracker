const supabase = require("./databaseConnection");

async function signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName,
            },
        }
    });

    if (error) {
        console.log(error);
        return error;
    }
    return data;
}

module.exports = signUp;