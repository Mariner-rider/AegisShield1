# Disaster Recovery

## Objectives
- RPO: 15 minutes for control-plane metadata.
- RTO: 1 hour for platform API + console restoration.

## Backup strategy
- Nightly full backups for PostgreSQL + hourly WAL/archive shipping.
- Daily policy bundle/audit snapshots to immutable object storage.
- Retain encrypted backup copies in secondary region.

## Restore workflow
1. Restore database to latest consistent snapshot.
2. Replay WAL to target recovery point.
3. Restore policy bundles and audit indexes.
4. Rehydrate cache/stateful queues.
5. Validate health/readiness and smoke tests.

## Failover notes
- Use active-passive regional failover.
- Rotate API credentials if compromise suspected.
- Keep platform in monitor-only mode during uncertain recovery windows.
