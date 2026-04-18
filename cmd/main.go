package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database"
	router "github.com/imsks/chitthi/internal/http"
	"github.com/imsks/chitthi/internal/middleware"
	"github.com/imsks/chitthi/internal/modules/email"
)

const Version = "v1.0.0"

type VersionResponse struct {
	Version   string `json:"version"`
	Service   string `json:"service"`
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

func main() {
	cfg := config.LoadConfig()

	// Initialize database
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

	router := router.SetupRouter(&cfg, conn)

	//Initialize services
	emailService := email.NewService(cfg)
	emailHandler := email.NewHandler(emailService)

	// Setup routes with CORS middleware
	http.HandleFunc("/", middleware.CORSHandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(fmt.Sprintf("📮 Welcome to Chitthi %s - BYOK Email Delivery Service", Version)))
	}))

	// Version endpoint
	http.HandleFunc("/version", middleware.CORSHandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		response := VersionResponse{
			Version:   Version,
			Service:   "Chitthi Email Service",
			Status:    "running",
			Timestamp: fmt.Sprintf("%d", time.Now().Unix()),
		}
		json.NewEncoder(w).Encode(response)
	}))

	// Email module routes with CORS middleware
	http.HandleFunc("/send-email", middleware.CORSHandlerFunc(emailHandler.SendEmail))

	// Start the server
	addr := ":" + cfg.Port
	log.Printf("🚀 Chitthi %s running on http://localhost%s", Version, addr)
	log.Fatal(http.ListenAndServe(addr, router))
}
