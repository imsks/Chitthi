package utils

import (
	"encoding/json"
	"net/http"

	"github.com/imsks/chitthi/internal/model"
)

// SendJSONResponse sends a structured JSON response
func SendJSONResponse(w http.ResponseWriter, statusCode int, response interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

// SendSuccessResponse sends a success response with data
func SendSuccessResponse(w http.ResponseWriter, message string, data interface{}) {
	response := map[string]interface{}{
		"status":  true,
		"message": message,
		"data":    data,
	}
	SendJSONResponse(w, http.StatusOK, response)
}

// SendErrorResponse sends an error response
func SendErrorResponse(w http.ResponseWriter, statusCode int, message string, errorCode string) {
	response := map[string]interface{}{
		"status":  false,
		"message": message,
		"error": map[string]string{
			"code":    errorCode,
			"message": message,
		},
	}
	SendJSONResponse(w, statusCode, response)
}

// SendEmailSuccessResponse sends a structured email success response
func SendEmailSuccessResponse(w http.ResponseWriter, emailData *model.EmailData) {
	response := model.EmailResponse{
		Status:  true,
		Message: "Email sent successfully",
		Data:    emailData,
	}
	SendJSONResponse(w, http.StatusOK, response)
}

// SendEmailErrorResponse sends a structured email error response
func SendEmailErrorResponse(w http.ResponseWriter, statusCode int, message string, errorCode string) {
	response := model.EmailResponse{
		Status:  false,
		Message: message,
		Error: &model.ErrorData{
			Code:    errorCode,
			Message: message,
		},
	}
	SendJSONResponse(w, statusCode, response)
}
