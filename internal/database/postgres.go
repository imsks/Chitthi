package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

// InitPostgres returns a concurrent-safe pool. A single pgx.Conn must not be shared across goroutines (causes "conn busy").
func InitPostgres(dsn string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}
	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(context.Background()); err != nil {
		pool.Close()
		return nil, err
	}
	log.Println("✅ Connected to PostgreSQL (pool)")
	return pool, nil
}

func Close(pool *pgxpool.Pool) {
	if pool != nil {
		pool.Close()
		log.Println("🔌 Closed PostgreSQL pool")
	}
}
