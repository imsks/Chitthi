package model

import "time"

// UserAPIKey is a unified Chitthi API key for a user; resolve user → user_providers for sending.
type UserAPIKey struct {
	ID        int64      `json:"id"`
	UserID    int64      `json:"user_id"`
	APIKey    string     `json:"-"` // omit from JSON; expose only on creation/rotation
	CreatedAt time.Time  `json:"created_at"`
	RevokedAt *time.Time `json:"revoked_at,omitempty"`
}
