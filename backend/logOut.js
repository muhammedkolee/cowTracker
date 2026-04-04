const supabase = require("./databaseConnection");

async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) return false;

    return true;
}

module.exports = logOut;