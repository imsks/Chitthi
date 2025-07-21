package email

import (
	"context"

	"github.com/imsks/chitthi/internal/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository() *Repository {
	return &Repository{pool: database.Pool}
}

func (r *Repository) InsertLog(ctx context.Context, log *EmailLog) error {
	query := `
		INSERT INTO email_logs (recipient_email, subject, provider, status)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`

	return r.pool.QueryRow(ctx, query,
		log.RecipientEmail, log.Subject, log.Provider, log.Status,
	).Scan(&log.ID, &log.CreatedAt)
}

func (r *Repository) GetLogs(ctx context.Context, limit int) ([]EmailLog, error) {
	query := `
		SELECT id, recipient_email, subject, provider, status, created_at
		FROM email_logs
		ORDER BY created_at DESC
		LIMIT $1
	`

	rows, err := r.pool.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []EmailLog
	for rows.Next() {
		var log EmailLog
		err := rows.Scan(&log.ID, &log.RecipientEmail, &log.Subject,
			&log.Provider, &log.Status, &log.CreatedAt)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}

	return logs, nil
}
