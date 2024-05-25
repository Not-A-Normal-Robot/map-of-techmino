import { SUPABASE } from "./db.js";

let NSFWJSInstance = null;
{
    const ELEMENTS = {
        form: document.getElementById('profile-setup'),
        profileImageInput: document.getElementById('pfp-input'),
        profileImagePreview: document.getElementById('pfp-preview'),
        usernameInput: document.getElementById('username'),
        bioInput: document.getElementById('bio'),
        charCounters: document.getElementsByClassName('char-count'),
    }

    // #region Handle profile image preview
    {
        ELEMENTS.profileImageInput?.addEventListener('change', () => {
            const file = profileImageInput.files[0];
            if(!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                ELEMENTS.profileImagePreview.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }
    // #endregion

    // #region Char counter
    {
        for(const counter of ELEMENTS.charCounters) {
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

            associatedInput.addEventListener('input', function() {
                const maxChars = Number(associatedInput.getAttribute('maxlength') ?? Infinity);
                const currentChars = associatedInput.value.length;
                counter.textContent = `${currentChars} / ${maxChars}`;
            });
            updateCounter(counter);
        }
    }
    // #endregion
}
NSFWJSInstance = await nsfwjs.load("MobileNetV2");