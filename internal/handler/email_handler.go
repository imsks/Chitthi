package handler

import (
	"encoding/json"
	"net/http"

	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
	"github.com/imsks/chitthi/internal/utils"
)

var emailProvider adapters.EmailAdapter

func SendEmailHandler(w http.ResponseWriter, r *http.Request) {
	var email model.EmailRequest
	err := json.NewDecoder(r.Body).Decode(&email)
	if err != nil {
		utils.SendEmailErrorResponse(w, http.StatusBadRequest, "Invalid JSON", "INVALID_JSON")
		return
	}

	err = emailProvider.SendEmail(email)
	if err != nil {
		utils.SendEmailErrorResponse(w, http.StatusInternalServerError, "Failed to send email: "+err.Error(), "EMAIL_SEND_FAILED")
		return
	}

	// Create success response data
	emailData := &model.EmailData{
		SentTo:   email.ToEmail,
		SentFrom: email.FromEmail,
		Subject:  email.Subject,
		Provider: email.Provider,
		LogSaved: false, // Old handler doesn't handle logging
	}

	utils.SendEmailSuccessResponse(w, emailData)
}
