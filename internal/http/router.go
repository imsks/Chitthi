package http

import (
	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/config"
	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/http/handler"
	"github.com/imsks/chitthi/internal/middleware"
	"github.com/imsks/chitthi/internal/services"
	"github.com/jackc/pgx/v5"
)

func SetupRouter(cfg *config.Config, conn *pgx.Conn) *gin.Engine {
	// DAOs
	userDAO := postgres.NewUserDAO(conn)
	providerAPIKeysDAO := postgres.NewProviderAPIKeysDAO(conn)
	apiKeysDAO := postgres.NewAPIKeyDAO(conn)

	//services
	userService := services.NewUserService(userDAO)
	providerAPIKeysService := services.NewAPIKeyService(apiKeysDAO, providerAPIKeysDAO)

	// handlers
	authHandler := handler.NewAuthHandler(userService)
	apiKeyHandler := handler.NewAPIKeyHandler(providerAPIKeysService)

	router := gin.Default()
	router.Use(middleware.GinCORSMiddleware())

	// Public routes
	router.POST("/api/v1/auth/login", authHandler.LoginHandler)
	router.POST("/api/v1/auth/logout", authHandler.LogoutHandler)
	router.POST("/api/v1/auth/register", authHandler.SignupHandler)

	// Protected routes (require authentication)
	authGroup := router.Group("/api/v1")
	authGroup.Use(middleware.AuthMiddleware([]byte(cfg.JWTSecret)))
	{
		authGroup.GET("/user/me", authHandler.GetMeHandler)
		authGroup.POST("/user/onboarding", authHandler.UpdateOnboardingStatusHandler)
		authGroup.POST("/apikeys", apiKeyHandler.CreateAPIKeyHandler)
		authGroup.POST("/apikeys/provider", apiKeyHandler.AddProviderAPIKeyHandler)
		authGroup.GET("/apikeys", apiKeyHandler.GetAPIKeysHandler)
		authGroup.GET("/apikeys/provider", apiKeyHandler.GetProviderAPIKeysHandler)
		authGroup.DELETE("/apikeys/:api_key", apiKeyHandler.DeleteAPIKeyHandler)
	}

	return router
}
