package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

var Pool *pgxpool.Pool

func InitPostgres(dsn string) error {
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return err
	}

	Pool = pool
	log.Println("✅ Connected to PostgreSQL")
	return nil
}

func Close() {
	if Pool != nil {
		Pool.Close()
		log.Println("🔌 Closed PostgreSQL connection")
	}
}
