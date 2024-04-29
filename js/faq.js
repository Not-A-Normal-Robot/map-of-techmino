{
    const faqLastUpdatedElement = document.getElementById('last-updated');
    if(faqLastUpdatedElement !== undefined) {
        // fetch github api to get date of last edit of FAQ
        fetch('https://api.github.com/repos/techmino-hub/techmino-hub.github.io/commits?path=faq.html')
        .then(response => response.json())
        .then(json => {
            const lastUpdated = new Date(json[0].commit.committer.date);
            const currentDate = new Date();
            const timeDifference = currentDate - lastUpdated;
            let formattedDate;

            if (timeDifference < 60 * 60 * 1000) {
                const minutes = Math.floor(timeDifference / (60 * 1000));
                formattedDate = `${minutes} minutes ago`;
            } else if (timeDifference < 24 * 60 * 60 * 1000) {
                const hours = Math.floor(timeDifference / (60 * 60 * 1000));
                formattedDate = `${hours} hours ago`;
            } else {
                formattedDate = lastUpdated.toLocaleDateString('en-US', {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            }

            faqLastUpdatedElement.innerText = "Last updated: " + formattedDate;
        });
    }

    // Add button listeners
    const questionHeaders = document.getElementsByClassName('question-header');
    for(let i = 0; i < questionHeaders.length; i++) {
        questionHeaders[i].addEventListener('click', () => {
            questionHeaders[i].parentElement.classList.toggle('expanded');
        });
    }

    // Add radio listeners
    for(const radioElement of document.getElementsByClassName('tag-filter')[0].getElementsByTagName('input')) {
        radioElement.addEventListener('change', () => {
            handleFilterUpdate(radioElement.name, radioElement.value);
        });
    }

    function handleFilterUpdate(tag, mode) {
        tag = tag.trim().toLowerCase();
        mode = mode.trim().toLowerCase();

        const faqElement = document.getElementsByClassName('faq')[0];

        if(mode === "all") {
            faqElement.classList.remove(`show-${tag}`);
            faqElement.classList.remove(`hide-${tag}`);
        } else if(mode === "include") {
            faqElement.classList.remove(`hide-${tag}`);
            faqElement.classList.add(`show-${tag}`);
        } else if(mode === "exclude") {
            faqElement.classList.remove(`show-${tag}`);
            faqElement.classList.add(`hide-${tag}`);
        } else {
            console.error(`Invalid filter mode: ${mode}`);
        }
    }
}