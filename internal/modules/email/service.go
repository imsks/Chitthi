package email

import (
	"context"
	"log"

	"github.com/imsks/chitthi/internal/config"
	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

type Service struct {
	repo      *Repository
	providers []adapters.EmailProvider // Fallback providers from config
}

func NewService(cfg config.Config) *Service {
	// Create fallback providers from config
	providers := adapters.CreateProvidersFromConfig(cfg)

	// Log available fallback providers
	if len(providers) > 0 {
		var providerNames []string
		for _, p := range providers {
			providerNames = append(providerNames, p.GetName())
		}
		log.Printf("🚀 Email service initialized with fallback providers: %v", providerNames)
	} else {
		log.Println("⚠️  No fallback email providers configured")
	}

	return &Service{
		repo:      NewRepository(),
		providers: providers,
	}
}

func (s *Service) SendEmail(ctx context.Context, req *EmailRequest) error {
	emailReq := model.EmailRequest{
		FromEmail:   req.FromEmail,
		FromName:    req.FromName,
		ToEmail:     req.ToEmail,
		ToName:      req.ToName,
		Subject:     req.Subject,
		HTMLContent: req.HTMLContent,
	}

	var provider adapters.EmailProvider
	var providerName string
	var err error

	// Try to get provider from user-provided API keys first
	if req.BreevoAPIKey != "" || req.SendGridAPIKey != "" || req.MailerSendAPIKey != "" {
		provider, err = adapters.GetProviderFromRequest(req.BreevoAPIKey, req.SendGridAPIKey, req.MailerSendAPIKey)
		if err != nil {
			log.Printf("Failed to create provider from user API keys: %v", err)
			return err
		}
		providerName = provider.GetName()
		log.Printf("📧 Using user-provided API key for provider: %s", providerName)
	} else {
		// Fallback to config-based providers with load balancing
		if len(s.providers) == 0 {
			return adapters.ErrNoProvidersAvailable
		}

		// Simple failover - try each provider until one succeeds
		var lastError error
		for _, p := range s.providers {
			err := p.SendEmail(emailReq)
			if err == nil {
				providerName = p.GetName()
				log.Printf("📧 Email sent successfully via fallback provider: %s", providerName)
				break
			}
			lastError = err
			log.Printf("⚠️  Provider %s failed: %v", p.GetName(), err)
		}

		if lastError != nil {
			logErr := s.repo.InsertLog(ctx, &EmailLog{
				RecipientEmail: req.ToEmail,
				Subject:        req.Subject,
				Provider:       "all_failed",
				Status:         "failed",
			})
			if logErr != nil {
				log.Printf("Failed to log email failure: %v", logErr)
			}
			return lastError
		}
	}

	// If we have a provider from user API keys, send the email
	if provider != nil {
		err = provider.SendEmail(emailReq)
		if err != nil {
			logErr := s.repo.InsertLog(ctx, &EmailLog{
				RecipientEmail: req.ToEmail,
				Subject:        req.Subject,
				Provider:       providerName,
				Status:         "failed",
			})
			if logErr != nil {
				log.Printf("Failed to log email failure: %v", logErr)
			}
			return err
		}
		log.Printf("📧 Email sent successfully via user provider: %s", providerName)
	}

	return s.repo.InsertLog(ctx, &EmailLog{
		RecipientEmail: req.ToEmail,
		Subject:        req.Subject,
		Provider:       providerName,
		Status:         "sent",
	})
}

func (s *Service) GetLogs(ctx context.Context, limit int) ([]EmailLog, error) {
	return s.repo.GetLogs(ctx, limit)
}
