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
