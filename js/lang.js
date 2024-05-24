/**
 * Language entries.
 * @typedef {Object} LangEntry
 * @property {Object.<string, (string|LangEntry)>} [property] - An object where each property can be either a string or another LangEntry object.
 */
let langEntries = {};

export function getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
}

export function getLangFilePath(lang) {
    lang = lang ?? getCurrentLang();
    return `/data/lang/${lang}.js`;
}

/**
 * Gets a language entry from the current language.
 * The key is a dot-separated string representing the path to the entry.
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
export function getLanguageEntry(key, fallback) {
    if(typeof key !== 'string') throw new Error("Key must be a string!");
    if(fallback === undefined) fallback = key;

    let keys = key.split('.');
    let scope = langEntries;
    for(let i = 0; i < keys.length; i++) {
        if(typeof scope !== 'object') return fallback;
        if(!scope[keys[i]]) return fallback;
        scope = scope[keys[i]];
    }
    return scope;
}

/**
 * Gets a mode's full name.
 * Falls back to '[mode]' if the language entry is not found.
 * @param {string} mode 
 * @returns {string}
 */
export function getModeFullName(mode) {
    const langEntry = langEntries.modes[mode];
    if(!langEntry) {
        return `[${mode}]`;
    }
    return `${langEntry.title} ${langEntry.subtitle}`;
}

/**
 * Gets the full language entry object.
 * It can be useful if you value performance a lot.
 * @returns {LangEntry}
 */
export function getLanguageEntries() {
    return langEntries;
};

/**
 * Get an article's HTML.
 * @param {string} key 
 * @param {string} fallback 
 * @returns {string} The article HTML.
 */
export async function getArticle(key, fallback) {
    if(typeof key !== 'string') throw new Error("Key must be a string!");
    
    const result = await fetch(`/data/lang/articles/${getCurrentLang()}/${key}.html`);

    if(!result.ok) {
        if(fallback === undefined) {
            throw new Error(`Failed to fetch article ${key}`);
        }
        return fallback;
    }

    return await result.text();
}

/**
 * Sets the current language.
 * @param {string} lang
 */
export async function setLanguage(lang){
    if(lang === localStorage.getItem('lang')) return;
    if(typeof lang !== 'string') throw new Error("Language must be a string!");
    localStorage.setItem('lang', lang);

    langEntries = (await import(getLangFilePath(lang))).default;
}

langEntries = (await import(getLangFilePath())).default;