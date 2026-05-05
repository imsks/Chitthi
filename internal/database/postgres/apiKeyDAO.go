package postgres

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type APIKeyDAO struct {
	pool *pgxpool.Pool
}

func NewAPIKeyDAO(pool *pgxpool.Pool) *APIKeyDAO {
	return &APIKeyDAO{pool: pool}
}

func (dao *APIKeyDAO) CreateAPIKey(ctx context.Context, userID uint, apiKey string, expiresAt string) (int64, error) {
	var apiKeyID int64
	query := "INSERT INTO user_api_keys (user_id, api_key, expires_at) VALUES ($1, $2, $3) RETURNING id"
	var err error
	if expiresAt == "" {
		err = dao.pool.QueryRow(ctx, query, userID, apiKey, nil).Scan(&apiKeyID)
	} else {
		err = dao.pool.QueryRow(ctx, query, userID, apiKey, expiresAt).Scan(&apiKeyID)
	}
	if err != nil {
		return 0, err
	}
	return apiKeyID, nil
}

func (dao *APIKeyDAO) GetAPIKeys(ctx context.Context, userID uint) ([]string, error) {
	// Implement logic to fetch all API keys for a given user from the user_api_keys table
	rows, err := dao.pool.Query(ctx, "SELECT api_key FROM user_api_keys WHERE user_id = $1", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apiKeys []string
	for rows.Next() {
		var apiKey string
		if err := rows.Scan(&apiKey); err != nil {
			return nil, err
		}
		apiKeys = append(apiKeys, apiKey)
	}
	return apiKeys, nil
}

// GetUserIDByActiveAPIKey resolves a non-expired Chitthi API key to its owner user id.
func (dao *APIKeyDAO) GetUserIDByActiveAPIKey(ctx context.Context, apiKey string) (uint, error) {
	var userID uint
	err := dao.pool.QueryRow(ctx,
		`SELECT user_id FROM user_api_keys
		 WHERE api_key = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
		apiKey,
	).Scan(&userID)
	if err != nil {
		return 0, err
	}
	return userID, nil
}

// DeleteUserAPIKey deletes one Chitthi API key owned by userID. RowsAffected confirms ownership.
func (dao *APIKeyDAO) DeleteUserAPIKey(ctx context.Context, userID uint, apiKey string) (int64, error) {
	tag, err := dao.pool.Exec(ctx,
		`DELETE FROM user_api_keys WHERE user_id = $1 AND api_key = $2`,
		userID, apiKey,
	)
	if err != nil {
		return 0, err
	}
	return tag.RowsAffected(), nil
}
