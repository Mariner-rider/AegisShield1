# Local Onboarding Testing

## Backend API onboarding endpoints
- `GET /onboarding/state`
- `POST /onboarding/start`
- `POST /onboarding/organization`
- `POST /onboarding/project`
- `POST /onboarding/integration`
- `POST /onboarding/install-instructions`
- `POST /onboarding/trial-credentials`
- `POST /onboarding/verify-heartbeat`
- `POST /onboarding/verify-event`
- `POST /onboarding/complete`

## Verification flow
1. Start onboarding.
2. Choose integration type.
3. Generate install instructions and quickstart snippet.
4. Issue trial API key / agent token.
5. Simulate heartbeat callback then first event callback.
6. Confirm onboarding state has `completedAt` set.

## Common errors
Use troubleshooting definitions from `apps/console-web/src/pages/troubleshooting.ts`.
