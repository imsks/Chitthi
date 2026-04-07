package database

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var Redis *redis.Client

// InitRedis connects to Redis for caches (e.g. unified API key → user id, rate limits).
// Pass empty URL to skip initialization; Redis remains nil.
func InitRedis(redisURL string) error {
	if redisURL == "" {
		log.Println("⚠️  REDIS_URL not set; Redis disabled")
		return nil
	}

	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return err
	}

	Redis = redis.NewClient(opts)
	if err := Redis.Ping(context.Background()).Err(); err != nil {
		Redis = nil
		return err
	}

	log.Println("✅ Connected to Redis")
	return nil
}

func CloseRedis() {
	if Redis != nil {
		if err := Redis.Close(); err != nil {
			log.Println("redis close:", err)
		} else {
			log.Println("🔌 Closed Redis connection")
		}
		Redis = nil
	}
}
