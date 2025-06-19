# ------------ Stage 1: Build the Go binary ------------
FROM golang:1.24.3-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first for caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the Go binary
RUN go build -o server ./cmd

# ------------ Stage 2: Lightweight runtime ------------
FROM alpine:latest

# Working directory for the final container
WORKDIR /root/

# Install certs (required for HTTPS requests like Breevo API)
RUN apk --no-cache add ca-certificates

# Copy the compiled Go binary from builder stage
COPY --from=builder /app/server .

# Expose the port your app will run on (use `os.Getenv("PORT")` in code)
EXPOSE 8080

# Run the Go app
CMD ["./server"]