FROM golang:1.24-alpine

# Install Air (new path for Go 1.24+)
RUN go install github.com/air-verse/air@latest

# Set working directory
WORKDIR /app

# Copy go mod files and download deps
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the code
COPY . .

# Expose the dev port
EXPOSE 8080

# Run dev server with Air
CMD ["air"]