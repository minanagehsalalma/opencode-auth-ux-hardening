# Privacy

This repo is intentionally sanitized.

## Redaction Rules

- Real email addresses were replaced with placeholders such as `alpha@example.com`
- Real tokens were replaced with fake token-like strings
- Real project IDs were replaced with `example-project-123`
- Real local paths were replaced with `<HOME>` where possible
- No screenshots or logs with personal identifiers were included

## Why

The underlying work touched:

- local auth files
- plugin account stores
- runtime session databases
- real account identities

Publishing raw examples would have leaked private identifiers and machine-specific state.

## Public-Safe Goal

The examples should still teach:

- what changed
- why it changed
- what the command surface looks like
- how the state model works

without exposing the original user’s data.
