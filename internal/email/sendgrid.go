package adapters

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/imsks/chitthi/internal/model"
)

type SendGridAdapter struct {
	APIKey string
}

func (s *SendGridAdapter) SendEmail(email model.EmailRequest) error {
	payload := map[string]interface{}{
		"personalizations": []map[string]interface{}{
			{
				"to": []map[string]string{
					{
						"email": email.ToEmail,
						"name":  email.ToName,
					},
				},
			},
		},
		"from": map[string]string{
			"email": email.FromEmail,
			"name":  email.FromName,
		},
		"subject": email.Subject,
		"content": []map[string]string{
			{
				"type":  "text/html",
				"value": email.HTMLContent,
			},
		},
	}

	payloadBytes, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", "https://api.sendgrid.com/v3/mail/send", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.APIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("SendGrid error: %s", resp.Status)
	}
	return nil
}

func (s *SendGridAdapter) GetName() string {
	return "sendgrid"
}

func (s *SendGridAdapter) IsAvailable() bool {
	return s.APIKey != ""
}
