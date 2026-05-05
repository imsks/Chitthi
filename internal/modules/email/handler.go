package email

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/imsks/chitthi/internal/utils"
)

type Handler struct {
	service  *Service
	resolver *ChitthiResolver
}

func NewHandler(service *Service, resolver *ChitthiResolver) *Handler {
	return &Handler{service: service, resolver: resolver}
}

func hasExplicitBYOK(credentials map[string]string, req *EmailRequest) bool {
	if credentials == nil {
		return false
	}
	if credentials["breevo_api_key"] != "" || credentials["sendgrid_api_key"] != "" || credentials["mailersend_api_key"] != "" {
		return true
	}
	if req.BreevoAPIKey != "" || req.SendGridAPIKey != "" || req.MailerSendAPIKey != "" {
		return true
	}
	return false
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

	credentials := extractCredentialsFromHeaders(r)

	chitthiKey := ExtractChitthiAPIKey(r)
	if chitthiKey != "" && !hasExplicitBYOK(credentials, &req) && h.resolver != nil {
		credExtra, defaultFrom, err := h.resolver.Resolve(r.Context(), chitthiKey)
		if err != nil {
			msg := err.Error()
			if strings.Contains(msg, "invalid or expired Chitthi API key") {
				utils.SendEmailErrorResponse(w, http.StatusUnauthorized, msg, "CHITTHI_KEY_INVALID")
			} else {
				utils.SendEmailErrorResponse(w, http.StatusBadRequest, msg, "CHITTHI_RESOLVE_FAILED")
			}
			return
		}
		for k, v := range credExtra {
			credentials[k] = v
		}
		if strings.TrimSpace(req.FromEmail) == "" && defaultFrom != "" {
			req.FromEmail = defaultFrom
		}
	}

	hasCredentials := len(credentials) > 0 || req.BreevoAPIKey != "" || req.SendGridAPIKey != "" || req.MailerSendAPIKey != ""

	if !hasCredentials {
		utils.SendEmailErrorResponse(w, http.StatusBadRequest, "No email provider credentials provided. Send a Chitthi API key (Authorization Bearer or X-Chitthi-API-Key), or pass provider keys in headers or request body.", "NO_CREDENTIALS_PROVIDED")
		return
	}

	req.Credentials = credentials

	result := h.service.SendEmail(r.Context(), &req)

	if !result.Success {
		utils.SendEmailErrorResponse(w, http.StatusInternalServerError, "Failed to send email: "+result.Error.Error(), "EMAIL_SEND_FAILED")
		return
	}

	utils.SendEmailSuccessResponse(w, result.EmailData)
}

func extractCredentialsFromHeaders(r *http.Request) map[string]string {
	credentials := make(map[string]string)

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

	return credentials
}
