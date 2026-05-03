# Getting Started

## Prerequisites
- Node.js 22+
- Docker + Docker Compose
- Ability to install npm dependencies from the registry

## Install
```bash
npm install
```

## Validate baseline
```bash
npm test
npm run build
```

## Run local stack (scaffold)
```bash
docker compose -f infra/docker/docker-compose.full-stack.yml up --build
```

> Note: the current stack is scaffold-oriented. Several containers use placeholder runtime commands and are intended for structure validation, not full production behavior.

## Explore key areas
- SDK integration: `docs/sdk-node-quickstart.md`
- Agent integration: `docs/agent-quickstart.md`
- Trial and plans: `docs/trial-flow.md`, `docs/pricing-and-plans.md`
- Implementation reality check: `docs/implementation-status.md`
