package handler

import (
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/model"
	"google.golang.org/api/idtoken"
)

type UserService interface {
	UpsertGoogleUser(ctx context.Context, email, name string) (*model.User, error)
	UpdateOnboardingStatus(ctx context.Context, userID uint, isOnboarded bool) error
	GetUserByID(ctx context.Context, userID uint) (*model.User, error)
}

type AuthHandler struct {
	userService UserService
}

func NewAuthHandler(userService UserService) *AuthHandler {
	return &AuthHandler{userService: userService}
}

func parseGoogleProfile(ctx context.Context, credential string) (email, name string, httpCode int, errMsg string) {
	if credential == "" {
		return "", "", 400, "invalid request"
	}

	cfg := config.LoadConfig()
	if cfg.GoogleClientID == "" {
		log.Println("GOOGLE_CLIENT_ID is not set")
		return "", "", 500, "Google Sign-In is not configured"
	}

	payload, err := idtoken.Validate(ctx, credential, cfg.GoogleClientID)
	if err != nil {
		log.Println("Google ID token validation failed:", err)
		return "", "", 401, "invalid Google credential"
	}

	email, _ = payload.Claims["email"].(string)
	if email == "" {
		return "", "", 401, "email not present in Google account"
	}

	if !isEmailVerified(payload.Claims["email_verified"]) {
		return "", "", 401, "Google email must be verified"
	}

	name, _ = payload.Claims["name"].(string)
	return email, name, 0, ""
}

// GoogleUpsertHandler validates a Google ID token and upserts the user (no session cookie).
// Used by the Next.js app after NextAuth sign-in.
func (h *AuthHandler) GoogleUpsertHandler(c *gin.Context) {
	var req GoogleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	email, name, code, msg := parseGoogleProfile(c.Request.Context(), req.Credential)
	if code != 0 {
		c.JSON(code, gin.H{"error": msg})
		return
	}

	user, err := h.userService.UpsertGoogleUser(c.Request.Context(), email, name)
	if err != nil {
		log.Println("UpsertGoogleUser failed:", err)
		c.JSON(500, gin.H{"error": "failed to sync user"})
		return
	}

	c.JSON(200, gin.H{"user": user})
}

func (h *AuthHandler) GoogleAuthHandler(c *gin.Context) {
	var req GoogleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	email, name, code, msg := parseGoogleProfile(c.Request.Context(), req.Credential)
	if code != 0 {
		c.JSON(code, gin.H{"error": msg})
		return
	}

	user, err := h.userService.UpsertGoogleUser(c.Request.Context(), email, name)
	if err != nil {
		log.Println("UpsertGoogleUser failed:", err)
		c.JSON(500, gin.H{"error": "failed to sign in"})
		return
	}

	cfg := config.LoadConfig()
	claims := CustomClaims{
		UserID: uint(user.ID),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			Issuer:    cfg.ApplicationName,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to generate token"})
		return
	}

	c.SetCookie("jwt", tokenString, 3600*24, "/", "", false, true)

	c.JSON(200, gin.H{"logged_in": true, "user": user})
}

func isEmailVerified(raw any) bool {
	switch v := raw.(type) {
	case bool:
		return v
	case string:
		return v == "true" || v == "1"
	case float64:
		return v != 0
	default:
		return false
	}
}

func (h *AuthHandler) LogoutHandler(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", "", false, true)
	c.JSON(200, gin.H{"logged_out": true})
}

func (h *AuthHandler) UpdateOnboardingStatusHandler(c *gin.Context) {
	userID := c.GetUint("user_id")

	err := h.userService.UpdateOnboardingStatus(c.Request.Context(), userID, true)
	if err != nil {
		log.Println("Error updating onboarding status:", err)
		c.JSON(500, gin.H{"error": "failed to update onboarding status"})
		return
	}

	c.JSON(200, gin.H{"message": "Onboarding status updated successfully"})
}

func (h *AuthHandler) GetMeHandler(c *gin.Context) {
	userID := c.GetUint("user_id")

	user, err := h.userService.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		log.Println("Error fetching current user:", err)
		c.JSON(500, gin.H{"error": "failed to fetch user"})
		return
	}

	c.JSON(200, gin.H{"user": user})
}
