package services

import (
	"errors"
	"testing"
	"time"
)

func TestNormalizeUserAPIKeyExpiry_DefaultOneYear(t *testing.T) {
	now := time.Now().UTC()
	got := NormalizeUserAPIKeyExpiry("")
	exp, err := time.Parse(time.RFC3339, got)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	min := now.AddDate(1, 0, -2)
	max := now.AddDate(1, 0, 2)
	if exp.Before(min) || exp.After(max) {
		t.Fatalf("expected ~365d ahead, got %v (window %v–%v)", exp, min, max)
	}
}

func TestNormalizeUserAPIKeyExpiry_Passthrough(t *testing.T) {
	in := "2030-01-15T12:00:00Z"
	if got := NormalizeUserAPIKeyExpiry(in); got != in {
		t.Fatalf("got %q", got)
	}
}

func TestValidateSenderEmail(t *testing.T) {
	if err := ValidateSenderEmail(""); !errors.Is(err, ErrSenderEmailRequired) {
		t.Fatalf("empty: %v", err)
	}
	if err := ValidateSenderEmail("bad"); !errors.Is(err, ErrSenderEmailInvalid) {
		t.Fatalf("bad: %v", err)
	}
	if err := ValidateSenderEmail("a@b.com"); err != nil {
		t.Fatalf("valid: %v", err)
	}
}
