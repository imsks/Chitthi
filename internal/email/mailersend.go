package adapters

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/imsks/chitthi/internal/model"
)

type MailerSendAdapter struct {
	APIKey string
}

func (b *MailerSendAdapter) SendEmail(email model.EmailRequest) error {
	// Validate required fields
	if email.FromEmail == "" {
		return fmt.Errorf("from_email is required")
	}
	if email.ToEmail == "" {
		return fmt.Errorf("to_email is required")
	}
	if email.Subject == "" {
		return fmt.Errorf("subject is required")
	}

	// MailerSend API payload structure
	payload := map[string]interface{}{
		"from": map[string]string{
			"email": email.FromEmail,
			"name":  email.FromName,
		},
		"to": []map[string]interface{}{
			{
				"email": email.ToEmail,
				"name":  email.ToName,
			},
		},
		"subject": email.Subject,
		"html":    email.HTMLContent,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %v", err)
	}

	req, err := http.NewRequest("POST", "https://api.mailersend.com/v1/email", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+b.APIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		// Read the error response body for better debugging
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("MailerSend error: %s - %s", resp.Status, string(bodyBytes))
	}
	return nil
}

func (m *MailerSendAdapter) GetName() string {
	return "mailersend"
}

func (m *MailerSendAdapter) IsAvailable() bool {
	return m.APIKey != ""
}
