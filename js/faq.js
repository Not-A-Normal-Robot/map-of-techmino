const faqSection = document.getElementsByClassName('faq')[0];
if(faqSection === undefined){
    console.error("Could not find FAQ section!");
    alert("ERROR: Could not find the FAQ section. Is faq.js being loaded on the wrong page?");
} else {
    fetch('../data/faq.json')
      .then(response => response.json())
      .then(faqObject => {
          if(faqSection === undefined){
              console.error("Could not find FAQ section!");
              alert("ERROR: Could not find the FAQ section. Is faq.js being loaded on the wrong page?");
          } else { addFAQEntries(faqObject); }
      });
}

function addFAQEntries(faqObject) {
    faqObject.forEach(entry => {
        faqSection.innerHTML += faqHTML(entry);
    });

    const questionHeaders = document.getElementsByClassName('question-header');
    for(let i = 0; i < questionHeaders.length; i++) {
        questionHeaders[i].addEventListener('click', () => {
            questionHeaders[i].parentElement.classList.toggle('expanded');
        });
    }
}

function faqHTML(entry) {
    return `<div class="question">
        <button class="question-header">
            <div class="question-icon-container">
                <svg class="question-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 14l5-5 5 5z"></path>
                </svg>
            </div>
            <h2 class="question-title">${entry.question}</h2>
        </button>
        <div class="answer">
            ${entry.answerHTML}
            <div class="answer-source">— ${entry.author}</div>
        </div>
    </div>`;
}