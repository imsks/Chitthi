package email

import (
	"context"
	"fmt"
	"log"

	"github.com/imsks/chitthi/internal/config"
	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

type Service struct {
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
		providers: providers,
	}
}

// SendEmailResult represents the result of email sending operation
type SendEmailResult struct {
	Success   bool
	Provider  string
	Error     error
	EmailData *model.EmailData
}

func (s *Service) SendEmail(_ context.Context, req *EmailRequest) *SendEmailResult {
	emailReq := model.EmailRequest{
		FromEmail:   req.FromEmail,
		FromName:    req.FromName,
		ToEmail:     req.ToEmail,
		ToName:      req.ToName,
		Subject:     req.Subject,
		HTMLContent: req.HTMLContent,
	}

	// Create providers from headers first
	headerProviders := s.createProvidersFromHeaders(req.Credentials)

	// Detect provider from headers
	detectedProvider := s.detectProviderFromHeaders(req.Credentials)

	var provider adapters.EmailProvider
	var providerName string
	var err error

	// If specific provider is requested, validate it matches detected provider
	if req.Provider != "" {
		if detectedProvider != "" && req.Provider != detectedProvider {
			log.Printf("⚠️  Provider mismatch: requested '%s' but detected '%s' from headers", req.Provider, detectedProvider)
			return &SendEmailResult{
				Success: false,
				Error:   fmt.Errorf("provider mismatch: requested '%s' but detected '%s' from headers", req.Provider, detectedProvider),
				EmailData: &model.EmailData{
					SentTo:   req.ToEmail,
					SentFrom: req.FromEmail,
					Subject:  req.Subject,
					Provider: req.Provider,
				},
			}
		}
		providerName = req.Provider
	} else {
		// Use detected provider from headers
		if detectedProvider == "" {
			// No provider detected from headers, try fallback providers
			if len(s.providers) == 0 {
				return &SendEmailResult{
					Success: false,
					Error:   adapters.ErrNoProvidersAvailable,
					EmailData: &model.EmailData{
						SentTo:   req.ToEmail,
						SentFrom: req.FromEmail,
						Subject:  req.Subject,
					},
				}
			}

			// Try fallback providers
			var lastError error
			for _, p := range s.providers {
				err := p.SendEmail(emailReq)
				if err == nil {
					providerName = p.GetName()
					log.Printf("📧 Email sent successfully via fallback provider: %s", providerName)
					break
				}
				lastError = err
				log.Printf("⚠️  Fallback provider %s failed: %v", p.GetName(), err)
			}

			if lastError != nil {
				log.Printf("email send failed (fallback): %v", lastError)
				return &SendEmailResult{
					Success:  false,
					Error:    lastError,
					Provider: "all_failed",
					EmailData: &model.EmailData{
						SentTo:   req.ToEmail,
						SentFrom: req.FromEmail,
						Subject:  req.Subject,
						Provider: "all_failed",
					},
				}
			}
		} else {
			providerName = detectedProvider
			log.Printf("📧 Using detected provider: %s", providerName)
		}
	}

	// If we have header providers, try them first
	if len(headerProviders) > 0 {
		var lastError error
		for _, p := range headerProviders {
			err := p.SendEmail(emailReq)
			if err == nil {
				providerName = p.GetName()
				log.Printf("📧 Email sent successfully via header provider: %s", providerName)
				break
			}
			lastError = err
			log.Printf("⚠️  Header provider %s failed: %v", p.GetName(), err)
		}

		if lastError != nil {
			// Try fallback providers if header providers failed
			if len(s.providers) > 0 {
				for _, p := range s.providers {
					err := p.SendEmail(emailReq)
					if err == nil {
						providerName = p.GetName()
						log.Printf("📧 Email sent successfully via fallback provider: %s", providerName)
						break
					}
					lastError = err
					log.Printf("⚠️  Fallback provider %s failed: %v", p.GetName(), err)
				}
			}

			if lastError != nil {
				log.Printf("email send failed (header + fallback): %v", lastError)
				return &SendEmailResult{
					Success:  false,
					Error:    lastError,
					Provider: "all_failed",
					EmailData: &model.EmailData{
						SentTo:   req.ToEmail,
						SentFrom: req.FromEmail,
						Subject:  req.Subject,
						Provider: "all_failed",
					},
				}
			}
		}
	} else {
		// No header providers, try legacy API keys in request body
		if req.BreevoAPIKey != "" || req.SendGridAPIKey != "" || req.MailerSendAPIKey != "" {
			provider, err = adapters.GetProviderFromRequest(req.BreevoAPIKey, req.SendGridAPIKey, req.MailerSendAPIKey)
			if err != nil {
				log.Printf("Failed to create provider from user API keys: %v", err)
				return &SendEmailResult{
					Success: false,
					Error:   err,
					EmailData: &model.EmailData{
						SentTo:   req.ToEmail,
						SentFrom: req.FromEmail,
						Subject:  req.Subject,
					},
				}
			}
			providerName = provider.GetName()
			log.Printf("📧 Using user-provided API key for provider: %s", providerName)

			err = provider.SendEmail(emailReq)
			if err != nil {
				log.Printf("email send failed: provider=%s err=%v", providerName, err)
				return &SendEmailResult{
					Success:  false,
					Error:    err,
					Provider: providerName,
					EmailData: &model.EmailData{
						SentTo:   req.ToEmail,
						SentFrom: req.FromEmail,
						Subject:  req.Subject,
						Provider: providerName,
					},
				}
			}
		}
	}

	return &SendEmailResult{
		Success:  true,
		Provider: providerName,
		EmailData: &model.EmailData{
			SentTo:   req.ToEmail,
			SentFrom: req.FromEmail,
			Subject:  req.Subject,
			Provider: providerName,
		},
	}
}

// getProviderByName finds a provider by name from the available providers
func (s *Service) getProviderByName(name string) (adapters.EmailProvider, error) {
	for _, provider := range s.providers {
		if provider.GetName() == name {
			return provider, nil
		}
	}
	return nil, fmt.Errorf("provider '%s' not found or not available", name)
}

// createProvidersFromHeaders creates providers from header credentials
func (s *Service) createProvidersFromHeaders(credentials map[string]string) []adapters.EmailProvider {
	var providers []adapters.EmailProvider

	// Create Breevo provider if API key is provided
	if apiKey := credentials["breevo_api_key"]; apiKey != "" {
		providers = append(providers, &adapters.BreevoAdapter{APIKey: apiKey})
	}

	// Create SendGrid provider if API key is provided
	if apiKey := credentials["sendgrid_api_key"]; apiKey != "" {
		region := credentials["sendgrid_region"]
		if region == "" {
			region = "global" // Default to global
		}
		providers = append(providers, adapters.NewSendGridAdapter(apiKey, region))
	}

	// Create MailerSend provider if API key is provided
	if apiKey := credentials["mailersend_api_key"]; apiKey != "" {
		providers = append(providers, &adapters.MailerSendAdapter{APIKey: apiKey})
	}

	return providers
}

// getProviderFromList finds a provider by name from a list of providers
func (s *Service) getProviderFromList(providers []adapters.EmailProvider, name string) adapters.EmailProvider {
	for _, provider := range providers {
		if provider.GetName() == name {
			return provider
		}
	}
	return nil
}

// detectProviderFromHeaders automatically detects which provider to use based on headers
func (s *Service) detectProviderFromHeaders(credentials map[string]string) string {
	if credentials["breevo_api_key"] != "" {
		return "breevo"
	}
	if credentials["sendgrid_api_key"] != "" {
		return "sendgrid"
	}
	if credentials["mailersend_api_key"] != "" {
		return "mailersend"
	}

	return "" // No provider detected
}
