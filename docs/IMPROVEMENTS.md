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
   projectId: (empty)
   expires: 1777923377608 (2026-05-04T19:36:17.608Z, 2h 14m ago)
   access: ya29...0211 (258 chars)
   refresh: 1//0...Cp0| (104 chars)
   antigravity: flash 80%, pro 20%, claude 0%, project example-project-123
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
   antigravity: flash 80%, pro 20%, claude 0%, project example-project-123

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
antigravity claude: beta@example.com
saved profiles: 2
running opencode processes: 1
recent sessions: 5
projectId: example-project-123
quota: flash 80%, pro 20%, claude 0%
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
[WARN] 1 running Opencode process

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
Restart requested: stopped 1 Opencode process and launched a fresh session.
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
