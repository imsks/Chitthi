package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProviderAPIKeysDAO struct {
	pool *pgxpool.Pool
}

func NewProviderAPIKeysDAO(pool *pgxpool.Pool) *ProviderAPIKeysDAO {
	return &ProviderAPIKeysDAO{pool: pool}
}

func (dao *ProviderAPIKeysDAO) AddProviderAPIKey(ctx context.Context, userID uint, providerID uint, apiKey string, senderEmail string) (int64, error) {
	var apiKeyID int64
	err := dao.pool.QueryRow(
		ctx,
		`INSERT INTO provider_api_keys (user_id, provider_id, api_key, sender_email)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (user_id, provider_id) DO UPDATE SET
		   api_key = EXCLUDED.api_key,
		   sender_email = EXCLUDED.sender_email,
		   updated_at = NOW()
		 RETURNING id`,
		userID, providerID, apiKey, senderEmail,
	).Scan(&apiKeyID)
	if err != nil {
		return 0, err
	}
	return apiKeyID, nil
}

func (dao *ProviderAPIKeysDAO) GetUserProviderAPIKeys(ctx context.Context, userID uint) ([]string, error) {
	rows, err := dao.pool.Query(ctx, "SELECT provider_id, api_key FROM provider_api_keys WHERE user_id = $1", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var providerAPIKeys []string
	for rows.Next() {
		var providerID uint
		var apiKey string
		if err := rows.Scan(&providerID, &apiKey); err != nil {
			return nil, err
		}
		providerAPIKeys = append(providerAPIKeys, fmt.Sprintf("%d: %s", providerID, apiKey))
	}
	return providerAPIKeys, nil
}

func (dao *ProviderAPIKeysDAO) GetProviderAPIKeys(ctx context.Context, userID uint, providerID uint) (string, error) {
	row := dao.pool.QueryRow(ctx, "SELECT api_key FROM provider_api_keys WHERE user_id = $1 AND provider_id = $2", userID, providerID)
	var apiKey string
	if err := row.Scan(&apiKey); err != nil {
		return "", err
	}
	return apiKey, nil
}

func (dao *ProviderAPIKeysDAO) GetProviderIDByName(ctx context.Context, providerName string) (uint, error) {
	row := dao.pool.QueryRow(ctx, "SELECT id FROM providers WHERE name = $1", providerName)
	var providerID uint
	if err := row.Scan(&providerID); err != nil {
		return 0, err
	}
	return providerID, nil
}

func (dao *ProviderAPIKeysDAO) GetConfiguredProviderNames(ctx context.Context, userID uint) ([]string, error) {
	rows, err := dao.pool.Query(
		ctx,
		`SELECT p.name
		 FROM provider_api_keys pak
		 JOIN providers p ON pak.provider_id = p.id
		 WHERE pak.user_id = $1
		 ORDER BY p.name`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var providers []string
	for rows.Next() {
		var provider string
		if err := rows.Scan(&provider); err != nil {
			return nil, err
		}
		providers = append(providers, provider)
	}

	return providers, rows.Err()
}

// PrimaryProviderCredential is the stored BYOK row chosen for unified /send-email routing.
type PrimaryProviderCredential struct {
	ProviderName string
	APIKey       string
	SenderEmail  string
}

// GetPrimaryProviderCredential picks sendgrid, then breevo, then mailersend (skips smtp and unsupported names).
func (dao *ProviderAPIKeysDAO) GetPrimaryProviderCredential(ctx context.Context, userID uint) (*PrimaryProviderCredential, error) {
	row := dao.pool.QueryRow(ctx,
		`SELECT p.name::text, pak.api_key, pak.sender_email
		 FROM provider_api_keys pak
		 JOIN providers p ON p.id = pak.provider_id
		 WHERE pak.user_id = $1
		   AND p.name IN ('sendgrid', 'breevo', 'mailersend')
		 ORDER BY
		   CASE p.name
		     WHEN 'sendgrid' THEN 1
		     WHEN 'breevo' THEN 2
		     WHEN 'mailersend' THEN 3
		     ELSE 4
		   END
		 LIMIT 1`,
		userID,
	)
	var cred PrimaryProviderCredential
	if err := row.Scan(&cred.ProviderName, &cred.APIKey, &cred.SenderEmail); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("no supported provider credentials for user")
		}
		return nil, err
	}
	return &cred, nil
}
