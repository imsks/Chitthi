-- Unified API keys: users, providers, per-user provider credentials, daily aggregates, unified keys.

CREATE TYPE provider_name AS ENUM (
	'sendgrid',
	'mailchimp',
	'breevo',
	'mailersend',
	'smtp'
);

CREATE TABLE IF NOT EXISTS users (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
	profession TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS providers (
	id BIGSERIAL PRIMARY KEY,
	name provider_name NOT NULL UNIQUE,
	daily_quota INTEGER NOT NULL DEFAULT 0 CHECK (daily_quota >= 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_api_keys (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	provider_id BIGINT NOT NULL REFERENCES providers (id) ON DELETE CASCADE,
	api_key TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (user_id, provider_id)
);

CREATE INDEX IF NOT EXISTS idx_provider_api_keys_user_id ON provider_api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_provider_api_keys_provider_id ON provider_api_keys (provider_id);

-- One row per user per calendar day; rates are 0–100 (%).
CREATE TABLE IF NOT EXISTS user_logs (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	log_date DATE NOT NULL,
	success_rate NUMERIC(6, 3) NOT NULL DEFAULT 0 CHECK (success_rate >= 0 AND success_rate <= 100),
	failure_rate NUMERIC(6, 3) NOT NULL DEFAULT 0 CHECK (failure_rate >= 0 AND failure_rate <= 100),
	hold_rate NUMERIC(6, 3) NOT NULL DEFAULT 0 CHECK (hold_rate >= 0 AND hold_rate <= 100),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_user_logs_user_id_log_date ON user_logs (user_id, log_date DESC);

CREATE TABLE IF NOT EXISTS user_api_keys (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	api_key TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON user_api_keys (user_id);

INSERT INTO providers (name, daily_quota) VALUES
	('sendgrid', 100000),
	('mailchimp', 100000),
	('breevo', 50000),
	('mailersend', 100000),
	('smtp', 100000)
ON CONFLICT (name) DO NOTHING;
