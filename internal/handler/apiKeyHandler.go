package handler

import (
	"github.com/gin-gonic/gin"
)

type APIKeyService interface {
	CreateAPIKey(userID uint) (string, error)
	GetAPIKeys(userID uint) ([]string, error)
	DeleteAPIKey(userID uint, apiKey string) error
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
