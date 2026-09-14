import re

path = r"c:\Users\Acer\Documents\antigravity\peaceful-volta\travel-assistant\src\data\destinations.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Match each object in DESTINATIONS
dest_blocks = re.findall(r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',.*?bestSeason:\s*'([^']+)'", content, re.DOTALL)

print(f"Total destinations found: {len(dest_blocks)}")
for d_id, name, season in dest_blocks:
    print(f"{d_id:15} | {name[:30]:30} | {season}")
