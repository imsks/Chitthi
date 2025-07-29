package adapters

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"strings"

	"github.com/imsks/chitthi/internal/model"
)

type SMTPAdapter struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
	UseTLS   bool
}

func (s *SMTPAdapter) SendEmail(email model.EmailRequest) error {
	// Build the email message
	message := s.buildMessage(email)

	// Connect to SMTP server
	auth := smtp.PlainAuth("", s.Username, s.Password, s.Host)

	addr := fmt.Sprintf("%s:%s", s.Host, s.Port)

	var err error
	if s.UseTLS {
		// For port 587, use STARTTLS; for port 465, use direct TLS
		if s.Port == "587" {
			err = s.sendWithSTARTTLS(addr, auth, message, email.ToEmail)
		} else {
			err = s.sendWithTLS(addr, auth, message, email.ToEmail)
		}
	} else {
		err = smtp.SendMail(addr, auth, s.From, []string{email.ToEmail}, []byte(message))
	}

	if err != nil {
		return fmt.Errorf("SMTP error: %w", err)
	}

	return nil
}

func (s *SMTPAdapter) sendWithSTARTTLS(addr string, auth smtp.Auth, message string, toEmail string) error {
	// Connect to SMTP server without TLS first
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer conn.Close()

	// Create SMTP client
	client, err := smtp.NewClient(conn, s.Host)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer client.Close()

	// Start TLS
	if err = client.StartTLS(&tls.Config{ServerName: s.Host}); err != nil {
		return fmt.Errorf("failed to start TLS: %w", err)
	}

	// Authenticate
	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP authentication failed: %w", err)
	}

	// Set sender
	if err = client.Mail(s.From); err != nil {
		return fmt.Errorf("failed to set sender: %w", err)
	}

	// Set recipient
	if err = client.Rcpt(toEmail); err != nil {
		return fmt.Errorf("failed to set recipient: %w", err)
	}

	// Send data
	writer, err := client.Data()
	if err != nil {
		return fmt.Errorf("failed to start data transfer: %w", err)
	}

	_, err = writer.Write([]byte(message))
	if err != nil {
		return fmt.Errorf("failed to write message: %w", err)
	}

	err = writer.Close()
	if err != nil {
		return fmt.Errorf("failed to close data transfer: %w", err)
	}

	return nil
}

func (s *SMTPAdapter) sendWithTLS(addr string, auth smtp.Auth, message string, toEmail string) error {
	// Create TLS config
	tlsConfig := &tls.Config{
		ServerName: s.Host,
	}

	// Connect to SMTP server
	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer conn.Close()

	// Create SMTP client
	client, err := smtp.NewClient(conn, s.Host)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer client.Close()

	// Authenticate
	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP authentication failed: %w", err)
	}

	// Set sender
	if err = client.Mail(s.From); err != nil {
		return fmt.Errorf("failed to set sender: %w", err)
	}

	// Set recipient
	if err = client.Rcpt(toEmail); err != nil {
		return fmt.Errorf("failed to set recipient: %w", err)
	}

	// Send data
	writer, err := client.Data()
	if err != nil {
		return fmt.Errorf("failed to start data transfer: %w", err)
	}

	_, err = writer.Write([]byte(message))
	if err != nil {
		return fmt.Errorf("failed to write message: %w", err)
	}

	err = writer.Close()
	if err != nil {
		return fmt.Errorf("failed to close data transfer: %w", err)
	}

	return nil
}

func (s *SMTPAdapter) buildMessage(email model.EmailRequest) string {
	var message strings.Builder

	// Headers
	message.WriteString(fmt.Sprintf("From: %s <%s>\r\n", email.FromName, email.FromEmail))
	message.WriteString(fmt.Sprintf("To: %s <%s>\r\n", email.ToName, email.ToEmail))
	message.WriteString(fmt.Sprintf("Subject: %s\r\n", email.Subject))
	message.WriteString("MIME-Version: 1.0\r\n")
	message.WriteString("Content-Type: text/html; charset=UTF-8\r\n")
	message.WriteString("\r\n")

	// Body
	message.WriteString(email.HTMLContent)

	return message.String()
}

func (s *SMTPAdapter) GetName() string {
	return "smtp"
}

func (s *SMTPAdapter) IsAvailable() bool {
	return s.Host != "" && s.Username != "" && s.Password != ""
}
