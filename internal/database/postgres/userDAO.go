package postgres

import (
	"context"

	"github.com/imsks/chitthi/internal/model"
	"github.com/jackc/pgx/v5"
)

type UserDAO struct {
	conn *pgx.Conn
}

func NewUserDAO(conn *pgx.Conn) *UserDAO {
	return &UserDAO{conn: conn}
}

// CreateUserGoogle inserts a user created via Google Sign-In (no password).
func (dao *UserDAO) CreateUserGoogle(ctx context.Context, user model.User) (int64, error) {
	var userID int64
	err := dao.conn.QueryRow(
		ctx,
		`INSERT INTO users (name, email, password_hash, is_onboarded, profession)
		 VALUES ($1, $2, NULL, $3, $4) RETURNING id`,
		user.Name, user.Email, user.IsOnboarded, user.Profession,
	).Scan(&userID)
	if err != nil {
		return 0, err
	}
	return userID, nil
}

func (dao *UserDAO) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	err := dao.conn.QueryRow(
		ctx,
		`SELECT id, name, email, is_onboarded, profession, created_at, updated_at
		 FROM users WHERE email = $1`,
		email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.IsOnboarded, &user.Profession, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (dao *UserDAO) UpdateOnboardingStatus(ctx context.Context, userID uint, isOnboarded bool) error {
	_, err := dao.conn.Exec(ctx, "UPDATE users SET is_onboarded = $1 WHERE id = $2", isOnboarded, userID)
	return err
}

func (dao *UserDAO) UpsertGoogleUser(ctx context.Context, name, email string) (*model.User, error) {
	var user model.User
	err := dao.conn.QueryRow(
		ctx,
		`INSERT INTO users (name, email, password_hash, is_onboarded, profession)
		 VALUES ($1, $2, NULL, FALSE, NULL)
		 ON CONFLICT (email) DO UPDATE SET
		   name = EXCLUDED.name,
		   updated_at = NOW()
		 RETURNING id, name, email, is_onboarded, profession, created_at, updated_at`,
		name, email,
	).Scan(&user.ID, &user.Name, &user.Email, &user.IsOnboarded, &user.Profession, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
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
