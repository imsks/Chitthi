package handler

import (
	"context"

	"github.com/gin-gonic/gin"
)

type APIKeyService interface {
	CreateAPIKey(userID uint) (string, error)
	GetAPIKeys(userID uint) ([]string, error)
	DeleteAPIKey(userID uint, apiKey string) error
	AddProviderAPIKey(ctx context.Context, userID uint, provider string, apiKey string) error
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

	// Implement logic to create API key for the user
	// For example, generate a random API key, store it in the database with association to userID, and return it to the client
	apiKey, err := h.apiKeyService.CreateAPIKey(userID.(uint))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create API key"})
		return
	}

	c.JSON(200, gin.H{"api_key": apiKey})
}

func (h *APIKeyHandler) AddProviderAPIKeyHandler(c *gin.Context) {
	userID := c.GetUint("user_id")

	var apiKeyRequest AddProviderAPIKeyRequest
	if err := c.ShouldBindJSON(&apiKeyRequest); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	// Implement logic to associate the provided API key with the user's account in the database
	err := h.apiKeyService.AddProviderAPIKey(c.Request.Context(), userID, apiKeyRequest.Provider, apiKeyRequest.APIKey)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to add provider API key"})
		return
	}

	c.JSON(200, gin.H{"message": "Provider API key added successfully"})
}
