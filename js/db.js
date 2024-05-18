import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
export const SUPABASE_URL = "https://fohgyexhzptaxjqrrrfd.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGd5ZXhoenB0YXhqcXJycmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQxNTcsImV4cCI6MjAyMDYwMDE1N30.fa7XvwiBbWSe2MLIR6Wkh_OC95uV7UXxt7_25PlyAlc"
export const SUPABASE = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} join_date
 * @property {string} username
 * @property {AccountState} account_state
 */

/**
 * @typedef {Object} Submission
 * @property {string} id
 * @property {string} game_mode
 * @property {string} username
 * @property {Object} score
 * @property {string} upload_date
 * @property {string} replay_date
 * @property {string} replay_path
 * @property {string} submitted_by
 */

/**
 * @readonly
 * @enum {string}
 */
export const AccountState = {
    NORMAL: "normal",
    BANNED: "banned",
    UNVERIFIED: "unverified"
}