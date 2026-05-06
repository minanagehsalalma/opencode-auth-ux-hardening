# Changelog

## 0.2.0 - 2026-05-06

- refreshed the shipped `opencode-ai@1.14.31` launcher artifact to match the newer local patch
- regenerated the published unified diff so the repo matches the actual launcher behavior
- expanded the repo scope from auth-only hardening to auth plus model-picker hardening
- documented quota-aware `READY` and cooldown-aware `WAIT` model labels
- documented the interactive background refresh loop for picker state
- documented GLM and free fallback routing plus local gateway offline awareness
- documented the plugin runtime companion config alongside the unchanged upstream plugin package
- added redacted examples for `antigravity.json` and smart model-picker output
- updated the README and architecture docs to describe the full multi-store, multi-state flow

## 0.1.0 - 2026-05-05

- documented the multi-store auth problem between `auth.json` and the Antigravity plugin store
- added exact examples for drift-aware listing, switching, doctor, repair, and restart-aware flows
- added redacted sample state files and outputs
- added research references for CLI auth UX patterns
- added a vendored upstream `opencode-ai@1.14.31` launcher for comparison
- added a sanitized patched launcher artifact with generic Python discovery
- added a reusable installer/restore script for applying the patch to a real global install
- added an inspectable unified diff under `patches/`
- added a verified Antigravity plugin companion workflow and upstream hash check
- added explicit upstream attribution for OpenCode and `opencode-antigravity-auth`
- added a repo hero image for public presentation
