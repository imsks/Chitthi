package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/database/postgres"
	"github.com/imsks/chitthi/internal/services"
)

type stubAPIKeyService struct {
	credentialSummaries  []postgres.ProviderCredentialSummary
	getSummariesErr      error
	defaultSender        string
	deleteChitthiErr     error
	deleteProviderErr    error
	lastDeleteChitthi    string
	lastDeleteProvider   string
	lastDeleteProvUID    uint
	lastDeleteChitthiUID uint

	createdKey   string
	createErr    error
	apiKeys      []string
	getKeysErr   error
	addProvErr   error
	lastAddProv  string
	lastAddKey   string
	lastAddEmail string
	lastAddUID   uint
}

func (s *stubAPIKeyService) CreateAPIKey(userID uint, expiresAt string) (string, error) {
	_ = userID
	_ = expiresAt
	if s.createErr != nil {
		return "", s.createErr
	}
	return s.createdKey, nil
}

func (s *stubAPIKeyService) GetAPIKeys(uint) ([]string, error) {
	if s.getKeysErr != nil {
		return nil, s.getKeysErr
	}
	return s.apiKeys, nil
}

func (s *stubAPIKeyService) DeleteAPIKey(userID uint, apiKey string) error {
	s.lastDeleteChitthiUID = userID
	s.lastDeleteChitthi = apiKey
	return s.deleteChitthiErr
}

func (s *stubAPIKeyService) AddProviderAPIKey(_ context.Context, userID uint, provider string, apiKey string, senderEmail string) error {
	s.lastAddUID = userID
	s.lastAddProv = provider
	s.lastAddKey = apiKey
	s.lastAddEmail = senderEmail
	return s.addProvErr
}

func (s *stubAPIKeyService) GetProviderCredentialSummaries(ctx context.Context, userID uint) ([]postgres.ProviderCredentialSummary, error) {
	_ = ctx
	_ = userID
	if s.getSummariesErr != nil {
		return nil, s.getSummariesErr
	}
	return s.credentialSummaries, nil
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
	stub := &stubAPIKeyService{credentialSummaries: []postgres.ProviderCredentialSummary{
		{ProviderName: "sendgrid", SenderEmail: "send@example.com"},
		{ProviderName: "mailersend", SenderEmail: "mail@example.com"},
	}}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.GET("/apikeys/provider", authUserID(7), h.GetProviderAPIKeysHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/apikeys/provider", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	var body struct {
		Providers            []string `json:"providers"`
		ProviderCredentials []struct {
			Provider     string `json:"provider"`
			SenderEmail  string `json:"sender_email"`
		} `json:"provider_credentials"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if len(body.Providers) != 2 || body.Providers[0] != "sendgrid" {
		t.Fatalf("unexpected providers %v", body.Providers)
	}
	if len(body.ProviderCredentials) != 2 ||
		body.ProviderCredentials[0].Provider != "sendgrid" ||
		body.ProviderCredentials[0].SenderEmail != "send@example.com" {
		t.Fatalf("unexpected provider_credentials %+v", body.ProviderCredentials)
	}
}

func TestGetProviderAPIKeysHandler_IncludesDefaultSender(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{
		credentialSummaries: []postgres.ProviderCredentialSummary{{ProviderName: "sendgrid", SenderEmail: "x@example.com"}},
		defaultSender:       "sender@example.com",
	}
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

func TestCreateAPIKeyHandler_OK(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{createdKey: "ck_live_test"}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.POST("/apikeys", authUserID(42), h.CreateAPIKeyHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/apikeys", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	var body struct {
		APIKey string `json:"api_key"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if body.APIKey != "ck_live_test" {
		t.Fatalf("unexpected api_key %q", body.APIKey)
	}
}

func TestCreateAPIKeyHandler_Unauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	h := NewAPIKeyHandler(&stubAPIKeyService{})
	r := gin.New()
	r.POST("/apikeys", h.CreateAPIKeyHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/apikeys", nil))
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
}

func TestCreateAPIKeyHandler_ServiceError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{createErr: errors.New("db unavailable")}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.POST("/apikeys", authUserID(1), h.CreateAPIKeyHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/apikeys", nil))
	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
}

func TestGetAPIKeysHandler_OK(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{apiKeys: []string{"a", "b"}}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.GET("/apikeys", authUserID(2), h.GetAPIKeysHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/apikeys", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	var body struct {
		APIKeys []string `json:"api_keys"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if len(body.APIKeys) != 2 || body.APIKeys[0] != "a" {
		t.Fatalf("unexpected api_keys %+v", body.APIKeys)
	}
}

func TestGetAPIKeysHandler_Unauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	h := NewAPIKeyHandler(&stubAPIKeyService{})
	r := gin.New()
	r.GET("/apikeys", h.GetAPIKeysHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/apikeys", nil))
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
}

func TestGetProviderAPIKeysHandler_ServiceError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{getSummariesErr: errors.New("db")}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.GET("/apikeys/provider", authUserID(1), h.GetProviderAPIKeysHandler)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/apikeys/provider", nil))
	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
}

func TestAddProviderAPIKeyHandler_InvalidJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	h := NewAPIKeyHandler(&stubAPIKeyService{})
	r := gin.New()
	r.POST("/apikeys/provider", authUserID(5), h.AddProviderAPIKeyHandler)

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/apikeys/provider", bytes.NewBufferString(`not-json`))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
}

func TestAddProviderAPIKeyHandler_ValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{addProvErr: services.ErrSenderEmailRequired}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.POST("/apikeys/provider", authUserID(5), h.AddProviderAPIKeyHandler)

	payload := []byte(`{"provider":"sendgrid","api_key":"k","sender_email":"x@y.com"}`)
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/apikeys/provider", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	if stub.lastAddProv != "sendgrid" {
		t.Fatalf("expected service called with provider sendgrid")
	}
}

func TestAddProviderAPIKeyHandler_OK(t *testing.T) {
	gin.SetMode(gin.TestMode)
	stub := &stubAPIKeyService{}
	h := NewAPIKeyHandler(stub)
	r := gin.New()
	r.POST("/apikeys/provider", authUserID(9), h.AddProviderAPIKeyHandler)

	payload := []byte(`{"provider":"mailersend","api_key":"secret","sender_email":"hello@example.com"}`)
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/apikeys/provider", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
	if stub.lastAddUID != 9 || stub.lastAddProv != "mailersend" || stub.lastAddKey != "secret" || stub.lastAddEmail != "hello@example.com" {
		t.Fatalf("stub state prov=%q key=%q email=%q uid=%d", stub.lastAddProv, stub.lastAddKey, stub.lastAddEmail, stub.lastAddUID)
	}
}
