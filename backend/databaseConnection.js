const { createClient } = require('@supabase/supabase-js');
const Store = require('electron-store').default;
const dns = require('dns');
require("dotenv").config();

const authStore = new Store({ name: 'auth-session' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// 1. İnternet kontrol fonksiyonun
async function checkInternet() {
    return new Promise((resolve) => {
        dns.lookup('google.com', (err) => {
            resolve(err ? false : true);
        });
    });
}

// 2. Custom Storage Adaptörün (Aynı kalıyor)
const supabaseAuthAdapter = {
    getItem: (key) => authStore.get(key),
    setItem: (key, value) => {
        if (value === null || value === undefined) {
            authStore.delete(key);
        } else {
            authStore.set(key, value);
        }
    },
    removeItem: (key) => authStore.delete(key)
};


let isOnline = false;

checkInternet().then(status => {
    isOnline = status;
    if(!isOnline) console.log("⚠️ Çevrimdışı mod: Supabase otomatik yenileme kapatıldı.");
});

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: supabaseAuthAdapter,
        persistSession: true,
        autoRefreshToken: isOnline, 
        detectSessionInUrl: false
    }
});

module.exports = supabase;