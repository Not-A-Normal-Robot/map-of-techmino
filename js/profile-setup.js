import { SUPABASE } from "./db.js";
import * as nsfwjs from "https://cdn.jsdelivr.net/npm/nsfwjs@4.1.0/+esm";
import "https://cdn.jsdelivr.net/npm/models/mobilenet_v2/model.min.js";

let NSFWJSInstance = null;

{ // Counter for character count
    for(const counter of document.getElementsByClassName('char-count')) {
        const associatedId = counter.getAttribute('for');
        if(!associatedId) {
            console.error('No associated input found for: ', counter);
            continue;
        }
        
        const associatedInput = document.getElementById(associatedId);
        if(!associatedInput) {
            console.error('No input found with id: ', associatedId);
            continue;
        }

        associatedInput.addEventListener('input', () => updateCounter(counter));
        updateCounter(counter);
    }

    function updateCounter(element) {
        const associatedId = element.getAttribute('for');
        if(!associatedId) {
            console.error('No associated input found for: ', element);
            return;
        }
        
        const associatedInput = document.getElementById(associatedId);
        if(!associatedInput) {
            console.error('No input found with id: ', associatedId);
            return;
        }

        const maxChars = Number(associatedInput.getAttribute('maxlength') ?? Infinity);
        const currentChars = associatedInput.value.length;
        element.textContent = `${currentChars} / ${maxChars}`;
    }
}

{ // Handle profile image upload
    const profileImageInput = document.getElementById('pfp-input');
    profileImageInput?.addEventListener('change', () => {
        const file = profileImageInput.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const image = document.getElementById('pfp-preview');
            if(image) {
                image.src = reader.result;
            }
        };
        reader.readAsDataURL(file);
    });
}

{ // Handle NSFWJS
    const MODEL_TYPE = "MobileNetV2";
    const INDEXEDDB_MODEL_KEY = "nsfwjs-model";
    async function loadNSFWJS() {
        if(!("indexedDB" in window)) {
            NSFWJSInstance = await nsfwjs.load(MODEL_TYPE);
            return;
        }

        if(await isModelCached()) {
            const cachedInstance = await nsfwjs.load(`indexeddb://${INDEXEDDB_MODEL_KEY}`);
            if(cachedInstance) {
                NSFWJSInstance = cachedInstance;
                return;
            }
        }

        const instance = await nsfwjs.load(MODEL_TYPE);
        await instance.model.save(`indexeddb://${INDEXEDDB_MODEL_KEY}`);

        NSFWJSInstance = instance;
    }

    async function isModelCached() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("tensorflowjs");

            openRequest.onupgradeneeded = () => {
                // The database did not previously exist, so it means the model is not saved
                resolve(false);
            };

            openRequest.onsuccess = () => {
                const db = openRequest.result;
                const transaction = db.transaction("model_info_store", "readonly"); // tensorflow.js uses this object store name
                const store = transaction.objectStore("model_info_store");
                const getRequest = store.get(INDEXEDDB_MODEL_KEY);

                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                };

                getRequest.onerror = () => {
                    reject(getRequest.error);
                };
            };

            openRequest.onerror = () => {
                reject(openRequest.error);
            };
        });
    }

    loadNSFWJS();
}