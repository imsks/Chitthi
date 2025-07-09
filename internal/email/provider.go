package adapters

import (
	"errors"

	"github.com/imsks/chitthi/internal/model"
)

var ErrNoProvidersAvailable = errors.New("no email providers available")

type EmailProvider interface {
	SendEmail(email model.EmailRequest) error
	GetName() string
	IsAvailable() bool
}
