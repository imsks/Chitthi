package http

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/http/handler"
	"github.com/imsks/chitthi/internal/middleware"
	"github.com/imsks/chitthi/internal/modules/email"
	"github.com/imsks/chitthi/internal/services"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SetupRouter configures all HTTP routes on a single Gin engine (including /send-email).
func SetupRouter(cfg *config.Config, pool *pgxpool.Pool, version string) *gin.Engine {
	userDAO := postgres.NewUserDAO(pool)
	providerAPIKeysDAO := postgres.NewProviderAPIKeysDAO(pool)
	apiKeysDAO := postgres.NewAPIKeyDAO(pool)

	userService := services.NewUserService(userDAO)
	providerAPIKeysService := services.NewAPIKeyService(apiKeysDAO, providerAPIKeysDAO)

	authHandler := handler.NewAuthHandler(userService)
	apiKeyHandler := handler.NewAPIKeyHandler(providerAPIKeysService)

	emailService := email.NewService(*cfg)
	chitthiResolver := email.NewChitthiResolver(apiKeysDAO, providerAPIKeysDAO)
	emailHandler := email.NewHandler(emailService, chitthiResolver)

	engine := gin.Default()
	engine.Use(middleware.GinCORSMiddleware())

	engine.GET("/", func(c *gin.Context) {
		c.String(200, fmt.Sprintf("📮 Welcome to Chitthi %s - BYOK Email Delivery Service", version))
	})

	engine.GET("/version", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"version":   version,
			"service":   "Chitthi Email Service",
			"status":    "running",
			"timestamp": fmt.Sprintf("%d", time.Now().Unix()),
		})
	})

	engine.POST("/send-email", gin.WrapF(emailHandler.SendEmail))

	engine.POST("/api/v1/auth/google", authHandler.GoogleAuthHandler)
	engine.POST("/api/v1/auth/upsert", authHandler.GoogleUpsertHandler)
	engine.POST("/api/v1/auth/logout", authHandler.LogoutHandler)

	authGroup := engine.Group("/api/v1")
	authGroup.Use(middleware.AuthMiddleware(cfg))
	{
		authGroup.GET("/user/me", authHandler.GetMeHandler)
		authGroup.POST("/user/onboarding", authHandler.UpdateOnboardingStatusHandler)
		authGroup.POST("/apikeys", apiKeyHandler.CreateAPIKeyHandler)
		authGroup.POST("/apikeys/provider", apiKeyHandler.AddProviderAPIKeyHandler)
		authGroup.GET("/apikeys", apiKeyHandler.GetAPIKeysHandler)
		authGroup.GET("/apikeys/provider", apiKeyHandler.GetProviderAPIKeysHandler)
		authGroup.DELETE("/apikeys/provider/:provider", apiKeyHandler.DeleteProviderAPIKeyHandler)
		authGroup.DELETE("/apikeys/:api_key", apiKeyHandler.DeleteAPIKeyHandler)
	}

	return engine
}
