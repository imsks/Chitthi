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

// SendEmailResult represents the result of email sending operation
type SendEmailResult struct {
	Success   bool
	Provider  string
	Error     error
	EmailData *model.EmailData
}

func (s *Service) SendEmail(ctx context.Context, req *EmailRequest) *SendEmailResult {
	emailReq := model.EmailRequest{
		FromEmail:   req.FromEmail,
		FromName:    req.FromName,
		ToEmail:     req.ToEmail,
		ToName:      req.ToName,
		Subject:     req.Subject,
		HTMLContent: req.HTMLContent,
		Provider:    req.Provider,
	}

	var provider adapters.EmailProvider
	var providerName string
	var err error

	// Create providers from headers first
	headerProviders := s.createProvidersFromHeaders(req.Credentials)

	// If specific provider is requested, try to use it from headers
	if req.Provider != "" {
		provider = s.getProviderFromList(headerProviders, req.Provider)
		if provider == nil {
			// Try fallback providers
			provider, err = s.getProviderByName(req.Provider)
			if err != nil {
				log.Printf("Requested provider '%s' not available: %v", req.Provider, err)
				return &SendEmailResult{
					Success: false,
					Error:   err,
					EmailData: &model.EmailData{
						SentTo:   req.ToEmail,
						SentFrom: req.FromEmail,
						Subject:  req.Subject,
						Provider: req.Provider,
					},
				}
			}
		}
		providerName = req.Provider
		log.Printf("📧 Using requested provider: %s", providerName)
	} else {
		// Try header-based providers first, then fallback to config-based providers
		if len(headerProviders) > 0 {
			// Try each header provider until one succeeds
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

			if lastError != nil && len(s.providers) > 0 {
				// Try fallback providers if header providers failed
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
				// Log failure but don't return error - email sending failed
				s.logEmailAttempt(ctx, req, "all_failed", "failed", lastError)
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
			// Try to get provider from user-provided API keys (legacy support)
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
			} else {
				// Fallback to config-based providers with load balancing
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
					// Log failure but don't return error - email sending failed
					s.logEmailAttempt(ctx, req, "all_failed", "failed", lastError)
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
		}
	}

	// If we have a specific provider, send the email
	if provider != nil {
		err = provider.SendEmail(emailReq)
		if err != nil {
			// Log failure but don't return error - email sending failed
			s.logEmailAttempt(ctx, req, providerName, "failed", err)
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
		log.Printf("📧 Email sent successfully via provider: %s", providerName)
	}

	// Email sent successfully, now log it
	logResult := s.logEmailAttempt(ctx, req, providerName, "sent", nil)

	return &SendEmailResult{
		Success:  true,
		Provider: providerName,
		EmailData: &model.EmailData{
			SentTo:   req.ToEmail,
			SentFrom: req.FromEmail,
			Subject:  req.Subject,
			Provider: providerName,
			LogSaved: logResult.Success,
			LogID:    logResult.LogID,
			LogError: logResult.Error,
		},
	}
}

// LogResult represents the result of logging operation
type LogResult struct {
	Success bool
	LogID   *int
	Error   string
}

// logEmailAttempt logs email attempt and returns result without affecting email sending
func (s *Service) logEmailAttempt(ctx context.Context, req *EmailRequest, provider, status string, emailError error) *LogResult {
	logEntry := &EmailLog{
		RecipientEmail: req.ToEmail,
		Subject:        req.Subject,
		Provider:       provider,
		Status:         status,
	}

	err := s.repo.InsertLog(ctx, logEntry)
	if err != nil {
		// Log the error but don't affect email sending
		log.Printf("⚠️  Failed to log email attempt: %v", err)
		return &LogResult{
			Success: false,
			Error:   err.Error(),
		}
	}

	return &LogResult{
		Success: true,
		LogID:   &logEntry.ID,
	}
}

func (s *Service) GetLogs(ctx context.Context, limit int) ([]EmailLog, error) {
	return s.repo.GetLogs(ctx, limit)
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
		providers = append(providers, &adapters.SendGridAdapter{APIKey: apiKey})
	}

	// Create MailerSend provider if API key is provided
	if apiKey := credentials["mailersend_api_key"]; apiKey != "" {
		providers = append(providers, &adapters.MailerSendAdapter{APIKey: apiKey})
	}

	// Create SMTP provider if credentials are provided
	if host := credentials["smtp_host"]; host != "" {
		port := credentials["smtp_port"]
		if port == "" {
			port = "587" // Default port
		}
		username := credentials["smtp_username"]
		password := credentials["smtp_password"]
		from := credentials["smtp_from"]
		useTLS := credentials["smtp_use_tls"] == "true"

		if username != "" && password != "" {
			smtpAdapter := &adapters.SMTPAdapter{
				Host:     host,
				Port:     port,
				Username: username,
				Password: password,
				From:     from,
				UseTLS:   useTLS,
			}
			providers = append(providers, smtpAdapter)
		}
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
