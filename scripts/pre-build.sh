#!/bin/bash

# Resolve failed migration if exists
npx prisma migrate resolve --rolled-back 20260326084503_add_prime_rate 2>/dev/null || true

# Deploy migrations
npx prisma migrate deploy
