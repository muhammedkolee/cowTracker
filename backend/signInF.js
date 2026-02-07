const supabase = require("./databaseConnection");

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data.user) {
    return data
  }
  else { return false }
}

module.exports = signIn;