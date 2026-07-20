package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

var corsAllowHeaders = "Accept, Authorization, Content-Type, X-CSRF-Token, X-Requested-With, X-Breevo-API-Key, X-SendGrid-API-Key, X-SendGrid-Region, X-MailerSend-API-Key, X-Chitthi-API-Key, X-User-ID, X-Chitthi-BFF-Secret"

func getAllowedOrigin(requestOrigin string) string {
	allowed := os.Getenv("ALLOWED_ORIGINS")
	if allowed == "" || allowed == "*" {
		return "*"
	}
	for _, origin := range strings.Split(allowed, ",") {
		if strings.TrimSpace(origin) == requestOrigin {
			return requestOrigin
		}
	}
	return ""
}

func applyCORSHeaders(headerSetter interface{ Set(string, string) }, origin string) {
	headerSetter.Set("Access-Control-Allow-Origin", origin)
	headerSetter.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
	headerSetter.Set("Access-Control-Allow-Headers", corsAllowHeaders)
	headerSetter.Set("Access-Control-Expose-Headers", "Link")
	headerSetter.Set("Access-Control-Allow-Credentials", "true")
	headerSetter.Set("Access-Control-Max-Age", "86400")
}

func GinCORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := getAllowedOrigin(c.GetHeader("Origin"))
		if origin == "" {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}
		applyCORSHeaders(c.Writer.Header(), origin)

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

// CORSMiddleware provides CORS support for configured origins
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := getAllowedOrigin(r.Header.Get("Origin"))
		if origin == "" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		applyCORSHeaders(w.Header(), origin)

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// CORSHandlerFunc wraps a handler function with CORS middleware
func CORSHandlerFunc(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := getAllowedOrigin(r.Header.Get("Origin"))
		if origin == "" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		applyCORSHeaders(w.Header(), origin)

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handlerFunc(w, r)
	}
}
