package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/imsks/chitthi/internal/config"
	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

func main() {
	cfg := config.LoadConfig()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "📮 Welcome to Chitthi - BYOK Email Delivery Service")
	})

	http.HandleFunc("/send-email", handleSendEmail)

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

	log.Printf("✅ Email sent to %s via Breevo", req.ToEmail)
	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte("Email accepted and sent"))
}
