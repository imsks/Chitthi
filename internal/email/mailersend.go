package adapters

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/imsks/chitthi/internal/model"
)

type MailerSendAdapter struct {
	APIKey string
}

func (b *MailerSendAdapter) SendEmail(email model.EmailRequest) error {
	payload := map[string]interface{}{
		"from": map[string]string{
			"email": email.FromEmail,
		},
		"to": []map[string]string{
			{
				"name": email.ToName,
			},
		},
		"subject":     email.Subject,
		"htmlContent": email.HTMLContent,
	}

	payloadBytes, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", b.APIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("Breevo error: %s", resp.Status)
	}
	return nil
}
