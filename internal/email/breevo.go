package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/imsks/chitthi/internal/config"
)

type BreevoPayload struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	HTML    string `json:"html"`
}

const BREEVO_API_URL = "https://api.breevo.ai/v1/emails"

func SendWithBreevo(to, subject, html string) error {
	payload := BreevoPayload{
		To:      to,
		Subject: subject,
		HTML:    html,
	}

	// Converts your struct to JSON []byte
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("Error marshalling breevo payload: %w", err)
	}

	req, err := http.NewRequest("POST", BREEVO_API_URL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("Error creating Breevo request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	cfg := config.LoadConfig()
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", cfg.BreevoAPIKey))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("Error Sending Breevo request: %w", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Breevo API Error: Status %d", resp.StatusCode)
	}

	return nil
}
