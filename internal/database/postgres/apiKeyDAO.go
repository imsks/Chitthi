package postgres

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type APIKeyDAO struct {
	conn *pgx.Conn
}

func NewAPIKeyDAO(conn *pgx.Conn) *APIKeyDAO {
	return &APIKeyDAO{conn: conn}
}

func (dao *APIKeyDAO) CreateAPIKey(ctx context.Context, userID uint, apiKey string, expiresAt string) (int64, error) {
	var apiKeyID int64
	// Implement logic to insert a new API key into the user_api_keys table
	err := dao.conn.QueryRow(
		ctx,
		"INSERT INTO user_api_keys (user_id, api_key, expires_at) VALUES ($1, $2, $3) RETURNING id",
		userID, apiKey, expiresAt,
	).Scan(&apiKeyID)
	if err != nil {
		return 0, err
	}
	return apiKeyID, nil
}

func (dao *APIKeyDAO) GetAPIKeys(ctx context.Context, userID uint) ([]string, error) {
	// Implement logic to fetch all API keys for a given user from the user_api_keys table
	rows, err := dao.conn.Query(ctx, "SELECT api_key FROM user_api_keys WHERE user_id = $1", userID)
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
