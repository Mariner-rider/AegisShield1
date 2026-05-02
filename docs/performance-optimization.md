# Performance & Footprint Optimization Guide

This repository is optimized for running on modest hardware (8GB RAM, 2-core CPU class, low-disk VPS) using the practices below.

## Container image optimizations

- Alpine Node base image
- Production-only dependencies (`npm ci --omit=dev`)
- NPM cache cleanup during build
- Non-root runtime user
- Shared root `.dockerignore` to reduce context size and disk overhead

## Runtime memory safeguards

- In-memory rate limiters now prune expired entries when maps grow beyond threshold limits.
- Prevents unbounded growth in long-running processes and low-memory environments.

## Practical deployment notes (small VPS)

- Run only required services, not full stack, for development validation.
- Prefer one API + one detector + one datastore in initial smoke tests.
- Use log rotation and capped container logs.

## Security/performance tradeoff note

Absolute guarantees are not possible. The platform applies pragmatic hardening and resource controls to reduce operational risk and improve reliability on constrained environments.
