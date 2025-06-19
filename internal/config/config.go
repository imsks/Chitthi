package config

import (
	"log"
	"os"
)

type Config struct {
	Port         string
	RabbitMQURL  string
	RedisURL     string
	DatabaseURL  string
	BreevoAPIKey string
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func LoadConfig() Config {
	// err := godotenv.Load()

	// if err != nil {
	// 	log.Println("⚠️  .env file not found, using system environment variables")
	// }
	log.Println("PORT:", os.Getenv("PORT")) // debug if it's loading

	return Config{
		Port:         getEnv("PORT", "8080"),
		RabbitMQURL:  getEnv("RABBITMQ_URL", ""),
		RedisURL:     getEnv("REDIS_URL", ""),
		DatabaseURL:  getEnv("DATABASE_URL", ""),
		BreevoAPIKey: getEnv("DEFAULT_API_KEY", ""),
	}
}
