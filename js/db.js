import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
export const SUPABASE_URL = "https://fohgyexhzptaxjqrrrfd.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGd5ZXhoenB0YXhqcXJycmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQxNTcsImV4cCI6MjAyMDYwMDE1N30.fa7XvwiBbWSe2MLIR6Wkh_OC95uV7UXxt7_25PlyAlc"
export default SUPABASE = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.SUPABASE = SUPABASE;

// #region Type definitions
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {AccountState} account_state
 * @property {Role} role
 * @property {string} bio
 */

/**
 * @typedef {Object} Submission
 * @property {string} id
 * @property {string} game_mode
 * @property {Object | null} score
 * @property {string} upload_date
 * @property {string?} replay_date
 * @property {string} submitted_by
 * @property {SubmissionValidity} validity
 * @property {string?} proof
 */

/**
 * @typedef {Object} ReplayData
 * @property {string} submission_id
 * @property {string} replay_data - Base64 encoded replay data
 */

/**
 * @readonly
 * @enum {string}
 */
export const AccountState = {
    NORMAL: "Normal",
    BANNED: "Banned",
    UNVERIFIED: "Unverified"
}

/**
 * @readonly
 * @enum {string}
 */
export const Role = {
    USER: "User",
    VERIFIER: "Verifier",
    ADMIN: "Administrator"
}

/**
 * @readonly
 * @enum {string}
 */
export const SubmissionValidity = {
    UNVERIFIED: "Unverified",
    VERIFIED: "Verified",
    SUSPICIOUS: "Suspicious",
    REJECTED: "Rejected"
}
// #endregion

export const TABLES = {
    PROFILES: "profiles",
    SUBMISSIONS: "submissions",
    REPLAYS: "replays",
}

// #region Profile table functions
export async function getAllProfiles(limit = 10, offset = 0) {
    const { data, error } = await SUPABASE.from(TABLES.PROFILES)
        .select('*')
        .range(offset, limit);

    if(error) throw new Error(error.message);
    return data;
}
export async function getProfileById(id) {
    const { data, error } = await SUPABASE.from(TABLES.PROFILES)
        .select(1)
        .eq('id', id);

    if(error) throw new Error(error.message);
    return data[0];
}
export async function getProfileByUsername(username) {
    const { data, error } = await SUPABASE.from(TABLES.PROFILES)
        .select(1)
        .eq('username', username);

    if(error) throw new Error(error.message);
    return data[0];
}

export async function editProfile(id, newProfileData) {
    const { data, error } = await SUPABASE.from(TABLES.PROFILES)
        .update(newProfileData)
        .eq('id', id);

    if(error) throw new Error(error.message);
    return data;
}
// #endregion

// #region Submission table functions
export async function getSubmissionsByGameMode(gameMode, limit = 10, offset = 0) {
    const { data, error } = await SUPABASE.from(TABLES.SUBMISSIONS)
        .select('*')
        .eq('game_mode', gameMode)
        .range(offset, limit);

    if(error) throw new Error(error.message);
    return data;
}
export async function getSubmissionById(id) {
    const { data, error } = await SUPABASE.from(TABLES.SUBMISSIONS)
        .select(1)
        .eq('id', id);

    if(error) throw new Error(error.message);
    return data[0];
}
export async function getSubmissionByUserId(userId, limit = 10, offset = 0) {
    const { data, error } = await SUPABASE.from(TABLES.SUBMISSIONS)
        .select('*')
        .eq('submitted_by', userId)
        .range(offset, limit);

    if(error) throw new Error(error.message);
    return data;
}

export async function createSubmission(submissionData) {
    const { data, error } = await SUPABASE.from(TABLES.SUBMISSIONS)
        .insert(submissionData);

    if(error) throw new Error(error.message);
    return data;
}
export async function editSubmission(id, newSubmissionData) {
    const { data, error } = await SUPABASE.from(TABLES.SUBMISSIONS)
        .update(newSubmissionData)
        .eq('id', id);

    if(error) throw new Error(error.message);
    return data;
}
export async function deleteSubmission(id) {
    const { data, error } = await SUPABASE.from(TABLES.SUBMISSIONS)
        .delete()
        .eq('id', id);

    if(error) throw new Error(error.message);
    return data;
}
// #endregion

// #region Replay table functions
export async function getReplayDataBySubmissionId(submissionId) {
    const { data, error } = await SUPABASE.from(TABLES.REPLAYS)
        .select('*')
        .eq('submission_id', submissionId);

    if(error) throw new Error(error.message);
    return data[0];
}

export async function createReplayData(replayData) {
    const { data, error } = await SUPABASE.from(TABLES.REPLAYS)
        .insert(replayData);

    if(error) throw new Error(error.message);
    return data;
}
export async function deleteReplayData(submissionId) {
    const { data, error } = await SUPABASE.from(TABLES.REPLAYS)
        .delete()
        .eq('submission_id', submissionId);

    if(error) throw new Error(error.message);
    return data;
}
// #endregion