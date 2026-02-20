---
description: |
  This workflow creates weekly repo status reports. It gathers recent repository
  activity (issues, PRs, discussions, releases, code changes) and generates
  engaging GitHub issues with productivity insights, community highlights,
  and project recommendations.

on:
  schedule: weekly
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    # If in a public repo, setting `lockdown: false` allows
    # reading issues, pull requests and comments from 3rd-parties
    # If in a private repo this has no particular effect.
    lockdown: false

safe-outputs:
  create-issue:
    title-prefix: "[repo-status] "
    labels: [report, weekly-status]
source: githubnext/agentics/workflows/weekly-repo-status.md@acea14d65af123c315230221b409f4f435b3706f
engine: copilot
---

# Weekly Repo Status

Create an upbeat weekly status report for the repo as a GitHub issue.

## What to include

- Recent repository activity (issues, PRs, discussions, releases, code changes)
- Progress tracking, goal reminders and highlights
- Project status and recommendations
- Actionable next steps for maintainers

## Style

- The title should follow this pattern "Weekly Status Report #1 - Week of February 17-23, 2026"
- Be positive, encouraging, and helpful 🌟
- Use emojis moderately for engagement. 
- If you use emoji at the beginning of a sentence, it should follow this format: ":emoji: | text".
- Keep it concise - adjust length based on actual activity

## Process

1. Gather recent activity from the repository
2. Study the repository, its issues and its pull requests
3. Create a new GitHub issue with your findings and insights