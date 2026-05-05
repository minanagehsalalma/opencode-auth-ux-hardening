# Plugin Companion

This repo depends on the Antigravity auth plugin's account-store behavior, but it does not modify the plugin code itself.

## Result

- installed package checked: `opencode-antigravity-auth@1.6.5-beta.0`
- local installed plugin: byte-identical to npm upstream
- launcher patch: real code patch
- plugin patch: none

That distinction matters. The account-switching UX fix lives in the `opencode` launcher and synchronizes the plugin-managed account store. The plugin already exposes the state model the launcher needs:

- `antigravity-accounts.json`
- `activeIndex`
- `activeIndexByFamily`
- `projectId`
- cached quota metadata

## Why Include Plugin Material At All

Other users need the exact working combination:

- `opencode-ai@1.14.31`
- `opencode-antigravity-auth@1.6.5-beta.0`

This repo therefore includes:

- plugin attribution
- plugin version pinning
- a verification script
- upstream plugin metadata

## Exact Verification Example

```powershell
node scripts/verify-antigravity-plugin.mjs
```

Example result:

```text
Plugin verification passed
package: opencode-antigravity-auth@1.6.5-beta.0
installed plugin.js sha256: 3DA3651908AC2FB8F2FA10F3ABAC83CE75FE0E0142E8AC3BC8A13B70C88A6D04
upstream plugin.js sha256:  3DA3651908AC2FB8F2FA10F3ABAC83CE75FE0E0142E8AC3BC8A13B70C88A6D04
```

## Practical Meaning

If users want the improved experience from this repo:

1. Keep the plugin at the verified upstream version.
2. Apply the launcher patch from this repo.
3. Let the launcher sync `auth.json` with the plugin's account store.
