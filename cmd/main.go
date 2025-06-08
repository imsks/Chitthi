package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/model"
)

func main() {
	cfg := config.LoadConfig()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(w, "📮 Welcome to Chitthi - BYOK Email Delivery Service")
	})

	http.HandleFunc("/send-email", handleSendEmail)

	addr := ":" + cfg.Port
	fmt.Printf("🚀 Chitthi running on http://localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func handleSendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}

	var req model.EmailRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.To == "" || req.Subject == "" || req.Provider == "" {
		http.Error(w, "Missig required fields", http.StatusBadRequest)
		return
	}

	log.Printf("📨 Received Email Request: %+v", req)
	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte("Email accepted for processing."))
}
