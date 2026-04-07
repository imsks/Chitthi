package model

import "time"

// UserLog is per-user daily aggregate: success / failure / hold rates (0–100%).
type UserLog struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	LogDate     time.Time `json:"log_date"` // date only; use .UTC() and truncate for comparisons
	SuccessRate float64   `json:"success_rate"`
	FailureRate float64   `json:"failure_rate"`
	HoldRate    float64   `json:"hold_rate"`
	UpdatedAt   time.Time `json:"updated_at"`
}
