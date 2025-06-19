# ------------ Stage 1: Build the Go binary ------------
FROM golang:1.24.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compile your Go app inside cmd folder
RUN go build -o server ./cmd

# ------------ Stage 2: Lightweight runtime ------------
FROM alpine:latest

WORKDIR /root/

# Install certs (important for HTTPS calls like Breevo)
RUN apk --no-cache add ca-certificates

COPY --from=builder /app/server .

# Don’t copy .env here! .env is used by compose and Go reads it via os.Getenv()
# COPY .env .  <-- ❌ Not needed

EXPOSE 8080

CMD ["./server"]