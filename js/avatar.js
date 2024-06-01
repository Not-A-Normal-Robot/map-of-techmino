import * as DB from "./db.js";

export const DEFAULT_AVATAR_PATHS = [];
export const DEFAULT_AVATAR_SVGS = [];

{ // Generate default avatar paths
    const MIN_CHAR = 0xF0040;
    const MAX_CHAR = 0xF005C;

    function generateHexStrings(min, max) {
        const hexStrings = [];
        for(let i = min; i <= max; i++) {
            hexStrings.push(i.toString(16));
        }
        return hexStrings;
    }

    function getAvatarWithChar(hexCharCode) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="black" />
            <text font-family="techmino-proportional" fill="white" text-anchor="middle" transform="rotate(-11.46 50 50)">
                <tspan x="50%" y="50%" dy="0.3em" font-size="50">&#x${hexCharCode};</tspan>
            </text>
        </svg>`;
    }

    function toDataURI(svgString) {
        return `data:image/svg+xml;base64,${btoa(svgString)}`;
    }

    for(const hexString of generateHexStrings(MIN_CHAR, MAX_CHAR)) {
        const svg = getAvatarWithChar(hexString);
        DEFAULT_AVATAR_SVGS.push(svg);
        DEFAULT_AVATAR_PATHS.push(toDataURI(svg));
    }
}

/** @param {string} id The user's UID */
export function getDefaultAvatarPath(id) {
    let counter = 0;
    for(let i = 0; i < id.length; i++) {
        counter += id.charCodeAt(i);
    }
    const index = counter % DEFAULT_AVATAR_PATHS.length;
    return DEFAULT_AVATAR_PATHS[index];
}

/** @param {string} id The user's UID */
export async function getDefaultAvatar(id) {
    const path = getDefaultAvatarPath(id);
    const response = await fetch(path);
    if(!response.ok) {
        console.error("Failed to fetch default profile picture: ", response);
        return null;
    }
    return await response.blob();
}

/** @param {string} id The user's UID */
export async function getAvatar(id) {
    try {
        const avatar = await DB.getAvatarById(id);
        if(avatar) return avatar;
    } catch (err) {
        console.warn(`Failed to fetch avatar for ${id}: ${err}`);
    }
    return await getDefaultAvatar(id);
}

export default getAvatar;