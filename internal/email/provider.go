package adapters

import "github.com/imsks/chitthi/internal/model"

type EmailProvider interface {
	SendEmail(email model.EmailRequest) error
	GetName() string
	IsAvailable() bool
}
