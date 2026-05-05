package services

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"strings"
	"time"

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

// NormalizeUserAPIKeyExpiry returns RFC3339 expiry; empty input defaults to one year from now (UTC).
func NormalizeUserAPIKeyExpiry(expiresAt string) string {
	if strings.TrimSpace(expiresAt) == "" {
		return time.Now().UTC().AddDate(1, 0, 0).Format(time.RFC3339)
	}
	return expiresAt
}

var (
	ErrSenderEmailRequired = errors.New("sender_email is required")
	ErrSenderEmailInvalid  = errors.New("sender_email must be a valid email address")
)

// ValidateSenderEmail checks a minimal RFC-like shape for onboarding BYOK senders.
func ValidateSenderEmail(email string) error {
	e := strings.TrimSpace(email)
	if e == "" {
		return ErrSenderEmailRequired
	}
	if strings.Count(e, "@") != 1 {
		return ErrSenderEmailInvalid
	}
	at := strings.LastIndex(e, "@")
	if at < 1 || at == len(e)-1 {
		return ErrSenderEmailInvalid
	}
	return nil
}

func (s *APIKeyServiceImpl) CreateAPIKey(userID uint, expiresAt string) (string, error) {
	apiKey := generateRandomAPIKey()
	expiresAt = NormalizeUserAPIKeyExpiry(expiresAt)
	_, err := s.apiKeyDAO.CreateAPIKey(context.Background(), userID, apiKey, expiresAt)
	if err != nil {
		return "", err
	}
	return apiKey, nil
}

func (s *APIKeyServiceImpl) AddProviderAPIKey(ctx context.Context, userID uint, provider string, apiKey string, senderEmail string) error {
	if err := ValidateSenderEmail(senderEmail); err != nil {
		return err
	}
	providerID, err := s.providerApiKeyDAO.GetProviderIDByName(ctx, provider)
	if err != nil {
		return err
	}
	_, err = s.providerApiKeyDAO.AddProviderAPIKey(ctx, userID, providerID, apiKey, strings.TrimSpace(senderEmail))
	return err
}

func (s *APIKeyServiceImpl) GetProviderAPIKey(ctx context.Context, userID uint, provider string) (string, error) {
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
	return s.apiKeyDAO.GetAPIKeys(context.Background(), userID)
}

func (s *APIKeyServiceImpl) GetProviderAPIKeys(ctx context.Context, userID uint) ([]string, error) {
	return s.providerApiKeyDAO.GetConfiguredProviderNames(ctx, userID)
}

func (s *APIKeyServiceImpl) DeleteAPIKey(userID uint, apiKey string) error {
	return nil // Replace with actual implementation
}
