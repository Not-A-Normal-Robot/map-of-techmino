import yaml
try:
    from yaml import CLoader as _Loader
except ImportError:
    from yaml import Loader  as _Loader

# Constants
faq_yaml_location  = "data/faq.yaml"
faq_html_template_location  = "data/faq-template.html"
faq_html_output_location    = "faq.html"
template_insertion_location = "<INSERT_QUESTIONS>"
tags_map = {
    "techmino": "<span class=\"tag techmino\">Techmino</span>",
    "galaxy": "<span class=\"tag galaxy\">Tech. Galaxy</span>",
    "linux": "<span class=\"tag linux\">Linux</span>",
    "apple": "<span class=\"tag apple\">Mac/iOS</span>",
    "multiplayer": "<span class=\"tag multiplayer\">Multiplayer</span>",
    "error": "<span class=\"tag error\">Error</span>",
    "bot": "<span class=\"tag bot\">ColdClear/9S</span>"
}

# Sample question
# <details class="question" name="faq">
#     <summary>
#         Question
#         <span class="tags">
#             <span class="tag techmino">Techmino</span>
#             <span class="tag galaxy">Galaxy</span>
#             <span class="tag linux">Linux</span>
#             <span class="tag apple">Mac/iOS</span>
#             <span class="tag multiplayer">Multiplayer</span>
#             <span class="tag error">Error</span>
#             <span class="tag bot">ColdClear/9S</span>
#         </span>
#     </summary>
#     <article>
#         <p>Answer</p>
#         <div class="answer-source">— I made it up</div>
#     </article>
# </details>

def tags_html(entry):
    tags = entry['tags']
    tags_html = ""
    for tag in tags:
        if tag in tags_map:
            tags_html += tags_map[tag]
    return tags_html

def faq_html(entry):
    return f"""
    <details class="question" name="faq">
        <summary>
            {entry['question']}
            <span class="tags">
                {tags_html(entry)}
            </span>
        </summary>
        <article>
            {entry['answerHTML']}
            <div class="answer-source">— {entry['author']}</div>
        </article>
    </details>
    """

faq = yaml.load(open(faq_yaml_location, "r", encoding="utf-8"),Loader=_Loader)
html_template = open(faq_html_template_location, "r", encoding="utf-8").read()
text_to_insert = ""
for entry in faq:
    text_to_insert += faq_html(entry)

html_template = html_template.replace(template_insertion_location, text_to_insert)

open(faq_html_output_location, "w", encoding="utf-8").write(html_template)