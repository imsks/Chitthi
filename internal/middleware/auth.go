package middleware

import (
	"crypto/subtle"
	"fmt"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/imsks/chitthi/internal/config"
)

const (
	headerBFFSecret = "X-Chitthi-BFF-Secret"
	headerUserID    = "X-User-ID"
)

// AuthMiddleware accepts trusted BFF headers from Next.js (when CHITTHI_BFF_SECRET matches)
// or falls back to the legacy jwt / Authorization bearer.
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	secretKey := []byte(cfg.JWTSecret)
	bffSecret := cfg.BFFSecret

	return func(c *gin.Context) {
		if len(bffSecret) > 0 {
			incoming := c.GetHeader(headerBFFSecret)
			if subtle.ConstantTimeCompare([]byte(incoming), []byte(bffSecret)) == 1 {
				uidStr := strings.TrimSpace(c.GetHeader(headerUserID))
				if uidStr == "" {
					c.AbortWithStatusJSON(401, gin.H{"error": "Missing user id"})
					return
				}
				uid64, err := strconv.ParseUint(uidStr, 10, 32)
				if err != nil || uid64 == 0 {
					c.AbortWithStatusJSON(401, gin.H{"error": "Invalid user id"})
					return
				}
				c.Set("user_id", uint(uid64))
				c.Next()
				return
			}
		}

		tokenString, _ := c.Cookie("jwt")

		if tokenString == "" {
			authHeader := c.GetHeader("Authorization")
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		}
		if tokenString == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "Missing token"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return secretKey, nil
		})

		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
			return
		}

		userClaims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
			return
		}

		rawUID, ok := userClaims["user_id"].(float64)
		if !ok {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
			return
		}

		c.Set("user_id", uint(rawUID))
		c.Next()
	}
}
