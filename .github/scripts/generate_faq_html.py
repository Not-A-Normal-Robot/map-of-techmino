import yaml
try:
    from yaml import CLoader as _Loader
except ImportError:
    from yaml import _Loader

# Constants
faq_yaml_location  = "data/faq.yaml"
faq_html_template_location  = "data/faq-template.html"
faq_html_output_location    = "faq.html"
template_insertion_location = "<INSERT_QUESTIONS>"

def faq_html(entry):
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
            {entry['answerHTML']}
            <div class="answer-source">— {entry['author']}</div>
        </div>
    </div>
    """

faq = yaml.load(open(faq_yaml_location, "r", encoding="utf-8"),Loader=_Loader)
html_template = open(faq_html_template_location, "r", encoding="utf-8").read()
text_to_insert = ""
for entry in faq:
    text_to_insert += faq_html(entry)

html_template = html_template.replace(template_insertion_location, text_to_insert)

open(faq_html_output_location, "w", encoding="utf-8").write(html_template)