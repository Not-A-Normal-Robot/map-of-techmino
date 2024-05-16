import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
export const SUPABASE_URL = "https://fohgyexhzptaxjqrrrfd.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGd5ZXhoenB0YXhqcXJycmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQxNTcsImV4cCI6MjAyMDYwMDE1N30.fa7XvwiBbWSe2MLIR6Wkh_OC95uV7UXxt7_25PlyAlc"
export const SUPABASE = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

{
    async function loginWithDiscord() {
        const { data, error } = await SUPABASE.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: "https://techmino-hub.github.io/auth/discord.html"
            }
        });
        console.log(data, error);
    }
    
    document.getElementById("login")?.addEventListener("click", loginWithDiscord);
}