package http

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database"
	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/http/handler"
	"github.com/imsks/chitthi/internal/middleware"
	"github.com/imsks/chitthi/internal/modules/email"
	"github.com/imsks/chitthi/internal/services"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SetupRouter configures all HTTP routes on a single Gin engine (including /send-email).
func SetupRouter(cfg *config.Config, pool *pgxpool.Pool, version string) *gin.Engine {
	engine := gin.Default()
	engine.Use(middleware.GinCORSMiddleware())

	engine.GET("/", func(c *gin.Context) {
		c.String(200, fmt.Sprintf("📮 Welcome to Chitthi %s - BYOK Email Delivery Service", version))
	})

	// Liveness probe — always returns 200 if the process is running
	engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Readiness probe — returns 200 only when all dependencies are reachable
	engine.GET("/health/ready", func(c *gin.Context) {
		checks := gin.H{}
		ready := true

		if pool != nil {
			ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
			defer cancel()
			if err := pool.Ping(ctx); err != nil {
				checks["postgres"] = "unhealthy"
				ready = false
			} else {
				checks["postgres"] = "healthy"
			}
		} else {
			checks["postgres"] = "not_configured"
			ready = false
		}

		if database.Redis != nil {
			ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
			defer cancel()
			if err := database.Redis.Ping(ctx).Err(); err != nil {
				checks["redis"] = "unhealthy"
				ready = false
			} else {
				checks["redis"] = "healthy"
			}
		} else {
			checks["redis"] = "not_configured"
		}

		status := http.StatusOK
		if !ready {
			status = http.StatusServiceUnavailable
		}
		c.JSON(status, gin.H{"status": ready, "checks": checks})
	})

	engine.GET("/version", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"version":   version,
			"service":   "Chitthi Email Service",
			"status":    "running",
			"timestamp": fmt.Sprintf("%d", time.Now().Unix()),
		})
	})

	// If pool is nil, skip registering routes that require DB
	if pool == nil {
		return engine
	}

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
