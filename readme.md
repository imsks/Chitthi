# Chitthi(Currently in Dev)

### Folder Structure

chitthi/
├── cmd/ # Entry point
│ └── main.go
├── internal/ # All core business logic
│ ├── api/ # HTTP handlers
│ ├── config/ # .env loading
│ ├── email/ # Provider-specific logic (SendGrid, etc)
│ ├── queue/ # RabbitMQ logic
│ ├── cache/ # Redis helpers
│ ├── db/ # Postgres logic
│ └── model/ # Structs: EmailJob, Logs etc.
├── .env
├── go.mod
├── go.sum
└── README.md

### Run the App

go run cmd/main.go

### cURL

```
curl --request POST \
  --url https://api.brevo.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key: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' \
  --header 'content-type: application/json' \
  --data '{
   "sender":{
      "name":"Sender Alex",
      "email":"sachinkshuklaoo7@gmail.com"
   },
   "to":[
      {
         "email":"sachin@fletch.co",
         "name":"John Doe"
      }
   ],
   "headers": {
      "X-Sib-Sandbox": "drop"
   },
   "subject":"Hello world",
   "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"
}'
```
