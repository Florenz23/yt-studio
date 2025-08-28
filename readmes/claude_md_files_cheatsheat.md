# Claude.md Cheatsheet

- Claude.md files are pretty much the same as cursor rules but more powerful
- When starting a project or continuing in an existing one, run /init
- What do you put inside a claude.md file?
    - Common bash commands (pnpm typecheck)
    - Core files and utility functions (`src/utils/api.js` - API client with auth)
    - Code style guidelines (Use camelCase for variables, max 100 chars per line)
    - Testing instructions (Run `npm test -- --coverage` for coverage reports)
    - Repository etiquette (Branch naming: `feature/user-auth`, always rebase before merge)
    - Developer environment setup (pyenv use 3.11.0, export NODE_ENV=development)
    - Any unexpected behaviors or warnings (API rate limit is 100 req/min, never commit `.env` files)
    - Other information you want Claude to remember (Client prefers TypeScript, deploy only on Fridays)
- Keep .md files updated
- Work with your claude.md files, iterate on them (a common mistake is adding extensive content without iterating on its effectiveness)
- You can add content to a claude.md file via # key
- We occasionally run `CLAUDE.md` files through the prompt improver: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver
- Use command/workflow instructions (e.g., format or typechecks) in claude.md files (e.g., package.json, see example)
- Use pro plan commands (prompt below)
- Enhance your claude.md files with high-level instructions, best practices, and patterns
- Use Claude Code to enhance claude.md files
- Have multiple claude.md files at different levels of your repo
- Use claude.md files to reference files instead of using them directly
- Take care with advanced prompt techniques (example below)

```jsx
"typecheck": "tsc --noEmit"
"format": "biome format --write ./src"
"check": "npm run lint && npm run typecheck"
```

```jsx
### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you Write the plan to .claude/tasks/TASK_NAME.md.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.
```

```jsx
Advanced Prompting Techniques
Power Keywords: Claude responds to certain keywords with enhanced behavior (information dense keywords):

IMPORTANT: Emphasizes critical instructions that should not be overlooked
Proactively: Encourages Claude to take initiative and suggest improvements
Ultra-think: Can trigger more thorough analysis (use sparingly)

Essential Prompt Engineering Tips

Avoid prompting for "production-ready" code - this often leads to over-engineering
Prompt Claude to write scripts to check its work: "After implementing, create a validation script"
Avoid backward compatibility unless specifically needed - Claude tends to preserve old code unnecessarily
Focus on clarity and specific requirements rather than vague quality descriptors
```