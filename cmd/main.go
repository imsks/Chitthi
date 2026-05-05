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

	conn, err := database.InitPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	err = database.InitRedis(cfg.RedisURL)
	if err != nil {
		log.Fatal("Failed to initialize Redis:", err)
	}

	defer database.Close(conn)
	defer database.CloseRedis()

	engine := httprouter.SetupRouter(&cfg, conn, Version)

	addr := ":" + cfg.Port
	log.Printf("🚀 Chitthi %s running on http://localhost%s", Version, addr)
	log.Fatal(engine.Run(addr))
}
