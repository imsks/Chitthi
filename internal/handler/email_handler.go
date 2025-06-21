package handler

import (
	"encoding/json"
	"net/http"

	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

var emailProvider adapters.EmailAdapter

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	var email model.EmailRequest
	err := json.NewDecoder(r.Body).Decode(&email)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	err = emailProvider.SendEmail(email)
	if err != nil {
		http.Error(w, "Failed to send email: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Email sent successfully"))
}
