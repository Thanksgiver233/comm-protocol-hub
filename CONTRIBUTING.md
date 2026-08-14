# Contributing to comm-protocol-hub

Thanks for your interest in contributing!

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run type checking: `pnpm typecheck`
5. Commit with conventional commits: `feat: add NTN protocol support`
6. Push and open a Pull Request

## Development

```bash
# Install dependencies
pnpm install

# Type check
pnpm typecheck

# Build
pnpm build

# Verify
pnpm verify
```

## Adding New Protocols

Protocol data lives in `src/data/*.json`. Each file corresponds to a category:
- `tn_protocols.json` — Terrestrial Networks (TN)
- `ntn_protocols.json` — Non-Terrestrial Networks (NTN)
- `holographic_protocols.json` — Holographic Communication
- `near_field_protocols.json` — Near-Field Communication
- `far_field_protocols.json` — Far-Field Communication
- `hybrid_protocols.json` — Hybrid Near/Far Field
- `safety_protocols.json` — Safety & Mission Critical
- `misc_protocols.json` — Miscellaneous / General

Each entry follows the `ProtocolEntry` interface in `src/types.ts`.

## Commit Convention

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation only
- `refactor:` — Code refactoring
- `test:` — Test changes
- `chore:` — Build/config changes

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for details.
