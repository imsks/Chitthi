package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var corsAllowHeaders = "Accept, Authorization, Content-Type, X-CSRF-Token, X-Requested-With, X-Breevo-API-Key, X-SendGrid-API-Key, X-SendGrid-Region, X-MailerSend-API-Key, X-Chitthi-API-Key, X-User-ID, X-Chitthi-BFF-Secret"

func applyCORSHeaders(headerSetter interface{ Set(string, string) }) {
	headerSetter.Set("Access-Control-Allow-Origin", "*")
	headerSetter.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
	headerSetter.Set("Access-Control-Allow-Headers", corsAllowHeaders)
	headerSetter.Set("Access-Control-Expose-Headers", "Link")
	headerSetter.Set("Access-Control-Allow-Credentials", "true")
	headerSetter.Set("Access-Control-Max-Age", "86400")
}

func GinCORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		applyCORSHeaders(c.Writer.Header())

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

// CORSMiddleware provides CORS support for net/http handlers
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		applyCORSHeaders(w.Header())

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
		applyCORSHeaders(w.Header())

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handlerFunc(w, r)
	}
}
