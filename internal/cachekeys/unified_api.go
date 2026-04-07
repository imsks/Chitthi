package cachekeys

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

const prefix = "chitthi:v1"

// UnifiedAPIUser maps a unified API key (hashed) to the owning user id in Redis.
// Value: user id as decimal string. TTL set at write time (e.g. 24h) when caching.
func UnifiedAPIUser(apiKey string) string {
	sum := sha256.Sum256([]byte(apiKey))
	return fmt.Sprintf("%s:unified_api:user:%s", prefix, hex.EncodeToString(sum[:]))
}
