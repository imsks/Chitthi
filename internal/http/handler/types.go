package handler

import "github.com/golang-jwt/jwt/v5"

type CustomClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

type GoogleAuthRequest struct {
	Credential string `json:"credential"`
}

type AddProviderAPIKeyRequest struct {
	Provider string `json:"provider"`
	APIKey   string `json:"api_key"`
}
