package model

type EmailResponse struct {
	Status  bool       `json:"status"`
	Message string     `json:"message"`
	Data    *EmailData `json:"data,omitempty"`
	Error   *ErrorData `json:"error,omitempty"`
}

type EmailData struct {
	SentTo   string `json:"sent_to"`
	SentFrom string `json:"sent_from"`
	Subject  string `json:"subject"`
	Provider string `json:"provider"`
}

type ErrorData struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}
