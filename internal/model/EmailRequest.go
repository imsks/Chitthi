package model

type EmailRequest struct {
	To       string `json:"to"`
	Subject  string `json:"subject"`
	HTML     string `json:"html"`
	Provider string `json:"provider"`
}
