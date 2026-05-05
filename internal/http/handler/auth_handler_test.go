package handler

import (
	"context"
	"testing"
)

func TestParseGoogleProfile_EmptyCredential(t *testing.T) {
	email, name, code, msg := parseGoogleProfile(context.Background(), "")
	if email != "" || name != "" || code != 400 || msg != "invalid request" {
		t.Fatalf("unexpected result: email=%q name=%q code=%d msg=%q", email, name, code, msg)
	}
}
