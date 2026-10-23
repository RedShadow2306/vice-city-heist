import re

with open('src/utils/gameRules.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CAMPAIGN_LEVELS
content = re.sub(
    r'(1:\s*\{[^}]*?rules:\s*)15(,\s*cumulativeRules:\s*)15',
    r'\g<1>20\g<2>20',
    content
)
content = re.sub(
    r'(2:\s*\{[^}]*?rules:\s*)18(,\s*cumulativeRules:\s*)33',
    r'\g<1>20\g<2>40',
    content
)
content = re.sub(
    r'(3:\s*\{[^}]*?rules:\s*)21(,\s*cumulativeRules:\s*)54',
    r'\g<1>20\g<2>60',
    content
)
content = re.sub(
    r'(4:\s*\{[^}]*?rules:\s*)26(,\s*cumulativeRules:\s*)80',
    r'\g<1>20\g<2>80',
    content
)

# 2. Update level headers
content = content.replace('LEVEL 1: TELLERS GATE (Rules 1 - 15) [15 Rules · 15 Minutes]', 'LEVEL 1: TELLERS GATE (Rules 1 - 20) [20 Rules · 15 Minutes]')
content = content.replace('LEVEL 2: EXECUTIVE CASH CORRIDORS (Rules 16 - 33) [18 Rules · 13 Minutes]', 'LEVEL 2: EXECUTIVE CASH CORRIDORS (Rules 21 - 40) [20 Rules · 13 Minutes]')
content = content.replace('LEVEL 3: TITANIUM DEEP VAULT (Rules 34 - 54) [21 Rules · 11 Minutes]', 'LEVEL 3: TITANIUM DEEP VAULT (Rules 41 - 60) [20 Rules · 11 Minutes]')
content = content.replace('LEVEL 4: OMEGA QUANTUM CORE (Rules 55 - 80) [26 Rules · 9 Minutes]', 'LEVEL 4: OMEGA QUANTUM CORE (Rules 61 - 80) [20 Rules · 9 Minutes]')

# 3. Update level assignment for each rule based on its id: 1..20 -> 1, 21..40 -> 2, 41..60 -> 3, 61..80 -> 4
def update_rule(match):
    rule_id = int(match.group(1))
    if 1 <= rule_id <= 20:
        new_lvl = 1
        new_sec = 'Outer Lobby & Tellers Gate'
    elif 21 <= rule_id <= 40:
        new_lvl = 2
        new_sec = 'Executive Cash Corridors'
    elif 41 <= rule_id <= 60:
        new_lvl = 3
        new_sec = 'Titanium Deep Vault'
    else:
        new_lvl = 4
        new_sec = 'Omega Quantum Core'
    
    return f'id: {rule_id},\n      level: {new_lvl},\n      section: "{new_sec}"'

content = re.sub(r'id:\s*(\d+),\s*level:\s*\d+,\s*section:\s*"[^"]+"', update_rule, content)

with open('src/utils/gameRules.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated gameRules.js successfully!')
