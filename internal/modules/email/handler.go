package email

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) SendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req EmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.ToEmail == "" || req.Subject == "" {
		http.Error(w, "Missing required fields: to_email and subject", http.StatusBadRequest)
		return
	}

	// Extract credentials from headers
	credentials := extractCredentialsFromHeaders(r)

	// Add credentials to the request
	req.Credentials = credentials

	if err := h.service.SendEmail(r.Context(), &req); err != nil {
		http.Error(w, "Failed to send email: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte("Email sent successfully"))
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

func (h *Handler) GetLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	limit := 10
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	logs, err := h.service.GetLogs(r.Context(), limit)
	if err != nil {
		http.Error(w, "Failed to fetch logs", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}
