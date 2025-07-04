---
mode: "agent"
tools: ["codebase", "terminal"]
description: "Generate a Conventional Commit message from staged changes"
---

# Git Commit Assistant

You are a senior software engineering assistant.

Your task is to:

1. Use only the Git staged changes, obtained with:
   git --no-pager diff --cached
2. Do not use chat context, memory, or any prior conversation. Only analyze the output of git diff --cached.
3. Generate a Git commit message and extended description that strictly follows the Conventional Commits specification.

## Output format

Commit Message (subject):

<type>: <short description>

Subject line | 50 characters max | Lowercase type

Extended Description (body):

- What was changed
- Why the change was made
- Any relevant context or issue references (e.g. Closes #123)
- Body line wrap: 72 characters max: Markdown-friendly.
- Total body: ~10–15 lines max.

Give the Git Commit Command in a textarea to simplify copy:

git commit -m "<type>: <short description>" -m "<extended description>"

## Allowed commit types

Use only one of the following types:

feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

## Notes

- Use only staged changes from git diff --cached
- Do not assume context or remember anything from the chat
- Follow Conventional Commit format exactly
