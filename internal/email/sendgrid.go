package adapters

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/imsks/chitthi/internal/model"
)

type SendGridAdapter struct {
	APIKey string
	Region string // "global" or "eu"
}

// SendGridError represents SendGrid API error response
type SendGridError struct {
	Errors []struct {
		Message string `json:"message"`
		Field   string `json:"field,omitempty"`
		Help    string `json:"help,omitempty"`
	} `json:"errors"`
}

func (s *SendGridAdapter) SendEmail(email model.EmailRequest) error {
	// Build the SendGrid v3 API payload
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

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal SendGrid payload: %w", err)
	}

	// Determine the base URL based on region
	baseURL := "https://api.sendgrid.com"
	if s.Region == "eu" {
		baseURL = "https://api.eu.sendgrid.com"
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", baseURL+"/v3/mail/send", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return fmt.Errorf("failed to create SendGrid request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.APIKey)

	// Make the request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("SendGrid request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read SendGrid response: %w", err)
	}

	// Handle different status codes
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return nil // Success
	}

	// Handle error responses
	var sgError SendGridError
	if err := json.Unmarshal(body, &sgError); err != nil {
		// If we can't parse the error response, return the raw status and body
		return fmt.Errorf("SendGrid error (status: %d): %s", resp.StatusCode, string(body))
	}

	// Build error message from SendGrid error response
	var errorMessages []string
	for _, err := range sgError.Errors {
		if err.Field != "" {
			errorMessages = append(errorMessages, fmt.Sprintf("%s: %s", err.Field, err.Message))
		} else {
			errorMessages = append(errorMessages, err.Message)
		}
	}

	if len(errorMessages) == 0 {
		errorMessages = append(errorMessages, fmt.Sprintf("SendGrid error (status: %d)", resp.StatusCode))
	}

	return fmt.Errorf("SendGrid error: %s", strings.Join(errorMessages, "; "))
}

func (s *SendGridAdapter) GetName() string {
	return "sendgrid"
}

func (s *SendGridAdapter) IsAvailable() bool {
	return s.APIKey != ""
}

// NewSendGridAdapter creates a new SendGrid adapter with optional region
func NewSendGridAdapter(apiKey string, region string) *SendGridAdapter {
	if region == "" {
		region = "global" // Default to global
	}
	return &SendGridAdapter{
		APIKey: apiKey,
		Region: region,
	}
}
