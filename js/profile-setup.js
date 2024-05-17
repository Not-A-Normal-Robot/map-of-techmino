import { SUPABASE } from "./db";

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