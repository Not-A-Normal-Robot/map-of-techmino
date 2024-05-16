import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const SUPABASE_URL = "https://fohgyexhzptaxjqrrrfd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGd5ZXhoenB0YXhqcXJycmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQxNTcsImV4cCI6MjAyMDYwMDE1N30.fa7XvwiBbWSe2MLIR6Wkh_OC95uV7UXxt7_25PlyAlc"
const SUPABASE = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log(SUPABASE); {
    async function loginWithDiscord() {
        const { data, error } = await SUPABASE.auth.signInWithOAuth({
            provider: "discord",

        });
        console.log(data, error);
    }
    
    document.getElementById("button").addEventListener("click", loginWithDiscord);
}