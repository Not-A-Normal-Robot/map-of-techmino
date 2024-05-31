import * as DB from "./db.js";

let NSFWJSInstance = null;
{
    const ELEMENTS = {
        // <form>
        form: document.getElementById("profile-setup"),

        // <input type="file">
        profileImageInput: document.getElementById("pfp-input"),

        // <img>
        profileImagePreview: document.getElementById("pfp-preview"),

        // <input type="text">
        usernameInput: document.getElementById("username"),

        // <textarea>
        bioInput: document.getElementById("bio"),

        // <span>[]
        charCounters: document.getElementsByClassName("char-count"),

        // <button>
        submitButton: document.getElementById("submit-button"),

        // <span>
        progress: document.getElementById("progress")
    }

    // #region Handle profile image preview
    {
        ELEMENTS.profileImageInput.addEventListener("change", () => {
            const file = ELEMENTS.profileImageInput.files[0];
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
            const associatedId = counter.getAttribute("for");
            if(!associatedId) {
                console.error("No associated input found for: ", counter);
                continue;
            }
            
            const associatedInput = document.getElementById(associatedId);
            if(!associatedInput) {
                console.error("No input found with id: ", associatedId);
                continue;
            }

            associatedInput.addEventListener("input", function() {
                const maxChars = Number(associatedInput.getAttribute("maxlength") ?? Infinity);
                const currentChars = associatedInput.value.length;
                counter.textContent = `${currentChars} / ${maxChars}`;
            });

            const maxChars = Number(associatedInput.getAttribute("maxlength") ?? Infinity);
            const currentChars = associatedInput.value.length;
            counter.textContent = `${currentChars} / ${maxChars}`;
        }
    }
    // #endregion

    // #region Submit handler

    // I don"t feel comfortable typing out the full words
    const IS_SFW = {
        h: false,
        p: false,
        s: false,
        d: true,
        n: true
    }
    ELEMENTS.form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        ELEMENTS.submitButton.disabled = true;
        ELEMENTS.progress.textContent = "Processing...";

        let username = ELEMENTS.usernameInput.value;
        let bio = ELEMENTS.bioInput.value;
        const profileImageFile = ELEMENTS.profileImageInput.files[0];

        if(username.length < 3) {
            alert("Username must be at least 3 characters long.");
            return;
        }

        if(bio.trim().length === 0) bio = null;

        if(profileImageFile) {
            ELEMENTS.progress.textContent = "Loading profile picture...";
            
            let imageData;
            { // Get image data from file
                const img = new Image();
                img.src = URL.createObjectURL(profileImageFile);
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });

                const canvas = document.createElement("canvas");
                canvas.width = img.width; canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                imageData = ctx.getImageData(0, 0, img.width, img.height);
            }

            ELEMENTS.progress.textContent = "Checking profile picture...";
            const nsfwResult = await NSFWJSInstance.classify(imageData, 1);

            if(!IS_SFW[nsfwResult[0].className.charAt(0).toLowerCase()]) {
                ELEMENTS.submitButton.disabled = false;
                ELEMENTS.progress.textContent = "Profile picture image is determined to be not safe for work. Please upload a different image.";
                return;
            }
            ELEMENTS.progress.textContent = `Image classified as ${nsfwResult[0].className}.`;
            ELEMENTS.submitButton.disabled = false; // DEBUG
        }
    });
    // #endregion
}
NSFWJSInstance = await nsfwjs.load("MobileNetV2");