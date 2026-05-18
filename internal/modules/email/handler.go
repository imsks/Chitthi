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

	chitthiKey := ChitthiAPIKeyFromBodyOrHeader(r, req.APIKey)
	if chitthiKey == "" || strings.TrimSpace(req.ToEmail) == "" || strings.TrimSpace(req.Subject) == "" || strings.TrimSpace(req.HTMLContent) == "" {
		utils.SendEmailErrorResponse(w, http.StatusBadRequest, "Missing required fields: api_key (or Authorization / X-Chitthi-API-Key), to_email, subject and html_content", "MISSING_REQUIRED_FIELDS")
		return
	}

	if h.resolver == nil {
		utils.SendEmailErrorResponse(w, http.StatusInternalServerError, "Email resolver is not configured", "EMAIL_RESOLVER_NOT_CONFIGURED")
		return
	}

	providerCredentials, err := h.resolver.ResolveAll(r.Context(), chitthiKey)
	if err != nil {
		msg := err.Error()
		if strings.Contains(msg, "invalid or expired Chitthi API key") {
			utils.SendEmailErrorResponse(w, http.StatusUnauthorized, msg, "CHITTHI_KEY_INVALID")
			return
		}
		utils.SendEmailErrorResponse(w, http.StatusUnprocessableEntity, msg, "CHITTHI_PROVIDER_RESOLVE_FAILED")
		return
	}

	result := h.service.SendEmailWithProviders(r.Context(), &req, providerCredentials)

	if !result.Success {
		utils.SendEmailErrorResponse(w, http.StatusInternalServerError, "Failed to send email: "+result.Error.Error(), "EMAIL_SEND_FAILED")
		return
	}

	utils.SendEmailSuccessResponse(w, result.EmailData)
}
