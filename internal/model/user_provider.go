package model

import "time"

// UserProvider links a user to a provider with their BYOK API key.
type UserProvider struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	ProviderID  int64     `json:"provider_id"`
	APIKey      string    `json:"-"` // omit from JSON by default; log/serialize explicitly when needed
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
