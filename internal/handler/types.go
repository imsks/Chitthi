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
