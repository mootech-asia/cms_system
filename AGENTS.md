# Repository instructions

Read and follow `CLAUDE.md` before changing this repository. Its instructions apply to the entire repository, including the section **主題美術與設計品質鐵則（整個 repo 適用）**. Visual acceptance is separate from functional checks; use actual rendered sizes and visible motion evidence. For `event/` work, also read `.claude/skills/event-workflow/SKILL.md`.

Do not delegate to subagents unless the user explicitly authorizes delegation for the current task.

Read and follow `docs/ASSET_STANDARD.md` before adding, moving, replacing, or removing any art/media. Use `ASSET_MANIFEST.json` and `docs/ASSETS.md` for IDs, purposes and specifications; run `python3 tools/assets.py check`. Respect recorded public/runtime path contracts and existing deployment roots; do not create fake assets or empty media directories.

Before starting work, read `HANDOFF.md` for project status, branch/deployment contracts, and Codex/Claude collaboration. Update its work log, validation evidence, blockers, and next steps at the end of each task.
