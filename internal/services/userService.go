package services

import (
	"context"
	"errors"
	"strings"

	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/model"
)

type UserService struct {
	userDAO *postgres.UserDAO
}

func NewUserService(userDAO *postgres.UserDAO) *UserService {
	return &UserService{userDAO: userDAO}
}

// UpsertGoogleUser creates or updates a user from Google profile data (keyed by email).
func (s *UserService) UpsertGoogleUser(ctx context.Context, email, name string) (*model.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	if email == "" {
		return nil, errors.New("email required")
	}
	if name == "" {
		if at := strings.Index(email, "@"); at > 0 {
			name = email[:at]
		} else {
			name = email
		}
	}

	return s.userDAO.UpsertGoogleUser(ctx, name, email)
}

func (s *UserService) UpdateOnboardingStatus(ctx context.Context, userID uint, isOnboarded bool) error {
	return s.userDAO.UpdateOnboardingStatus(ctx, userID, isOnboarded)
}

func (s *UserService) GetUserByID(ctx context.Context, userID uint) (*model.User, error) {
	return s.userDAO.GetUserByID(ctx, userID)
}
