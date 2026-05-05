# Research Check

The UX changes in this repo were checked against common patterns from established CLIs.

## Patterns Followed

### 1. Named Accounts + One Active Context

Used as the model for:

- saved auth profiles
- one visible active profile
- explicit switching instead of hidden mutation

References:

- GitHub CLI `gh auth switch`
  - https://cli.github.com/manual/gh_auth_switch
- GitHub CLI multi-account usage
  - https://docs.github.com/en/github-cli/github-cli/using-multiple-accounts
- Google Cloud configurations
  - https://docs.cloud.google.com/sdk/docs/configurations

### 2. Interactive Selection When Ambiguous

Used as the model for:

- `opencode auth switch`
- interactive profile picker

References:

- GitHub CLI auth switch
  - https://cli.github.com/manual/gh_auth_switch
- 1Password CLI multiple accounts
  - https://developer.1password.com/docs/cli/use-multiple-accounts/

### 3. Explicit Status / Who-Am-I View

Used as the model for:

- `opencode auth current`
- visible account/store/runtime state

References:

- GitHub CLI auth status
  - https://cli.github.com/manual/gh_auth_status
- Google Cloud active configuration model
  - https://docs.cloud.google.com/sdk/docs/configurations

### 4. Doctor / Repair Workflow

Used as the model for:

- `opencode auth doctor`
- `opencode auth repair`

References:

- npm doctor
  - https://docs.npmjs.com/cli/v8/commands/npm-doctor/
- Homebrew troubleshooting / doctor pattern
  - https://docs.brew.sh/Troubleshooting

## Main Takeaway

The correct mental model is:

- one active intent
- multiple underlying stores
- explicit drift detection
- explicit runtime restart when live state may still be pinned

That is the exact shape implemented here.
