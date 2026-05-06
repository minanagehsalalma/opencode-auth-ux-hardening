# Plugin Companion

This repo depends on the Antigravity auth plugin's account-store behavior, but it does not publish a forked plugin source patch.

## Result

- installed package checked: `opencode-antigravity-auth@1.6.5-beta.0`
- local installed plugin package: byte-identical to npm upstream
- launcher patch: real code patch
- plugin code patch: none
- plugin runtime config companion: yes

That distinction matters.

The launcher patch owns:

- auth commands and drift repair
- smart model-picker labels
- favorite ordering
- gateway live/offline surfacing
- interactive refresh of picker state

The plugin-owned files provide the metadata and runtime behavior the launcher needs:

- `antigravity-accounts.json`
  - `activeIndex`
  - `activeIndexByFamily`
  - `projectId`
  - `cachedQuota`
  - `rateLimitResetTimes`

- `antigravity.json`
  - account selection strategy
  - session recovery behavior
  - retry and wait policy
  - token refresh behavior

## Why Include Plugin Material At All

Other users need the exact working combination:

- `opencode-ai@1.14.31`
- `opencode-antigravity-auth@1.6.5-beta.0`

This repo therefore includes:

- plugin attribution
- plugin version pinning
- a verification script
- upstream plugin metadata
- a redacted runtime-config example

## Runtime Companion Settings

The public example companion config is in [examples/state/antigravity.json](../examples/state/antigravity.json).

The notable settings are:

- `account_selection_strategy: "sticky"`
  - avoid noisy account hopping when one account is the known-good path

- `switch_on_first_rate_limit: true`
  - switch early instead of sitting on a clearly rate-limited path

- `session_recovery: true`
  - let the plugin recover a broken session without manual repair

- `auto_update: true`
  - keep plugin metadata and behavior current

- `max_rate_limit_wait_seconds: 90`
  - allow short quota resets to self-recover instead of failing immediately, while still avoiding absurd waits

- `proactive_token_refresh: true`
  - refresh ahead of failure when possible

- `tool_id_recovery: true`
  - recover from mismatched tool IDs

- `claude_tool_hardening: true`
  - make Claude tool-call flows less brittle

## Flash Quota and Cooldown Behavior

The launcher now treats quota-backed flash models as temporarily waiting, not permanently dead.

That behavior depends on plugin-owned metadata:

- `cachedQuota`
- `rateLimitResetTimes`

If the plugin account store says a flash path is cooling down, the picker can show:

```text
[WAIT model 6d 18h] Gemini 3 Flash Preview
```

If the cooldown clears and quota remains, the picker can promote it back to:

```text
[READY bucket 100%] Gemini 2.5 Flash
```

The public repo documents that state model, but it does not ship any real account data.

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
3. Use the companion plugin config shape from the redacted example.
4. Let the launcher sync auth state and picker state from the plugin-managed store.
