package email

import "time"

// EmailRequest represents an email sending request
type EmailRequest struct {
	FromEmail   string `json:"from_email"`
	FromName    string `json:"from_name"`
	ToEmail     string `json:"to_email"`
	ToName      string `json:"to_name"`
	Subject     string `json:"subject"`
	HTMLContent string `json:"html_content"`
}

// EmailLog represents an email log entry
type EmailLog struct {
	ID             int       `json:"id"`
	RecipientEmail string    `json:"recipient_email"`
	Subject        string    `json:"subject"`
	Provider       string    `json:"provider"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
}
