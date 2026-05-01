# Multi-region Design

## Goals

- Region-aware routing
- Region-based data storage
- Failover strategy
- Latency-aware event ingestion

## Routing strategy

For each request/event, choose among healthy regional targets and route to the lowest latency region.

## Data storage strategy

Storage regions are mapped per tenant to enforce residency and locality requirements.

## Failover strategy

Each primary region can define a secondary region with failover triggers:

- healthcheck failure
- latency threshold breach

## Ingestion behavior

Latency-aware ingestion chooses the nearest healthy region and falls back based on configured failover plans.

## Isolation note

Multi-region support does not relax tenant isolation; tenant boundaries remain strict across all regions.
