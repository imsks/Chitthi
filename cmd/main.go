package main

import (
	"log"

	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database"
	httprouter "github.com/imsks/chitthi/internal/http"
)

const Version = "v1.0.0"

func main() {
	cfg := config.LoadConfig()

	pool, err := database.InitPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Printf("⚠️  Failed to initialize database: %v (server will start without DB)", err)
	}

	if err := database.InitRedis(cfg.RedisURL); err != nil {
		log.Printf("⚠️  Failed to initialize Redis: %v (server will start without Redis)", err)
	}

	defer database.Close(pool)
	defer database.CloseRedis()

	engine := httprouter.SetupRouter(&cfg, pool, Version)

	addr := ":" + cfg.Port
	log.Printf("🚀 Chitthi %s running on http://localhost%s", Version, addr)
	log.Fatal(engine.Run(addr))
}
