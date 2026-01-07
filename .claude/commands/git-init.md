
nano ~/.claude/commands/git-init.md

---
allowed-tools: Bash(git init:*), Bash(git remote:*), Bash(git add:*), Bash(git commit:*), Bash(ls:*), Bash(cat:*)
argument-hint: [remote-url]
description: Initialize a git repository and optionally add remote
---

## Your task

1. Initialize a new git repository with `git init`
2. If a remote URL is provided ($ARGUMENTS), add it as origin: `git remote add origin <url>`
3. Create an initial commit if there are files to commit:
   - Stage all files with `git add -A`
   - Create initial commit with message "Initial commit"
4. Report what was done
