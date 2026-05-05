# Attribution

This repository builds on upstream work from the OpenCode and Antigravity auth plugin creators.

## Upstream Projects

### OpenCode

- Project: OpenCode
- Official site: https://opencode.ai
- Official repository: https://github.com/opencode-ai/opencode
- License: MIT

This repo patches the `opencode-ai@1.14.31` launcher to make multi-store auth state more explicit and easier to control.

### Antigravity Auth Plugin

- Package: `opencode-antigravity-auth`
- Version used here: `1.6.5-beta.0`
- Author: `noefabris`
- Repository: https://github.com/NoeFabris/opencode-antigravity-auth
- License: MIT

This repo does not claim authorship of the plugin. The launcher patch in this repository is designed to work with the plugin's existing account-store model.

## Official Docs Used For Verification

- Plugins: https://opencode.ai/docs/plugins/
- Ecosystem: https://opencode.ai/docs/ecosystem/

## Scope Of This Repo

- Upstream launcher: credited and vendored for diffing
- Upstream plugin: credited and version-pinned for verification
- Patch logic: this repo's launcher-side auth UX hardening and companion verification scripts
