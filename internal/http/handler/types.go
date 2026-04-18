package handler

import "github.com/golang-jwt/jwt/v5"

type CustomClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AddProviderAPIKeyRequest struct {
	Provider string `json:"provider"`
	APIKey   string `json:"api_key"`
}

type SignupRequest struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Profession string `json:"profession"`
}
