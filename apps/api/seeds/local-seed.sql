INSERT INTO subscription_plans (id, code, name, monthly_usd_cents, features)
VALUES
  (gen_random_uuid(), 'starter', 'Starter', 4900, '{"projects":3}'::jsonb),
  (gen_random_uuid(), 'pro', 'Pro', 19900, '{"projects":20}'::jsonb);

-- demo user password should be generated/hashed by seed script in real environments.
INSERT INTO users (id, email, password_hash, full_name)
VALUES (gen_random_uuid(), 'owner@demo.aegis', 'seed-hash-placeholder', 'Demo Owner');
