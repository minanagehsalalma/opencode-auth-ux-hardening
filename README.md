# Opencode Auth UX Hardening

Sanitized documentation and reference material for a multi-store auth UX cleanup around `opencode` plus the `opencode-antigravity-auth` plugin.

This repo documents the exact improvements that were implemented locally to make account switching, drift detection, diagnostics, and runtime behavior much smoother.

## Problem

The user-facing auth file and the plugin-facing auth store could drift:

- `auth.json` said one Google account was active
- the Antigravity plugin store said another account was active
- the TUI showed the plugin account, which made switching feel broken

The fix was to treat auth as a multi-store system and make that state explicit, inspectable, and repairable.

## What Was Improved

| Improvement | What It Is For | Exact Example |
|---|---|---|
| Drift-aware `auth list` | Shows the current credential plus warns if plugin state disagrees | `opencode auth list` |
| Interactive switching | Lets users switch by picker instead of remembering names | `opencode auth switch` |
| `auth current` | Shows the real active state across profile, auth file, plugin store, and runtime | `opencode auth current` |
| `auth doctor` | Runs consistency checks and prints repair hints | `opencode auth doctor` |
| `auth repair` | Fixes common drift automatically | `opencode auth repair` |
| Antigravity-aware sync | Updates the actual plugin store, not just `auth.json` | `opencode auth switch personal --family gemini` |
| Profile management | Adds save, clone, rename, and delete flows | `opencode auth save team-a --from-antigravity` |
| Family-aware switching | Supports plugin families like Gemini vs Claude | `opencode auth switch personal --family claude` |
| Restart-aware switching | Makes runtime rebinding explicit instead of silently changing live sessions | `opencode auth switch personal --restart` |
| Launch-time warning | Warns before a new session starts with drifted auth state | `opencode` |

## Quick Examples

```powershell
opencode auth current
opencode auth doctor
opencode auth repair
opencode auth switch personal --restart
```

Example `auth current` output:

```text
Auth Current

profile: personal
auth.json: alpha@example.com
antigravity gemini: alpha@example.com
antigravity claude: beta@example.com
saved profiles: 2
running opencode processes: 1
recent sessions: 5
projectId: example-project-123
quota: flash 80%, pro 20%, claude 0%

drift:
  [WARN] Access token expired 2h 14m ago, but a refresh token exists.

note: live Opencode sessions may need restart to pick up account changes.
```

## Repo Layout

- [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md): exact example for each improvement and what it is for
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): store layout, runtime flow, and switching model
- [docs/RESEARCH.md](docs/RESEARCH.md): external patterns used as a quality check
- [examples/state](examples/state): redacted example auth stores
- [examples/output](examples/output): redacted command outputs

## Privacy

Everything in this repo is redacted:

- email addresses use placeholders like `alpha@example.com`
- project IDs are synthetic
- tokens are fake
- local paths use `<HOME>` or placeholder Windows paths

See [docs/PRIVACY.md](docs/PRIVACY.md).

## Why This Approach

The implementation was checked against established patterns from:

- GitHub CLI multi-account auth
- Google Cloud CLI configurations
- 1Password CLI multiple accounts
- npm/Homebrew doctor-style diagnostics

Details and links are in [docs/RESEARCH.md](docs/RESEARCH.md).

## License

[MIT](LICENSE)
