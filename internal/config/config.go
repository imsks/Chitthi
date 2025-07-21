package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port             string
	RabbitMQURL      string
	RedisURL         string
	DatabaseURL      string
	BreevoAPIKey     string
	SendGridAPIKey   string
	MailerSendAPIKey string
	SMTPHost         string
	SMTPPort         string
	SMTPUsername     string
	SMTPPassword     string
	SMTPFrom         string
	SMTPUseTLS       bool
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
		Port:             getEnv("PORT", "8080"),
		RabbitMQURL:      getEnv("RABBITMQ_URL", ""),
		RedisURL:         getEnv("REDIS_URL", ""),
		DatabaseURL:      getEnv("DATABASE_URL", ""),
		BreevoAPIKey:     getEnv("BREEVO_API_KEY", ""),
		SendGridAPIKey:   getEnv("SENDGRID_API_KEY", ""),
		MailerSendAPIKey: getEnv("MAILERSEND_API_KEY", ""),
		SMTPHost:         getEnv("SMTP_HOST", ""),
		SMTPPort:         getEnv("SMTP_PORT", "587"),
		SMTPUsername:     getEnv("SMTP_USERNAME", ""),
		SMTPPassword:     getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:         getEnv("SMTP_FROM", ""),
		SMTPUseTLS:       getEnv("SMTP_USE_TLS", "true") == "true",
	}
}
