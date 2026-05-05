-- Google Sign-In: password_hash omitted for OAuth-only accounts
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
