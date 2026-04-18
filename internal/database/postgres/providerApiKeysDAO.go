package postgres

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

type ProviderAPIKeysDAO struct {
	conn *pgx.Conn
}

func NewProviderAPIKeysDAO(conn *pgx.Conn) *ProviderAPIKeysDAO {
	return &ProviderAPIKeysDAO{conn: conn}
}

func (dao *ProviderAPIKeysDAO) AddProviderAPIKey(ctx context.Context, userID uint, providerID uint, apiKey string) (int64, error) {
	var apiKeyID int64
	err := dao.conn.QueryRow(
		ctx,
		"INSERT INTO provider_api_keys (user_id, provider_id, api_key) VALUES ($1, $2, $3) RETURNING id",
		userID, providerID, apiKey,
	).Scan(&apiKeyID)
	if err != nil {
		return 0, err
	}
	return apiKeyID, nil
}

func (dao *ProviderAPIKeysDAO) GetUserProviderAPIKeys(ctx context.Context, userID uint) ([]string, error) {
	rows, err := dao.conn.Query(ctx, "SELECT provider_id, api_key FROM provider_api_keys WHERE user_id = $1", userID)
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
	row := dao.conn.QueryRow(ctx, "SELECT api_key FROM provider_api_keys WHERE user_id = $1 AND provider_id = $2", userID, providerID)
	var apiKey string
	if err := row.Scan(&apiKey); err != nil {
		return "", err
	}
	return apiKey, nil
}

func (dao *ProviderAPIKeysDAO) GetProviderIDByName(ctx context.Context, providerName string) (uint, error) {
	row := dao.conn.QueryRow(ctx, "SELECT id FROM providers WHERE name = $1", providerName)
	var providerID uint
	if err := row.Scan(&providerID); err != nil {
		return 0, err
	}
	return providerID, nil
}
