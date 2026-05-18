package handler

import (
	"context"
	"errors"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/services"
)

type APIKeyService interface {
	CreateAPIKey(userID uint, expiresAt string) (string, error)
	GetAPIKeys(userID uint) ([]string, error)
	DeleteAPIKey(userID uint, apiKey string) error
	AddProviderAPIKey(ctx context.Context, userID uint, provider string, apiKey string, senderEmail string) error
	GetProviderCredentialSummaries(ctx context.Context, userID uint) ([]postgres.ProviderCredentialSummary, error)
	GetDefaultSenderEmail(ctx context.Context, userID uint) (string, error)
	DeleteProviderAPIKey(ctx context.Context, userID uint, provider string) error
}

type APIKeyHandler struct {
	apiKeyService APIKeyService
}

func NewAPIKeyHandler(apiKeyService APIKeyService) *APIKeyHandler {
	return &APIKeyHandler{apiKeyService: apiKeyService}
}

func (h *APIKeyHandler) CreateAPIKeyHandler(c *gin.Context) {
	// read user_id from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	expiresAt := c.Query("expiry")

	// Implement logic to create API key for the user
	// For example, generate a random API key, store it in the database with association to userID, and return it to the client
	apiKey, err := h.apiKeyService.CreateAPIKey(userID.(uint), expiresAt)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create API key"})
		return
	}

	c.JSON(200, gin.H{"api_key": apiKey})
}

func (h *APIKeyHandler) AddProviderAPIKeyHandler(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(uint)

	var apiKeyRequest AddProviderAPIKeyRequest
	if err := c.ShouldBindJSON(&apiKeyRequest); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	// Implement logic to associate the provided API key with the user's account in the database
	err := h.apiKeyService.AddProviderAPIKey(c.Request.Context(), userID, apiKeyRequest.Provider, apiKeyRequest.APIKey, apiKeyRequest.SenderEmail)
	if err != nil {
		log.Println("error when adding api key", err)
		status := 500
		if errors.Is(err, services.ErrSenderEmailRequired) ||
			errors.Is(err, services.ErrSenderEmailInvalid) ||
			errors.Is(err, services.ErrProviderAPIKeyRequired) {
			status = 400
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Provider API key added successfully"})
}

func (h *APIKeyHandler) GetAPIKeysHandler(c *gin.Context) {
	// read user_id from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// Implement logic to fetch all API keys for the user from the database and return them to the client
	apiKeys, err := h.apiKeyService.GetAPIKeys(userID.(uint))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch API keys"})
		return
	}

	c.JSON(200, gin.H{"api_keys": apiKeys})
}

func (h *APIKeyHandler) GetProviderAPIKeysHandler(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(uint)

	summaries, err := h.apiKeyService.GetProviderCredentialSummaries(c.Request.Context(), userID)
	if err != nil {
		log.Printf("GetProviderCredentialSummaries uid=%d err=%v", userID, err)
		c.JSON(500, gin.H{"error": "Failed to fetch provider API keys"})
		return
	}

	providers := make([]string, len(summaries))
	providerCreds := make([]gin.H, len(summaries))
	for i, row := range summaries {
		providers[i] = row.ProviderName
		providerCreds[i] = gin.H{
			"provider":     row.ProviderName,
			"sender_email": row.SenderEmail,
		}
	}

	defaultSender, err := h.apiKeyService.GetDefaultSenderEmail(c.Request.Context(), userID)
	if err != nil {
		log.Printf("GetDefaultSenderEmail uid=%d err=%v", userID, err)
		c.JSON(500, gin.H{"error": "Failed to fetch provider API keys"})
		return
	}

	c.JSON(200, gin.H{
		"providers":            providers,
		"provider_credentials": providerCreds,
		"default_sender_email": defaultSender,
	})
}

func (h *APIKeyHandler) DeleteProviderAPIKeyHandler(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDVal.(uint)

	provider := strings.TrimSpace(c.Param("provider"))
	if provider == "" {
		c.JSON(400, gin.H{"error": "provider is required"})
		return
	}

	err := h.apiKeyService.DeleteProviderAPIKey(c.Request.Context(), userID, provider)
	if err != nil {
		if errors.Is(err, services.ErrProviderCredentialNotFound) {
			c.JSON(404, gin.H{"error": err.Error()})
			return
		}
		log.Printf("DeleteProviderAPIKey uid=%d provider=%q err=%v", userID, provider, err)
		c.JSON(500, gin.H{"error": "Failed to remove provider credentials"})
		return
	}

	c.JSON(200, gin.H{"message": "Provider credentials removed"})
}

func (h *APIKeyHandler) DeleteAPIKeyHandler(c *gin.Context) {
	// read user_id from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	apiKey := c.Param("api_key")
	if apiKey == "" {
		c.JSON(400, gin.H{"error": "API key is required"})
		return
	}

	// Implement logic to delete the specified API key for the user from the database
	err := h.apiKeyService.DeleteAPIKey(userID.(uint), apiKey)
	if err != nil {
		if errors.Is(err, services.ErrChitthiAPIKeyNotFound) {
			c.JSON(404, gin.H{"error": err.Error()})
			return
		}
		log.Printf("DeleteAPIKey uid=%d err=%v", userID, err)
		c.JSON(500, gin.H{"error": "Failed to delete API key"})
		return
	}

	c.JSON(200, gin.H{"message": "API key deleted successfully"})
}
