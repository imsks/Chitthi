package postgres

import (
	"context"
	"log"

	"github.com/imsks/chitthi/internal/model"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserDAO struct {
	conn *pgx.Conn
}

func NewUserDAO(conn *pgx.Conn) *UserDAO {
	return &UserDAO{conn: conn}
}

func (dao *UserDAO) CreateUser(ctx context.Context, user model.User, passwordHash string) (int64, error) {
	var userID int64
	err := dao.conn.QueryRow(
		ctx,
		`INSERT INTO users (name, email, password_hash, is_onboarded, profession) 
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		user.Name, user.Email, passwordHash, user.IsOnboarded, user.Profession,
	).Scan(&userID)
	if err != nil {
		return 0, err
	}
	return userID, nil
}

func (dao *UserDAO) ValidateUserCredentials(ctx context.Context, email, hashedPassword string) (*model.User, error) {
	// Implement logic to fetch user by email and compare password hash
	// For example:
	var user model.User
	var passwordHash string
	err := dao.conn.QueryRow(
		ctx,
		`SELECT id, name, email, is_onboarded, profession, created_at, updated_at, password_hash 
		 FROM users WHERE email = $1`, email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.IsOnboarded, &user.Profession, &user.CreatedAt, &user.UpdatedAt, &passwordHash)
	if err != nil {
		return nil, err
	}

	log.Println("fetched user:", user)

	// Compare the provided plain password against the stored bcrypt hash
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(hashedPassword)); err != nil {
		return nil, pgx.ErrNoRows
	}

	return &user, nil
}

func (dao *UserDAO) UpdateOnboardingStatus(ctx context.Context, userID uint, isOnboarded bool) error {
	_, err := dao.conn.Exec(ctx, "UPDATE users SET is_onboarded = $1 WHERE id = $2", isOnboarded, userID)
	return err
}

func (dao *UserDAO) GetUserByID(ctx context.Context, userID uint) (*model.User, error) {
	var user model.User
	err := dao.conn.QueryRow(
		ctx,
		`SELECT id, name, email, is_onboarded, profession, created_at, updated_at
		 FROM users WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Name, &user.Email, &user.IsOnboarded, &user.Profession, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
