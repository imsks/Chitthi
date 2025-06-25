package adapters

import (
	"log"

	"github.com/imsks/chitthi/internal/config"
)

func CreateProviders(cfg config.Config) []EmailProvider {
	providers := []EmailProvider{}

	if cfg.BreevoAPIKey != "" {
		providers = append(providers, &BreevoAdapter{APIKey: cfg.BreevoAPIKey})
		log.Println("🚀 Breevo provider added")
	}

	if cfg.MailerSendAPIKey != "" {
		providers = append(providers, &MailerSendAdapter{APIKey: cfg.MailerSendAPIKey})
		log.Println("🚀 MailerSend provider added")
	}

	if len(providers) == 0 {
		log.Println("No email providers configured")
	}

	return providers
}
