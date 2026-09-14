import re

with open('src/data/destinations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Only match inside DESTINATIONS array (before RECENT_BOOKINGS)
dest_part = content.split('export const RECENT_BOOKINGS')[0]

ids = re.findall(r"id:\s*'([^']+)'", dest_part)
states = re.findall(r"state:\s*'([^']+)'", dest_part)
names = re.findall(r"name:\s*'([^']+)'", dest_part)

print(f"Total destinations: {len(ids)}")
print(f"Unique IDs: {len(set(ids))}")
print(f"Unique states: {len(set(states))}")
print("States list:")
for s in sorted(list(set(states))):
    print(" -", s)
