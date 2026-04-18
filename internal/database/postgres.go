package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
	_ "github.com/lib/pq"
)

func InitPostgres(dsn string) (*pgx.Conn, error) {
	log.Println("dsn", dsn)
	conn, err := pgx.Connect(context.Background(), dsn)
	if err != nil {
		return nil, err
	}

	log.Println("✅ Connected to PostgreSQL")
	return conn, nil
}

func Close(conn *pgx.Conn) {
	if conn != nil {
		conn.Close(context.Background())
		log.Println("🔌 Closed PostgreSQL connection")
	}
}
