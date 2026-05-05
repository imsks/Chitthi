package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/imsks/chitthi/internal/config"
)

func TestAuthMiddleware_BFFValidUser(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{
		JWTSecret: "jwt-test",
		BFFSecret: "bff-shared",
	}
	r := gin.New()
	r.Use(AuthMiddleware(cfg))
	r.GET("/t", func(c *gin.Context) {
		c.JSON(200, gin.H{"user_id": c.GetUint("user_id")})
	})

	req := httptest.NewRequest(http.MethodGet, "/t", nil)
	req.Header.Set(headerBFFSecret, "bff-shared")
	req.Header.Set(headerUserID, "7")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("status %d body %s", w.Code, w.Body.String())
	}
}

func TestAuthMiddleware_BFFMissingUserID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{JWTSecret: "j", BFFSecret: "bff-shared"}
	r := gin.New()
	r.Use(AuthMiddleware(cfg))
	r.GET("/t", func(c *gin.Context) { c.Status(200) })

	req := httptest.NewRequest(http.MethodGet, "/t", nil)
	req.Header.Set(headerBFFSecret, "bff-shared")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 got %d", w.Code)
	}
}

func TestAuthMiddleware_BFFWrongSecretFallsBackToJWT(t *testing.T) {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{JWTSecret: "jwt-test", BFFSecret: "bff-shared"}
	r := gin.New()
	r.Use(AuthMiddleware(cfg))
	r.GET("/t", func(c *gin.Context) { c.Status(200) })

	req := httptest.NewRequest(http.MethodGet, "/t", nil)
	req.Header.Set(headerBFFSecret, "wrong")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 (no jwt) got %d", w.Code)
	}
}
