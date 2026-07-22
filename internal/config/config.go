package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	JWTSecret        string
	BFFSecret        string
	GoogleClientID   string
	ApplicationName  string
	Port             string
	RabbitMQURL      string
	RedisURL         string
	DatabaseURL      string
	BreevoAPIKey     string
	SendGridAPIKey   string
	SendGridRegion   string
	MailerSendAPIKey string
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func LoadConfig() Config {
	err := godotenv.Load()

	if err != nil {
		log.Println("⚠️  .env file not found, using system environment variables")
	}

	return Config{
		JWTSecret:        getEnv("JWT_SECRET", "your-secret-key"),
		BFFSecret:        getEnv("CHITTHI_BFF_SECRET", ""),
		GoogleClientID:   getEnv("GOOGLE_CLIENT_ID", ""),
		ApplicationName:  getEnv("APPLICATION_NAME", "chitthi"),
		Port:             getEnv("PORT", "8080"),
		RabbitMQURL:      getEnv("RABBITMQ_URL", ""),
		RedisURL:         getEnv("REDIS_URL", ""),
		DatabaseURL:      getEnv("DATABASE_URL", ""),
		BreevoAPIKey:     getEnv("BREEVO_API_KEY", ""),
		SendGridAPIKey:   getEnv("SENDGRID_API_KEY", ""),
		SendGridRegion:   getEnv("SENDGRID_REGION", "global"),
		MailerSendAPIKey: getEnv("MAILERSEND_API_KEY", ""),
	}
}
