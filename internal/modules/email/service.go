package email

import (
	"context"

	adapters "github.com/imsks/chitthi/internal/email"
	"github.com/imsks/chitthi/internal/model"
)

type Service struct {
	repo   *Repository
	breevo *adapters.BreevoAdapter
}

func NewService(breevoAPIKey string) *Service {
	return &Service{
		repo:   NewRepository(),
		breevo: &adapters.BreevoAdapter{APIKey: breevoAPIKey},
	}
}

func (s *Service) SendEmail(ctx context.Context, req *EmailRequest) error {
	// Convert to the model expected by the adapter
	emailReq := model.EmailRequest{
		FromEmail:   req.FromEmail,
		FromName:    req.FromName,
		ToEmail:     req.ToEmail,
		ToName:      req.ToName,
		Subject:     req.Subject,
		HTMLContent: req.HTMLContent,
	}

	// Send email
	err := s.breevo.SendEmail(emailReq)
	if err != nil {
		// Log failure
		s.repo.InsertLog(ctx, &EmailLog{
			RecipientEmail: req.ToEmail,
			Subject:        req.Subject,
			Provider:       "breevo",
			Status:         "failed",
		})
		return err
	}

	// Log success
	return s.repo.InsertLog(ctx, &EmailLog{
		RecipientEmail: req.ToEmail,
		Subject:        req.Subject,
		Provider:       "breevo",
		Status:         "sent",
	})
}

func (s *Service) GetLogs(ctx context.Context, limit int) ([]EmailLog, error) {
	return s.repo.GetLogs(ctx, limit)
}
