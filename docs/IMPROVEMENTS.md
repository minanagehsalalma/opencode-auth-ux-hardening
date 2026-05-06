# Improvements

This file shows the exact user-facing improvements that were added, what each one is for, and a concrete example.

## 1. Drift-Aware `auth list`

What for:
Expose the current auth file and warn when the plugin store disagrees.

Command:

```powershell
opencode auth list
```

Example:

```text
Credentials <HOME>\.local\share\opencode\auth.json

Warning: Antigravity gemini active account is beta@example.com, but auth.json is alpha@example.com.
Use `opencode auth switch` or `opencode auth repair` to sync both stores.

1. google
   type: oauth
   email: alpha@example.com
   projectId: example-project-123
   expires: 1777923377608 (2026-05-04T19:36:17.608Z, 2h 14m ago)
   access: ya29...0211 (258 chars)
   refresh: 1//0...Cp0| (104 chars)
   antigravity: flash 20%, pro 100%, claude 100%, project example-project-123
```

## 2. Interactive `auth switch`

What for:
Switch profiles without remembering exact names.

Command:

```powershell
opencode auth switch
```

Example:

```text
Select a profile to switch to:

1. personal [profile-active, gemini-active]
   savedAt: 2026-05-05T12:08:09.884Z
   google: oauth, alpha@example.com, project example-project-123
   antigravity: flash 20%, pro 100%, claude 100%, project example-project-123

2. backup [no-antigravity]
   savedAt: 2026-05-05T12:08:31.905Z
   google: oauth, gamma@example.com

Select profile by number or name: 1
Switched active credentials to profile: personal
Synced Antigravity gemini active account to: alpha@example.com
```

## 3. `auth current`

What for:
Show the real active state across profile, auth file, plugin store, and runtime.

Command:

```powershell
opencode auth current
```

Example:

```text
Auth Current

profile: personal
auth.json: alpha@example.com
antigravity gemini: alpha@example.com
antigravity claude: alpha@example.com
saved profiles: 2
running opencode processes: 1
recent sessions: 5
projectId: example-project-123
quota: flash 20%, pro 100%, claude 100%

drift:
  [WARN] Access token expired 2h 14m ago, but a refresh token exists.

note: live OpenCode sessions may need restart to pick up account changes.
```

## 4. `auth doctor`

What for:
Run explicit consistency checks and give repair guidance.

Command:

```powershell
opencode auth doctor
```

Example:

```text
Auth Doctor

[OK] auth.json loaded for alpha@example.com
[OK] 2 saved profiles
[OK] 2 Antigravity accounts
[OK] Gemini active account: alpha@example.com
[OK] auth.json projectId: example-project-123
[WARN] Access token expired 2h 14m ago
[WARN] 1 running OpenCode process

recommended:
  - Use `opencode auth switch --restart` after changing accounts.
  - Refresh via login flow if commands start failing.
```

## 5. `auth repair`

What for:
Fix the common drift cases without manual JSON editing.

Command:

```powershell
opencode auth repair
```

Example:

```text
Auth Repair

- synced Antigravity Gemini active account to alpha@example.com
- backfilled auth.json projectId to example-project-123
- set active profile to personal
```

## 6. Save From Antigravity

What for:
Create a profile directly from the plugin-managed account store.

Command:

```powershell
opencode auth save team-a --from-antigravity
```

Example:

```text
Saved Antigravity credentials as profile: team-a
```

## 7. Profile Management

What for:
Manage named auth states without hand-editing JSON.

Commands:

```powershell
opencode auth clone personal team-a
opencode auth rename team-a team-a-prod
opencode auth delete team-a-prod
```

Example:

```text
Cloned auth profile personal -> team-a
Renamed auth profile team-a -> team-a-prod
Deleted auth profile: team-a-prod
```

## 8. Family-Aware Switching

What for:
Allow plugin-family-specific active account sync instead of assuming one global active account.

Command:

```powershell
opencode auth switch personal --family claude
```

Example:

```text
Switched active credentials to profile: personal
Synced Antigravity claude active account to: alpha@example.com
```

## 9. Restart-Aware Switching

What for:
Make runtime rebinding explicit. Future state changes are cheap; live session rebinding is not.

Command:

```powershell
opencode auth switch personal --restart
```

Example:

```text
Switched active credentials to profile: personal
Synced Antigravity gemini active account to: alpha@example.com
Restart requested: stopped 1 OpenCode process and launched a fresh session.
```

## 10. Launch-Time Warning

What for:
Warn before a new session starts in a drifted state.

Command:

```powershell
opencode
```

Example:

```text
[auth] Warning: Antigravity Gemini is beta@example.com, auth.json is alpha@example.com.
[auth] Run `opencode auth repair` or `opencode auth switch --restart` before starting a new session.
```

## 11. Smart Model Picker

What for:
Turn the picker into a state board instead of a static list.

Behavior:

- Google model labels are rewritten from quota buckets and cooldown timers.
- Favorites are reordered toward the most useful live options.
- Models that are temporarily waiting can still stay visible.

Example:

```text
Favorites

• [READY bucket 20%] Gemini 3.1 Pro (Antigravity) Google
  [READY bucket 20%] Gemini 3.1 Pro Google
  [READY bucket 100%] Gemini 2.5 Flash Google
  [WAIT model 6d 18h] Claude Sonnet 4.6 (Antigravity) Google
  [WAIT model 6d 18h] Gemini 3 Flash (Antigravity) Google
  [WAIT model 6d 18h] Gemini 3 Flash Preview Google
  [FREE GLM] GLM-5.1 (NVIDIA NIM)
  [FREE GLM] GLM-5.1 (Puter)
  [FREE FAST] GPT-5 Nano
```

## 12. Cooldown-Aware Flash Surfacing

What for:
Keep flash models in the picker when the quota window has not reset yet.

Why it matters:

- these models used to work
- they will work again after the reset
- hiding them entirely makes the picker lie about future availability

Example labels:

```text
[WAIT model 6d 18h] Gemini 3 Flash Preview
[WAIT model 6d 18h] Gemini 3 Flash (Antigravity)
[READY bucket 100%] Gemini 2.5 Flash
```

## 13. Self-Updating Interactive Refresh

What for:
Avoid stale model-state labels during a long interactive session.

Behavior:

- interactive launches start a background refresh loop
- the loop re-reads Antigravity quota and cooldown metadata every 60 seconds
- the loop rewrites picker state for up to 6 hours

Practical result:

```text
quota reset passes -> picker labels move from WAIT to READY without another manual patch
```

## 14. Fallback Routing

What for:
Keep the experience usable when a quota-backed provider is cooling down or slow.

Behavior:

- safe `small_model` is moved to a cheap fallback
- GLM providers are kept close to the top
- free fast models are labeled explicitly

Example:

```text
small_model: opencode/gpt-5-nano
fallbacks: glm-nvidia/glm-5.1, glm-puter/glm-5.1, opencode/minimax-m2.5-free
```

## 15. Smart Launch Routing

What for:
Stop stale session defaults from forcing a cooling-down model on the next launch.

Behavior:

- if the user does not explicitly pass `-m`, the launcher computes the best live model from current quota state
- `opencode run` gets smart model plus safe default variant injection
- interactive or session-resume launches get smart model injection without forced variant args
- utility commands such as `opencode models` stay untouched

Practical result:

```text
Claude can remain visible as WAIT, but a fresh launch should route to a live Gemini model instead of dying on Claude first.
```

## 16. Local Gateway Offline Awareness

What for:
Stop presenting a dead local gateway as if it were a ready model.

Example:

```text
[LOCAL OFFLINE] GLM-5.1 (Gateway)
```

When the gateway comes back, the same slot can be labeled live again.

## 17. Plugin Runtime Companion

What for:
Make the plugin behave sanely with the launcher's smarter auth and picker logic.

Companion config behaviors:

- sticky account selection
- short rate-limit waits
- proactive token refresh
- session recovery
- tool ID recovery
- Claude tool hardening

Example:

```json
{
  "account_selection_strategy": "sticky",
  "switch_on_first_rate_limit": true,
  "session_recovery": true,
  "auto_update": true,
  "max_rate_limit_wait_seconds": 90,
  "proactive_token_refresh": true
}
```
