package services

import (
	"context"
	"crypto/rand"
	"fmt"

	"github.com/imsks/chitthi/internal/database/postgres"
)

type APIKeyServiceImpl struct {
	// You can add dependencies like database connection here
	apiKeyDAO         *postgres.APIKeyDAO
	providerApiKeyDAO *postgres.ProviderAPIKeysDAO
}

func NewAPIKeyService(apiKeyDAO *postgres.APIKeyDAO, providerApiKeyDAO *postgres.ProviderAPIKeysDAO) *APIKeyServiceImpl {
	return &APIKeyServiceImpl{apiKeyDAO: apiKeyDAO, providerApiKeyDAO: providerApiKeyDAO}
}

func (s *APIKeyServiceImpl) CreateAPIKey(userID uint, expiresAt string) (string, error) {
	// Implement logic to generate a random API key, store it in the database with association to userID, and return it
	// For example:
	apiKey := generateRandomAPIKey() // Implement this function to generate a secure random API key
	_, err := s.apiKeyDAO.CreateAPIKey(context.Background(), userID, apiKey, expiresAt)
	if err != nil {
		return "", err
	}
	return apiKey, nil
}

func (s *APIKeyServiceImpl) AddProviderAPIKey(ctx context.Context, userID uint, provider string, apiKey string) error {
	// Implement logic to associate the provided API key with the user's account in the database
	providerID, err := s.providerApiKeyDAO.GetProviderIDByName(ctx, provider)
	if err != nil {
		return err
	}
	_, err = s.providerApiKeyDAO.AddProviderAPIKey(ctx, userID, providerID, apiKey)
	return err
}

func (s *APIKeyServiceImpl) GetProviderAPIKey(ctx context.Context, userID uint, provider string) (string, error) {
	// Implement logic to fetch the API key for the given provider and user from the database
	// validate for empty striung and return error if not found
	providerID, err := s.providerApiKeyDAO.GetProviderIDByName(ctx, provider)
	if err != nil {
		return "", err
	}
	apiKey, err := s.providerApiKeyDAO.GetProviderAPIKeys(ctx, userID, providerID)
	if err != nil {
		return "", err
	}
	if apiKey == "" {
		return "", fmt.Errorf("no API key found for provider %s", provider)
	}
	return apiKey, nil
}

func generateRandomAPIKey() string {
	// Implement a secure random API key generator, for example using crypto/rand
	key := make([]byte, 32) // 256-bit key
	_, err := rand.Read(key)
	if err != nil {
		// Handle error
		return ""
	}
	return fmt.Sprintf("%x", key) // Return the key as a hex string
}

func (s *APIKeyServiceImpl) GetAPIKeys(userID uint) ([]string, error) {
	// Implement logic to fetch all API keys for a given user from the database
	return s.apiKeyDAO.GetAPIKeys(context.Background(), userID)
}

func (s *APIKeyServiceImpl) DeleteAPIKey(userID uint, apiKey string) error {
	// Implement logic to delete the specified API key for the user from the database
	// You can add a method in your APIKeyDAO to handle this operation
	return nil // Replace with actual implementation
}
