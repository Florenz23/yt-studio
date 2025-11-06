---
name: cheer-up-team-member
description: Cheer up a team member with a funny weather-based comment. Use when user says "cheer up" followed by a team member name like Luke, Anna, or Yuki.
---

# Cheer Up Team Member

Creates funny Slack messages based on team member's current weather.

## Steps:

1. Check team members and their cities in [team_member.md](team_member.md) (note: filename is singular)

2. Run the weather script using `python3` (not `python`):
```bash
cd /Users/flo/dev/personal/projects/next/yt-studio/.claude/skills/cheer-up-team/scripts && python3 get_weather.py CityName
```

3. Create a funny, encouraging Slack message based on the weather!
   - Keep it very short and concise, not longer than one sentence
   - Add some emojis
   - Reference their fun facts when appropriate 