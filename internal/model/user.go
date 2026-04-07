package model

import "time"

// User is a Chitthi account with profile and onboarding state.
type User struct {
	ID           int64      `json:"id"`
	Name         string     `json:"name"`
	Email        string     `json:"email"`
	IsOnboarded  bool       `json:"is_onboarded"`
	Profession   *string    `json:"profession,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
