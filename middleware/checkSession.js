const supabase = require("../backend/databaseConnection");

async function checkSession() {
    // Check the local storage (auth-session.json)
    console.log("session: sss12334");
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();
    console.log("session: sss", session);

    try {
        // Get exist user's data if user exist
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        console.log(user);

        // If user doesn't exist, refresh session token
        if (userError || !user) {
            const { data: refreshData, error: refreshError } =
                await supabase.auth.refreshSession();

            if (refreshError || !refreshData.user) {
                return false;
            }
            return true;
        }

        return true;
    } catch (err) {
        console.error("Session kontrolünde beklenmedik hata:", err);
        return false;
    }
  }


module.exports = checkSession;
