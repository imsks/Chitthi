package email

import (
	"net/http"
	"strings"
	"testing"
)

func TestExtractChitthiAPIKey_Header(t *testing.T) {
	r, err := http.NewRequest(http.MethodPost, "/", strings.NewReader("{}"))
	if err != nil {
		t.Fatal(err)
	}
	r.Header.Set("X-Chitthi-API-Key", "  myhexkey  ")
	if got := ExtractChitthiAPIKey(r); got != "myhexkey" {
		t.Fatalf("got %q", got)
	}
}

func TestExtractChitthiAPIKey_Bearer(t *testing.T) {
	r, err := http.NewRequest(http.MethodPost, "/", strings.NewReader("{}"))
	if err != nil {
		t.Fatal(err)
	}
	r.Header.Set("Authorization", "Bearer  tokenvalue  ")
	if got := ExtractChitthiAPIKey(r); got != "tokenvalue" {
		t.Fatalf("got %q", got)
	}
}

func TestExtractChitthiAPIKey_HeaderPrecedence(t *testing.T) {
	r, err := http.NewRequest(http.MethodPost, "/", strings.NewReader("{}"))
	if err != nil {
		t.Fatal(err)
	}
	r.Header.Set("X-Chitthi-API-Key", "from-header")
	r.Header.Set("Authorization", "Bearer from-bearer")
	if got := ExtractChitthiAPIKey(r); got != "from-header" {
		t.Fatalf("want header to win, got %q", got)
	}
}

func TestExtractChitthiAPIKey_Empty(t *testing.T) {
	r, err := http.NewRequest(http.MethodPost, "/", strings.NewReader("{}"))
	if err != nil {
		t.Fatal(err)
	}
	if got := ExtractChitthiAPIKey(r); got != "" {
		t.Fatalf("expected empty, got %q", got)
	}
}
