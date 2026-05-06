# Apply The Patch

This repo includes a reusable patch flow for `opencode-ai@1.14.31`.

## What It Changes

The published launcher artifact adds two layers of behavior:

1. Auth hardening
   - richer `auth list`
   - interactive `auth switch`
   - profile save, clone, rename, and delete
   - `auth current`
   - `auth doctor`
   - `auth repair`
   - Antigravity-aware syncing
   - launch-time drift warnings
   - explicit `--restart` handling

2. Model-picker hardening
   - Google model allowlist and dead-model blacklist
   - bucket-aware `READY` and exact-cooldown `WAIT model ...` labels
   - flash-model surfacing even while waiting for reset
   - GLM and free fallback labeling
   - local gateway live/offline labeling
   - automatic `small_model` steering to a safe fallback
   - startup-time smart model selection that routes away from long-cooldown defaults
   - model favorites rewritten from live state
   - a background refresh loop for interactive sessions

The repo artifact is sanitized and uses generic Python discovery for runtime inspection instead of a machine-specific path.

## Apply

From the repo root:

```powershell
node scripts/apply-opencode-auth-ux-patch.mjs
```

If your global npm package root is nonstandard:

```powershell
node scripts/apply-opencode-auth-ux-patch.mjs --target "C:\Users\you\AppData\Roaming\npm\node_modules\opencode-ai"
```

## Inspect Before Applying

These files show the exact delta:

- `patches/opencode-ai-1.14.31-auth-ux.patch`
- `vendor/upstream/opencode-ai/1.14.31/bin/opencode`
- `artifacts/opencode-ai/1.14.31/bin/opencode`

## Verify After Applying

Useful checks:

```powershell
opencode auth current
opencode auth doctor
opencode models
```

Interactive verification:

1. close any already-running `opencode` session
2. relaunch `opencode`
3. open the model picker
4. confirm the picker shows `READY`, `WAIT`, `FREE GLM`, `FREE FAST`, or `LOCAL OFFLINE` labels

Important nuance:

- utility commands like `opencode models` should remain untouched
- smart model injection should apply only to real launches
- default variant injection should apply only to `opencode run`

The refresh loop runs only for interactive launches. CLI-only commands do not need a long-lived background refresher.

## Restore

The installer creates a backup named:

```text
bin/opencode.upstream-backup.1.14.31
```

Restore it with:

```powershell
node scripts/apply-opencode-auth-ux-patch.mjs --restore
```

## Version Guard

By default the installer only patches `opencode-ai@1.14.31`.

If you want to override that:

```powershell
node scripts/apply-opencode-auth-ux-patch.mjs --force
```

That disables the version safety check, so inspect the diff first.
