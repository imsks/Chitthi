package model

type EmailRequest struct {
	FromEmail   string `json:"from_email"`
	FromName    string `json:"from_name"`
	ToEmail     string `json:"to_email"`
	ToName      string `json:"to_name"`
	Subject     string `json:"subject"`
	HTMLContent string `json:"html_content"`
	Provider    string `json:"provider,omitempty"` // Optional: specify which provider to use
	// User-provided API keys
	BreevoAPIKey     string `json:"breevo_api_key,omitempty"`
	SendGridAPIKey   string `json:"sendgrid_api_key,omitempty"`
	MailerSendAPIKey string `json:"mailersend_api_key,omitempty"`
}
