const { createClient } = require("@supabase/supabase-js");

// Need to connect supabase.
const supabaseUrl = "https://keixqunsvrtxhtjbxqlr.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaXhxdW5zdnJ0eGh0amJ4cWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjExMjQsImV4cCI6MjA2NzM5NzEyNH0.EU-7sz48RYWPR-Nn9hiuYlZvWVDNrMg2xvI3ha4Z0xk";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;