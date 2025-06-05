package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/imsks/chitthi/internal/config"
)

func main() {
	cfg := config.LoadConfig()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(w, "📮 Welcome to Chitthi - BYOK Email Delivery Service")
	})

	addr := ":" + cfg.Port
	fmt.Printf("🚀 Chitthi running on http://localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
