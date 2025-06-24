package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/imsks/chitthi/db"
	"github.com/imsks/chitthi/internal/config"
	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

func main() {
	cfg := config.LoadConfig()

	// Initialize database
	db.InitPostgres(cfg.DatabaseURL)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "📮 Welcome to Chitthi - BYOK Email Delivery Service")
	})

	http.HandleFunc("/send-email", handleSendEmail)
	http.HandleFunc("/email-logs", handleGetEmailLogs)

	addr := ":" + cfg.Port
	fmt.Printf("🚀 Chitthi running on http://localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func handleSendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req model.EmailRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.ToEmail == "" || req.Subject == "" {
		http.Error(w, "Missing required fields: to_email and subject", http.StatusBadRequest)
		return
	}

	// Send email using Breevo
	cfg := config.LoadConfig()
	// TODO: Check here for Platforms and Usages
	breevoAdapter := &adapters.BreevoAdapter{APIKey: cfg.BreevoAPIKey}

	err = breevoAdapter.SendEmail(req)
	if err != nil {
		fmt.Printf("❌ Error sending email with Breevo: %v\n", err)
		http.Error(w, "Failed to send email with Breevo: "+err.Error(), http.StatusInternalServerError)
		return
	}

	logErr := db.InsertEmailLog(req.ToEmail, req.Subject, "Breevo", "Sent")
	if logErr != nil {
		fmt.Printf("❌ Error inserting email log: %v\n", logErr)
	}

	log.Printf("✅ Email sent to %s via Breevo", req.ToEmail)
	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte("Email accepted and sent"))
}

func handleGetEmailLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}

	query := `SELECT id, recipient_email, subject, provider, status, created_at
			  FROM email_logs
			  ORDER BY created_at DESC
			  LIMIT 10
	        `

	rows, err := db.DB.Query(query)
	if err != nil {
		http.Error(w, "Failed to fetch email logs", http.StatusInternalServerError)
	}

	defer rows.Close()

	var logs []model.EmailLog

	for rows.Next() {
		var id int
		var recipientEmail, subject, provider, status, createdAt string

		err := rows.Scan(&id, &recipientEmail, &subject, &provider, &status, &createdAt)
		if err != nil {
			http.Error(w, "Failed to scan email log", http.StatusInternalServerError)
			return
		}

		logs = append(logs, model.EmailLog{
			ID:             id,
			RecipientEmail: recipientEmail,
			Subject:        subject,
			Provider:       provider,
			Status:         status,
			CreatedAt:      createdAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}
