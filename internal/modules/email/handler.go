package email

import (
	"encoding/json"
	"net/http"

	"github.com/imsks/chitthi/internal/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) SendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.SendEmailErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed", "METHOD_NOT_ALLOWED")
		return
	}

	var req EmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendEmailErrorResponse(w, http.StatusBadRequest, "Invalid JSON", "INVALID_JSON")
		return
	}

	if req.ToEmail == "" || req.Subject == "" {
		utils.SendEmailErrorResponse(w, http.StatusBadRequest, "Missing required fields: to_email and subject", "MISSING_REQUIRED_FIELDS")
		return
	}

	// Check if any credentials are provided (either in headers or request body)
	credentials := extractCredentialsFromHeaders(r)
	hasCredentials := len(credentials) > 0 || req.BreevoAPIKey != "" || req.SendGridAPIKey != "" || req.MailerSendAPIKey != ""

	if !hasCredentials {
		utils.SendEmailErrorResponse(w, http.StatusBadRequest, "No email provider credentials provided. Please provide API keys in headers or request body.", "NO_CREDENTIALS_PROVIDED")
		return
	}

	// Add credentials to the request
	req.Credentials = credentials

	// Send email and get result
	result := h.service.SendEmail(r.Context(), &req)

	if !result.Success {
		// Email sending failed
		utils.SendEmailErrorResponse(w, http.StatusInternalServerError, "Failed to send email: "+result.Error.Error(), "EMAIL_SEND_FAILED")
		return
	}

	// Email sent successfully, return structured response
	utils.SendEmailSuccessResponse(w, result.EmailData)
}

// extractCredentialsFromHeaders extracts all credential headers
func extractCredentialsFromHeaders(r *http.Request) map[string]string {
	credentials := make(map[string]string)

	// API Keys
	if apiKey := r.Header.Get("X-Breevo-API-Key"); apiKey != "" {
		credentials["breevo_api_key"] = apiKey
	}
	if apiKey := r.Header.Get("X-SendGrid-API-Key"); apiKey != "" {
		credentials["sendgrid_api_key"] = apiKey
	}
	if region := r.Header.Get("X-SendGrid-Region"); region != "" {
		credentials["sendgrid_region"] = region
	}
	if apiKey := r.Header.Get("X-MailerSend-API-Key"); apiKey != "" {
		credentials["mailersend_api_key"] = apiKey
	}

	// SMTP Credentials
	if host := r.Header.Get("X-SMTP-Host"); host != "" {
		credentials["smtp_host"] = host
	}
	if port := r.Header.Get("X-SMTP-Port"); port != "" {
		credentials["smtp_port"] = port
	}
	if username := r.Header.Get("X-SMTP-Username"); username != "" {
		credentials["smtp_username"] = username
	}
	if password := r.Header.Get("X-SMTP-Password"); password != "" {
		credentials["smtp_password"] = password
	}
	if from := r.Header.Get("X-SMTP-From"); from != "" {
		credentials["smtp_from"] = from
	}
	if useTLS := r.Header.Get("X-SMTP-Use-TLS"); useTLS != "" {
		credentials["smtp_use_tls"] = useTLS
	}

	return credentials
}
