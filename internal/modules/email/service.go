package email

import (
	"context"
	"log"

	"github.com/imsks/chitthi/internal/config"
	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

type Service struct {
	repo     *Repository
	balancer *adapters.LoadBalancer
}

func NewService(cfg config.Config) *Service {
	// Create providers from config
	providers := adapters.CreateProviders(cfg)

	// Create load balancer
	balancer := adapters.NewLoadBalancer(providers)

	// Log available providers
	availableProviders := balancer.GetAvailableProviders()
	log.Printf("🚀 Email service initialized with providers: %v", availableProviders)

	return &Service{
		repo:     NewRepository(),
		balancer: balancer,
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

	providerName, err := s.balancer.SendEmail(emailReq)

	if err != nil {
		logErr := s.repo.InsertLog(ctx, &EmailLog{
			RecipientEmail: req.ToEmail,
			Subject:        req.Subject,
			Provider:       "all_failed",
			Status:         "failed",
		})
		if logErr != nil {
			log.Printf("Failed to log email failure: %v", logErr)
		}
		return err
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
