# Apply The Patch

This repo includes a reusable patch flow for `opencode-ai@1.14.31`.

## What It Changes

The patch replaces the installed `bin/opencode` launcher with a version that adds:

- richer `auth list`
- interactive `auth switch`
- profile save, clone, rename, and delete
- `auth current`
- `auth doctor`
- `auth repair`
- Antigravity-aware syncing
- launch-time drift warnings
- explicit `--restart` handling

The published artifact is sanitized and uses generic Python discovery for session inspection instead of a machine-specific path.

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

That disables the version safety check, so review the patch first.
