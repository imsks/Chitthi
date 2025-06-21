package adapters

import "github.com/imsks/chitthi/internal/model"

type EmailAdapter interface {
	SendEmail(email model.EmailRequest) error
}
