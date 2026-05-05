-- Revert requires no NULL password_hash rows
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
