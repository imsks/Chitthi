package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/imsks/chitthi/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitPostgres(dsn string) {
	var err error

	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("❌ Failed to connect to the Postgres: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("❌ Failed to ping the Postgres: ", err)
	}

	log.Println("✅ Connected to the Postgres")

	createTableQuery := `
	CREATE TABLE IF NOT EXISTS email_logs (
		id SERIAL PRIMARY KEY,
		recipient_email TEXT NOT NULL,
		subject TEXT NOT NULL,
		provider TEXT NOT NULL,
		status TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = DB.Exec(createTableQuery)
	if err != nil {
		log.Fatal("❌ Failed to run migrations: ", err)
	}

	log.Println("✅ Migration complete: email_logs table ready")
}

func ConnectDB() (*pgxpool.Pool, error) {
	cfg := config.LoadConfig()
	config, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, err
	}

	return pool, nil
}

func InsertEmailLog(recipientEmail, subject, provider, status string) error {
	query := `
	INSERT INTO email_logs (recipient_email, subject, provider, status)
	VALUES ($1, $2, $3, $4)
	`

	_, err := DB.Exec(query, recipientEmail, subject, provider, status)
	if err != nil {
		return fmt.Errorf("failed to insert email log: %w", err)
	}

	log.Printf("✅ Email log inserted: %s, %s, %s, %s", recipientEmail, subject, provider, status)

	return nil
}
