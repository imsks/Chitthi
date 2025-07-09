package adapters

import (
	"errors"
	"log"

	"github.com/imsks/chitthi/internal/config"
)

// CreateProvidersFromConfig creates providers from application config
func CreateProvidersFromConfig(cfg config.Config) []EmailProvider {
	providers := []EmailProvider{}

	if cfg.BreevoAPIKey != "" {
		providers = append(providers, &BreevoAdapter{APIKey: cfg.BreevoAPIKey})
		log.Println("🚀 Breevo provider added from config")
	}

	if cfg.SendGridAPIKey != "" {
		providers = append(providers, &SendGridAdapter{APIKey: cfg.SendGridAPIKey})
		log.Println("🚀 SendGrid provider added from config")
	}

	if cfg.MailerSendAPIKey != "" {
		providers = append(providers, &MailerSendAdapter{APIKey: cfg.MailerSendAPIKey})
		log.Println("🚀 MailerSend provider added from config")
	}

	if len(providers) == 0 {
		log.Println("No email providers configured")
	}

	return providers
}

// CreateProviderFromAPIKey creates a single provider based on the provided API key
func CreateProviderFromAPIKey(apiKey, keyName string) (EmailProvider, error) {
	if apiKey == "" {
		return nil, errors.New("API key cannot be empty")
	}

	switch keyName {
	case "BREEVO_API_KEY":
		return &BreevoAdapter{APIKey: apiKey}, nil
	case "SENDGRID_API_KEY":
		return &SendGridAdapter{APIKey: apiKey}, nil
	case "MAILERSEND_API_KEY":
		return &MailerSendAdapter{APIKey: apiKey}, nil
	default:
		return nil, errors.New("unsupported API key type: " + keyName)
	}
}

// GetProviderFromRequest determines which provider to use based on provided API keys
func GetProviderFromRequest(breevoKey, sendgridKey, mailersendKey string) (EmailProvider, error) {
	// Priority order: Breevo > SendGrid > MailerSend
	if breevoKey != "" {
		return CreateProviderFromAPIKey(breevoKey, "BREEVO_API_KEY")
	}
	if sendgridKey != "" {
		return CreateProviderFromAPIKey(sendgridKey, "SENDGRID_API_KEY")
	}
	if mailersendKey != "" {
		return CreateProviderFromAPIKey(mailersendKey, "MAILERSEND_API_KEY")
	}

	return nil, errors.New("no valid API key provided")
}
