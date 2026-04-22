package services

import (
	"context"

	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/model"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	// This service will handle user-related operations such as authentication,
	// profile management, and onboarding state. It will interact with the database
	// to fetch and update user information.
	userDAO *postgres.UserDAO
}

func NewUserService(userDAO *postgres.UserDAO) *UserService {
	return &UserService{userDAO: userDAO}
}

// Authenticate verifies user credentials and returns the user if valid.
func (s *UserService) Authenticate(email, password string) (*model.User, error) {
	// Validate user credentials (password comparison happens in the DAO using bcrypt)
	user, err := s.userDAO.ValidateUserCredentials(context.Background(), email, password)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) CreateUser(ctx context.Context, user model.User, password string) (*model.User, error) {
	// Hash the password
	passwordHash, err := HashPassword(password)
	if err != nil {
		return nil, err
	}

	// Create the user in the database
	userID, err := s.userDAO.CreateUser(ctx, user, passwordHash)
	if err != nil {
		return nil, err
	}

	user.ID = userID
	return &user, nil
}

func (s *UserService) UpdateOnboardingStatus(ctx context.Context, userID uint, isOnboarded bool) error {
	return s.userDAO.UpdateOnboardingStatus(ctx, userID, isOnboarded)
}

func (s *UserService) GetUserByID(ctx context.Context, userID uint) (*model.User, error) {
	return s.userDAO.GetUserByID(ctx, userID)
}

func HashPassword(password string) (string, error) {
	// Implement password hashing using bcrypt or a similar library
	// For example, using bcrypt:
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}
