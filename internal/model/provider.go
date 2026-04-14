package model

import "time"

// ProviderName matches Postgres enum provider_name.
type ProviderName string

const (
	ProviderSendgrid   ProviderName = "sendgrid"
	ProviderMailchimp  ProviderName = "mailchimp"
	ProviderBreevo     ProviderName = "breevo"
	ProviderMailersend ProviderName = "mailersend"
	ProviderSMTP       ProviderName = "smtp"
)

// Provider is a supported email vendor with a platform-wide daily send cap.
type Provider struct {
	ID          int64        `json:"id"`
	Name        ProviderName `json:"name"`
	DailyQuota  int          `json:"daily_quota"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}
