package services

import (
	"context"
	"errors"
	"strings"

	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/model"
	"github.com/jackc/pgx/v5"
)

type UserService struct {
	userDAO *postgres.UserDAO
}

func NewUserService(userDAO *postgres.UserDAO) *UserService {
	return &UserService{userDAO: userDAO}
}

// FindOrCreateGoogleUser returns an existing user by email or creates one from Google profile data.
func (s *UserService) FindOrCreateGoogleUser(ctx context.Context, email, name string) (*model.User, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	if name == "" {
		if at := strings.Index(email, "@"); at > 0 {
			name = email[:at]
		} else {
			name = email
		}
	}

	user, err := s.userDAO.GetUserByEmail(ctx, email)
	if err == nil {
		return user, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	u := model.User{
		Name:        name,
		Email:       email,
		IsOnboarded: false,
		Profession:  nil,
	}
	id, err := s.userDAO.CreateUserGoogle(ctx, u)
	if err != nil {
		return nil, err
	}
	u.ID = id
	return &u, nil
}

func (s *UserService) UpdateOnboardingStatus(ctx context.Context, userID uint, isOnboarded bool) error {
	return s.userDAO.UpdateOnboardingStatus(ctx, userID, isOnboarded)
}

func (s *UserService) GetUserByID(ctx context.Context, userID uint) (*model.User, error) {
	return s.userDAO.GetUserByID(ctx, userID)
}
