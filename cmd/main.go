package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(w, "📮 Welcome to Chitthi - BYOK Email Delivery Service")
	})

	fmt.Println("🚀 Chitthi running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
