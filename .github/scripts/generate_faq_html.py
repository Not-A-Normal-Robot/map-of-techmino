import json

# Constants
faq_json_location = "data/faq.json"
faq_html_template_location = "data/faq.html.template"
faq_html_output_location = "faq.html"
template_insertion_location = "<INSERT_QUESTIONS>"

def faq_html(entry):
    if not entry.get("question") or not entry.get("answer"):
        return ""

    author = entry.get("author", "Unknown")
    return f"""
    <div class="question">
        <button class="question-header">
            <div class="question-icon-container">
                <svg class="question-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 14l5-5 5 5z"></path>
                </svg>
            </div>
            <h2 class="question-title">{entry['question']}</h2>
        </button>
        <div class="answer">
            {entry['answer']}
            <div class="answer-source">— {author}</div>
        </div>
    </div>
    """

faq = json.load(open(faq_json_location, "r"))
html_template = open(faq_html_template_location, "r").read()
text_to_insert = ""
for entry in faq:
    text_to_insert += faq_html(entry)

html_template = html_template.replace(template_insertion_location, text_to_insert)

open(faq_html_output_location, "w").write(html_template)