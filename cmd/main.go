package main

import (
	"log"
	"net/http"

	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database"
	"github.com/imsks/chitthi/internal/modules/email"
)

func main() {
	cfg := config.LoadConfig()

	// Initialize database
	if err := database.InitPostgres(cfg.DatabaseURL); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer database.Close()

	// Initialize services
	emailService := email.NewService(cfg.BreevoAPIKey)
	emailHandler := email.NewHandler(emailService)

	// Setup routes
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("📮 Welcome to Chitthi - BYOK Email Delivery Service"))
	})

	// Email module routes
	http.HandleFunc("/send-email", emailHandler.SendEmail)
	http.HandleFunc("/email-logs", emailHandler.GetLogs)

	addr := ":" + cfg.Port
	log.Printf("🚀 Chitthi running on http://localhost%s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
