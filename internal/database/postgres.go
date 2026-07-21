package database

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// InitPostgres returns a concurrent-safe pool. A single pgx.Conn must not be shared across goroutines (causes "conn busy").
func InitPostgres(dsn string) (*pgxpool.Pool, error) {
	if dsn == "" {
		return nil, nil
	}
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
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
