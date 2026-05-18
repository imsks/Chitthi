package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/services"
)

type stubAPIKeyService struct {
	providers            []string
	defaultSender        string
	getProvidersErr      error
	deleteChitthiErr     error
	deleteProviderErr    error
	lastDeleteChitthi    string
	lastDeleteProvider   string
	lastDeleteProvUID    uint
	lastDeleteChitthiUID uint
}

func (s *stubAPIKeyService) CreateAPIKey(uint, string) (string, error) { return "", nil }
func (s *stubAPIKeyService) GetAPIKeys(uint) ([]string, error)         { return nil, nil }

func (s *stubAPIKeyService) DeleteAPIKey(userID uint, apiKey string) error {
	s.lastDeleteChitthiUID = userID
	s.lastDeleteChitthi = apiKey
	return s.deleteChitthiErr
}

func (s *stubAPIKeyService) AddProviderAPIKey(context.Context, uint, string, string, string) error {
	return nil
}

func (s *stubAPIKeyService) GetProviderAPIKeys(ctx context.Context, userID uint) ([]string, error) {
	_ = ctx
	_ = userID
	if s.getProvidersErr != nil {
		return nil, s.getProvidersErr
	}
	return s.providers, nil
}

func (s *stubAPIKeyService) GetDefaultSenderEmail(ctx context.Context, userID uint) (string, error) {
	_ = ctx
	_ = userID
	return s.defaultSender, nil
}

func (s *stubAPIKeyService) DeleteProviderAPIKey(ctx context.Context, userID uint, provider string) error {
	_ = ctx
	s.lastDeleteProvUID = userID
	s.lastDeleteProvider = provider
	return s.deleteProviderErr
}

func authUserID(uid uint) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("user_id", uid)
		c.Next()
	}
}

func TestGetProviderAPIKeysHandler_OK(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{providers: []string{"sendgrid", "mailersend"}}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.GET("/apikeys/provider", authUserID(7), h.GetProviderAPIKeysHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/apikeys/provider", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	var body struct {
		Providers []string `json:"providers"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if len(body.Providers) != 2 || body.Providers[0] != "sendgrid" {
		t.Fatalf("unexpected %v", body.Providers)
	}
}

func TestGetProviderAPIKeysHandler_IncludesDefaultSender(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{providers: []string{"sendgrid"}, defaultSender: "sender@example.com"}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.GET("/apikeys/provider", authUserID(7), h.GetProviderAPIKeysHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/apikeys/provider", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	var body struct {
		Providers          []string `json:"providers"`
		DefaultSenderEmail string   `json:"default_sender_email"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if body.DefaultSenderEmail != "sender@example.com" {
		t.Fatalf("unexpected sender %q", body.DefaultSenderEmail)
	}
}

func TestDeleteAPIKeyHandler_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{deleteChitthiErr: services.ErrChitthiAPIKeyNotFound}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.DELETE("/apikeys/:api_key", authUserID(3), h.DeleteAPIKeyHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodDelete, "/apikeys/deadbeef", nil))
	if w.Code != http.StatusNotFound {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	if stub.lastDeleteChitthi != "deadbeef" || stub.lastDeleteChitthiUID != 3 {
		t.Fatalf("stub state %+v", stub)
	}
}

func TestDeleteProviderAPIKeyHandler_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{deleteProviderErr: services.ErrProviderCredentialNotFound}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.DELETE("/apikeys/provider/:provider", authUserID(9), h.DeleteProviderAPIKeyHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodDelete, "/apikeys/provider/breevo", nil))
	if w.Code != http.StatusNotFound {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	if stub.lastDeleteProvider != "breevo" || stub.lastDeleteProvUID != 9 {
		t.Fatalf("stub state %+v", stub)
	}
}

func TestDeleteProviderAPIKeyHandler_OK(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.DELETE("/apikeys/provider/:provider", authUserID(1), h.DeleteProviderAPIKeyHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodDelete, "/apikeys/provider/sendgrid", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	if stub.lastDeleteProvider != "sendgrid" {
		t.Fatalf("expected sendgrid, got %q", stub.lastDeleteProvider)
	}
}
