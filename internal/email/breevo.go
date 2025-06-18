package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/imsks/chitthi/internal/config"
)

type BreevoPayload struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	HTML    string `json:"html"`
}

const BREEVO_API_URL = "https://api.brevo.com/v3/smtp/email"

func SendWithBreevo(to, subject, html string) error {
	payload := BreevoPayload{
		To:      to,
		Subject: subject,
		HTML:    html,
	}

	// Converts your struct to JSON []byte
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("error marshalling breevo payload: %w", err)
	}

	req, err := http.NewRequest("POST", BREEVO_API_URL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("error creating Breevo request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	cfg := config.LoadConfig()
	req.Header.Set("api-key", cfg.BreevoAPIKey)
	req.Header.Set("X-Sib-Sandbox", "drop")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error Sending Breevo request: %w", err)
	}

	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("error reading Breevo response body: %w", err)
	}

	// Log the response for debugging
	fmt.Printf("Breevo API Response Body: %s\n", string(body))

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("breevo API Error: Status %d", resp.StatusCode)
	}

	return nil
}
