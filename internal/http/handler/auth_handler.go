package handler

import (
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/model"
)

type UserService interface {
	Authenticate(email, password string) (*model.User, error)
	CreateUser(context context.Context, user model.User, password string) (*model.User, error)
}

type AuthHandler struct {
	userService UserService
}

func NewAuthHandler(userService UserService) *AuthHandler {
	return &AuthHandler{userService: userService}
}

func (h *AuthHandler) LoginHandler(c *gin.Context) {
	// 1. Authenticate user credentials against database

	var loginReq LoginRequest

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	// Look up user in DB and verify password
	user, err := h.userService.Authenticate(loginReq.Email, loginReq.Password)
	if err != nil {
		log.Println("Authentication failed:", err)
		c.JSON(401, gin.H{"error": "invalid credentials"})
		return
	}
	// 2. If valid, create claims

	claims := CustomClaims{
		UserID: uint(user.ID),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			Issuer:    config.LoadConfig().ApplicationName,
		},
	}

	// 3. Create token and sign with secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.LoadConfig().JWTSecret))
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to generate token"})
		return
	}

	c.SetCookie("jwt", tokenString, 3600*24, "/", "", false, true)

	// 4. Return token to client (e.g., in JSON or a secure cookie)
	c.JSON(200, gin.H{"logged_in": true})
}

func (h *AuthHandler) SignupHandler(c *gin.Context) {
	var signupReq SignupRequest

	if err := c.ShouldBindJSON(&signupReq); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}
	user := model.User{
		Name:        signupReq.Name,
		Email:       signupReq.Email,
		Profession:  &signupReq.Profession,
		IsOnboarded: false,
	}
	createdUser, err := h.userService.CreateUser(c.Request.Context(), user, signupReq.Password)
	if err != nil {
		log.Println("Error creating user:", err)
		c.JSON(500, gin.H{"error": "failed to create user"})
		return
	}

	c.JSON(201, gin.H{"user": createdUser})
}
