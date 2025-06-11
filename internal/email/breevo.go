package email

import (
	"bytes" // To convert JSON into something we can send in body
	"encoding/json" // For converting structs → JSON
	"fmt"
	"net/http" // To make HTTP requests to Breevo
	"os" // To read API key from env vars (os.Getenv)
)

type BreevoPayload struct {
	To string `json:"to"`
	Subject string `json:"subject"`
	HTML string `json:"html"`
}

func SendWithBreevo(to, subject, html string) error {
	payload := BreevoPayload{
		To: to,
		Subject: subject,
		HTML: html
	}
}