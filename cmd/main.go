package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database"
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
	if err := database.InitPostgres(cfg.DatabaseURL); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer database.Close()

	// Initialize services
	emailService := email.NewService(cfg)
	emailHandler := email.NewHandler(emailService)

	// Setup routes
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(fmt.Sprintf("📮 Welcome to Chitthi %s - BYOK Email Delivery Service", Version)))
	})

	// Version endpoint
	http.HandleFunc("/version", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		response := VersionResponse{
			Version:   Version,
			Service:   "Chitthi Email Service",
			Status:    "running",
			Timestamp: fmt.Sprintf("%d", time.Now().Unix()),
		}
		json.NewEncoder(w).Encode(response)
	})

	// Email module routes
	http.HandleFunc("/send-email", emailHandler.SendEmail)
	http.HandleFunc("/email-logs", emailHandler.GetLogs)

	addr := ":" + cfg.Port
	log.Printf("🚀 Chitthi %s running on http://localhost%s", Version, addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
