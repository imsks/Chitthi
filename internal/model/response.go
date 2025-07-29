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
	LogSaved bool   `json:"log_saved"`
	LogID    *int   `json:"log_id,omitempty"`
	LogError string `json:"log_error,omitempty"`
}

type ErrorData struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type LogsResponse struct {
	Status  bool       `json:"status"`
	Message string     `json:"message"`
	Data    []EmailLog `json:"data,omitempty"`
	Error   *ErrorData `json:"error,omitempty"`
}
