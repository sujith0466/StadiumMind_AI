import re

file_path = "src/context/LanguageContext.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_keys = [
    '"Est. Time"', '"min"', '"Confidence"', '"Crowd Density"', '"Low"', '"Accessibility"', '"ADA Certified"', 
    '"Verified Live • Grounded Stadium Knowledge"', '"Voice Output Audio"', '"Copy response"', 
    '"Helpful response"', '"Needs improvement"', '"Help me"', '"Regenerate response"', '"Toggle speech input"', 
    '"Speech input"', '"Select any stage to view live synchronized recommendations and venue SLAs"', '"Ready"', 
    '"ACTIVE STAGE TELEMETRY"', '"GUIDANCE"', '"Predictive AI wayfinding and synchronized venue recommendations."', '"SLA ACTIVE"'
]

def append_to_dict(match):
    dict_content = match.group(1)
    # create new entries
    additions = []
    for key in new_keys:
        additions.append(f"    {key}: {key}")
    return dict_content + ",\n" + ",\n".join(additions) + "\n  }"

# This regex matches the end of each language dictionary
# e.g., "Ask the AI Stadium Concierge..."\n  }
# We want to insert right before the closing brace
content = re.sub(r'(    "[^"]+": "[^"]+"\n  )}', append_to_dict, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated LanguageContext.tsx")
