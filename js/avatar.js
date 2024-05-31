import * as DB from "./db.js";
{
    const DEFAULT_AVATAR_PATHS = [

    ].map(s => `"/data/img/avatars/"${s}`);

    /** @param {string} id The user's UID */
    function getDefaultAvatarPath(id) {
        let counter = 0;
        for(let i = 0; i < id.length; i++) {
            counter += id.charCodeAt(i);
        }
        const index = counter % DEFAULT_AVATAR_PATHS.length;
        return DEFAULT_AVATAR_PATHS[index];
    }

    /** @param {string} id The user's UID */
    async function getDefaultAvatar(id) {
        const path = getDefaultAvatarPath(id);
        const response = await fetch(path);
        if(!response.ok) {
            console.error("Failed to fetch default profile picture: ", response);
            return null;
        }
        return await response.blob();
    }

    /** @param {string} id The user's UID */
    async function getAvatar(id) {
        try {
            const avatar = await DB.getAvatarById(id);
            if(avatar) return avatar;
        } catch (err) {
            console.warn(`Failed to fetch avatar for ${id}: ${err}`);
        }
        return await getDefaultAvatar(id);
    }
}