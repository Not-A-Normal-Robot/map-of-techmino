let langEntries = {};

export function getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
}
export function getLangFilePath(lang) {
    lang = lang ?? getCurrentLang();
    return `/data/lang/${lang}.js`;
}
export function getLanguageEntry(key, fallback) {
    if(typeof key !== 'string') throw new Error("Key must be a string!");
    fallback ??= key;

    let keys = key.split('.');
    let scope = langEntries;
    for(let i = 0; i < keys.length; i++) {
        if(typeof scope !== 'object') return fallback;
        if(!scope[keys[i]]) return fallback;
        scope = scope[keys[i]];
    }
    return scope;
};
export function getLanguageEntries() {
    return langEntries;
};
export async function setLanguage(lang){
    if(lang === localStorage.getItem('lang')) return;
    if(typeof lang !== 'string') throw new Error("Language must be a string!");
    localStorage.setItem('lang', lang);

    langEntries = (await import(getLangFilePath(lang))).default;
}

langEntries = (await import(getLangFilePath())).default;