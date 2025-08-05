# Go Backend Engineering Knowledge Base

## Table of Contents

### Basic Level

1. [Package Declaration and Imports](#1-package-declaration-and-imports)
2. [Variables and Constants](#2-variables-and-constants)
3. [Data Types](#3-data-types)
4. [Structs and JSON Tags](#4-structs-and-json-tags)
5. [Functions and Methods](#5-functions-and-methods)
6. [Error Handling](#6-error-handling)
7. [String Operations](#7-string-operations)

### Intermediate Level

8. [Interfaces](#8-interfaces)
9. [Pointers and Receivers](#9-pointers-and-receivers)
10. [Slices and Arrays](#10-slices-and-arrays)
11. [Maps](#11-maps)
12. [JSON Encoding/Decoding](#12-json-encodingdecoding)
13. [HTTP Programming](#13-http-programming)
14. [Context Package](#14-context-package)
15. [Packages and Modules](#15-packages-and-modules)
16. [Environment Variables](#16-environment-variables)

### Advanced Level

17. [Dependency Injection](#17-dependency-injection)
18. [Repository Pattern](#18-repository-pattern)
19. [Factory Pattern](#19-factory-pattern)
20. [Adapter Pattern](#20-adapter-pattern)
21. [Service Layer Architecture](#21-service-layer-architecture)
22. [Interface Design](#22-interface-design)
23. [Error Wrapping](#23-error-wrapping)
24. [Database Connection Pooling](#24-database-connection-pooling)
25. [Load Balancing](#25-load-balancing)
26. [Modular Architecture](#26-modular-architecture)
27. [Resource Management](#27-resource-management)

---

## Basic Level

### 1. Package Declaration and Imports

**What it is:** Every Go file starts with a package declaration and imports necessary libraries.

**Example from our project:**

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"

    "github.com/imsks/chitthi/internal/config"
    "github.com/imsks/chitthi/internal/database"
)
```

**Key Points:**

-   `package main` creates an executable program
-   Import paths can be standard library (`fmt`, `json`) or custom modules
-   Custom imports use the module name defined in `go.mod`

**Interview Tips:**

-   Know the difference between `package main` and other packages
-   Understand import grouping (standard, external, internal)
-   Explain what happens when you import a package with `_` (blank identifier)

---

### 2. Variables and Constants

**What it is:** Go supports both variables (mutable) and constants (immutable) values.

**Example from our project:**

```go
const Version = "v1.0.0"

var Pool *pgxpool.Pool  // Package-level variable

func LoadConfig() Config {
    port := getEnv("PORT", "8080")  // Local variable
    return Config{
        Port: port,
    }
}
```

**Key Points:**

-   Constants are declared with `const`
-   Variables with `var` or short declaration `:=`
-   Package-level vs function-level scope

**Interview Tips:**

-   Explain the difference between `var`, `:=`, and `const`
-   Know about zero values for different types
-   Understand variable scope and shadowing

---

### 3. Data Types

**What it is:** Go has several built-in data types including numbers, strings, booleans.

**Example from our project:**

```go
type Config struct {
    Port         string  // string type
    DatabaseURL  string
    SMTPUseTLS   bool    // boolean type
}

type EmailLog struct {
    ID    int    `json:"id"`          // integer type
    Email string `json:"recipient_email"`
}
```

**Key Points:**

-   Basic types: `int`, `string`, `bool`, `float64`
-   Type safety - no implicit conversions
-   Zero values: `0` for numbers, `""` for strings, `false` for bools

**Interview Tips:**

-   Know all basic types and their zero values
-   Understand type conversions vs type assertions
-   Explain when to use different integer types (`int`, `int32`, `int64`)

---

### 4. Structs and JSON Tags

**What it is:** Structs are custom types that group related data. JSON tags control serialization.

**Example from our project:**

```go
type EmailRequest struct {
    FromEmail   string `json:"from_email"`
    FromName    string `json:"from_name"`
    ToEmail     string `json:"to_email"`
    Subject     string `json:"subject"`
    Provider    string `json:"provider,omitempty"`
    Credentials map[string]string `json:"-"`  // Not serialized
}
```

**Key Points:**

-   Structs define custom types
-   JSON tags control field names in JSON
-   `omitempty` skips empty fields
-   `json:"-"` excludes fields from JSON

**Interview Tips:**

-   Explain struct embedding vs composition
-   Know different struct tags (`json`, `xml`, `db`)
-   Understand when fields are exported (capitalized) vs unexported

---

### 5. Functions and Methods

**What it is:** Functions are reusable blocks of code. Methods are functions with receivers.

**Example from our project:**

```go
// Function
func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}

// Method with receiver
func (s *SendGridAdapter) GetName() string {
    return "sendgrid"
}
```

**Key Points:**

-   Functions can have multiple return values
-   Methods are functions with receivers
-   Receiver can be value or pointer

**Interview Tips:**

-   Explain the difference between functions and methods
-   Know when to use pointer vs value receivers
-   Understand multiple return values and named returns

---

### 6. Error Handling

**What it is:** Go uses explicit error handling with the `error` interface.

**Example from our project:**

```go
func InitPostgres(dsn string) error {
    pool, err := pgxpool.NewWithConfig(context.Background(), config)
    if err != nil {
        return err  // Return error to caller
    }
    Pool = pool
    return nil  // Success
}

// Custom error
var ErrNoProvidersAvailable = errors.New("no email providers available")
```

**Key Points:**

-   Errors are values, not exceptions
-   Always check errors explicitly
-   Can create custom errors with `errors.New()`

**Interview Tips:**

-   Explain why Go doesn't have try/catch
-   Know how to create and handle custom errors
-   Understand error wrapping with `fmt.Errorf()`

---

### 7. String Operations

**What it is:** Go provides various string manipulation functions.

**Example from our project:**

```go
import "strings"

func buildErrorMessage(sgError SendGridError) string {
    var errorMessages []string
    for _, err := range sgError.Errors {
        if err.Field != "" {
            errorMessages = append(errorMessages, fmt.Sprintf("%s: %s", err.Field, err.Message))
        }
    }
    return strings.Join(errorMessages, "; ")
}
```

**Key Points:**

-   Strings are immutable in Go
-   Use `strings` package for manipulation
-   `fmt.Sprintf()` for formatting

**Interview Tips:**

-   Know common string operations (`Split`, `Join`, `Contains`)
-   Understand string vs `[]byte` conversion
-   Explain string formatting with `fmt` package

---

## Intermediate Level

### 8. Interfaces

**What it is:** Interfaces define contracts - what methods a type must have.

**Example from our project:**

```go
type EmailProvider interface {
    SendEmail(email model.EmailRequest) error
    GetName() string
    IsAvailable() bool
}

// SendGridAdapter implements EmailProvider interface
func (s *SendGridAdapter) SendEmail(email model.EmailRequest) error { /* ... */ }
func (s *SendGridAdapter) GetName() string { return "sendgrid" }
func (s *SendGridAdapter) IsAvailable() bool { return s.APIKey != "" }
```

**Key Points:**

-   Interfaces are implemented implicitly
-   Any type that has the required methods implements the interface
-   Empty interface `interface{}` can hold any value

**Interview Tips:**

-   Explain implicit vs explicit interface implementation
-   Know about interface composition
-   Understand type assertions and type switches

---

### 9. Pointers and Receivers

**What it is:** Pointers hold memory addresses. Method receivers can be values or pointers.

**Example from our project:**

```go
type Repository struct {
    pool *pgxpool.Pool  // Pointer to pool
}

// Pointer receiver - can modify the struct
func (r *Repository) InsertLog(ctx context.Context, log *EmailLog) error {
    return r.pool.QueryRow(ctx, query, log.RecipientEmail).Scan(&log.ID)
}
```

**Key Points:**

-   Use `*` to declare pointer types
-   Use `&` to get address, `*` to dereference
-   Pointer receivers can modify the original struct

**Interview Tips:**

-   Explain when to use pointer vs value receivers
-   Know about nil pointers and how to avoid them
-   Understand pointer arithmetic (or lack thereof in Go)

---

### 10. Slices and Arrays

**What it is:** Arrays have fixed size, slices are dynamic arrays.

**Example from our project:**

```go
// Slice operations
func CreateProvidersFromConfig(cfg config.Config) []EmailProvider {
    providers := []EmailProvider{}  // Empty slice

    if cfg.BreevoAPIKey != "" {
        providers = append(providers, &BreevoAdapter{APIKey: cfg.BreevoAPIKey})
    }

    return providers
}
```

**Key Points:**

-   Slices are more common than arrays
-   Use `append()` to add elements
-   Slices have length and capacity

**Interview Tips:**

-   Explain slice vs array differences
-   Know about slice internals (length, capacity, underlying array)
-   Understand slice operations (`append`, `copy`, slicing)

---

### 11. Maps

**What it is:** Maps are key-value data structures (like hash tables).

**Example from our project:**

```go
func extractCredentialsFromHeaders(r *http.Request) map[string]string {
    credentials := make(map[string]string)  // Create empty map

    if apiKey := r.Header.Get("X-Breevo-API-Key"); apiKey != "" {
        credentials["breevo_api_key"] = apiKey  // Set key-value
    }

    return credentials
}
```

**Key Points:**

-   Maps are reference types
-   Zero value is `nil`
-   Use `make()` to create maps

**Interview Tips:**

-   Know map operations (create, read, update, delete)
-   Understand the "comma ok" idiom for checking existence
-   Explain map iteration and ordering (maps are unordered)

---

### 12. JSON Encoding/Decoding

**What it is:** Convert Go structs to/from JSON format.

**Example from our project:**

```go
func (h *Handler) SendEmail(w http.ResponseWriter, r *http.Request) {
    var req EmailRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        // Handle decode error
        return
    }

    // Send response
    json.NewEncoder(w).Encode(response)
}
```

**Key Points:**

-   Use `json.Marshal()` and `json.Unmarshal()` for []byte
-   Use `json.Encoder` and `json.Decoder` for streams
-   JSON tags control field mapping

**Interview Tips:**

-   Know the difference between Marshal/Unmarshal vs Encoder/Decoder
-   Understand JSON tags (`omitempty`, `json:"-"`)
-   Explain handling of unknown JSON fields

---

### 13. HTTP Programming

**What it is:** Building HTTP servers and clients in Go.

**Example from our project:**

```go
func main() {
    // Setup routes
    http.HandleFunc("/send-email", emailHandler.SendEmail)
    http.HandleFunc("/version", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(response)
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

**Key Points:**

-   Use `http.HandleFunc()` to register routes
-   `http.ResponseWriter` for sending responses
-   `http.Request` contains request data

**Interview Tips:**

-   Know HTTP methods and status codes
-   Understand middleware concepts
-   Explain request/response lifecycle

---

### 14. Context Package

**What it is:** Context carries deadlines, cancellation signals, and request-scoped values.

**Example from our project:**

```go
func (r *Repository) InsertLog(ctx context.Context, log *EmailLog) error {
    return r.pool.QueryRow(ctx, query,
        log.RecipientEmail, log.Subject, log.Provider, log.Status,
    ).Scan(&log.ID, &log.CreatedAt)
}

func (s *Service) SendEmail(ctx context.Context, req *EmailRequest) *SendEmailResult {
    // Use context for database operations
    s.logEmailAttempt(ctx, req, provider, "sent", nil)
}
```

**Key Points:**

-   Context should be first parameter in functions
-   Use for cancellation, timeouts, and request-scoped data
-   Always pass context down the call chain

**Interview Tips:**

-   Explain why context is important for servers
-   Know different context types (`Background`, `TODO`, `WithTimeout`)
-   Understand context cancellation and values

---

### 15. Packages and Modules

**What it is:** Go's module system for organizing and versioning code.

**Example from our project:**

```go
// go.mod
module github.com/imsks/chitthi

go 1.24.3

require (
    github.com/jackc/pgx/v5 v5.7.5
    github.com/joho/godotenv v1.5.1
)
```

**Key Points:**

-   Modules define project boundaries
-   Packages organize code within modules
-   Use `go mod init` to create modules

**Interview Tips:**

-   Explain the difference between packages and modules
-   Know about semantic versioning
-   Understand public vs private (exported vs unexported) identifiers

---

### 16. Environment Variables

**What it is:** Configuration through environment variables.

**Example from our project:**

```go
func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}

func LoadConfig() Config {
    err := godotenv.Load()  // Load .env file

    return Config{
        Port:        getEnv("PORT", "8080"),
        DatabaseURL: getEnv("DATABASE_URL", ""),
    }
}
```

**Key Points:**

-   Use `os.Getenv()` to read environment variables
-   Provide sensible defaults
-   Use `.env` files for development

**Interview Tips:**

-   Explain 12-factor app principles
-   Know about configuration best practices
-   Understand environment-specific configs

---

## Advanced Level

### 17. Dependency Injection

**What it is:** Providing dependencies to a struct rather than creating them internally.

**Example from our project:**

```go
type Service struct {
    repo      *Repository           // Injected dependency
    providers []adapters.EmailProvider  // Injected dependency
}

func NewService(cfg config.Config) *Service {
    providers := adapters.CreateProvidersFromConfig(cfg)

    return &Service{
        repo:      NewRepository(),  // Injecting dependencies
        providers: providers,
    }
}
```

**Key Points:**

-   Dependencies are passed in rather than created internally
-   Makes testing easier (can inject mocks)
-   Improves modularity and flexibility

**Interview Tips:**

-   Explain benefits of dependency injection
-   Know about constructor patterns in Go
-   Understand testing with dependency injection

---

### 18. Repository Pattern

**What it is:** Abstraction layer between business logic and data storage.

**Example from our project:**

```go
type Repository struct {
    pool *pgxpool.Pool
}

func (r *Repository) InsertLog(ctx context.Context, log *EmailLog) error {
    query := `INSERT INTO email_logs (recipient_email, subject, provider, status)
              VALUES ($1, $2, $3, $4) RETURNING id, created_at`

    return r.pool.QueryRow(ctx, query,
        log.RecipientEmail, log.Subject, log.Provider, log.Status,
    ).Scan(&log.ID, &log.CreatedAt)
}
```

**Key Points:**

-   Separates data access logic from business logic
-   Makes database operations testable
-   Provides consistent interface for data operations

**Interview Tips:**

-   Explain benefits of repository pattern
-   Know about interface-based repositories
-   Understand how it helps with testing

---

### 19. Factory Pattern

**What it is:** Creating objects without specifying exact classes.

**Example from our project:**

```go
func CreateProvidersFromConfig(cfg config.Config) []EmailProvider {
    providers := []EmailProvider{}

    if cfg.BreevoAPIKey != "" {
        providers = append(providers, &BreevoAdapter{APIKey: cfg.BreevoAPIKey})
    }

    if cfg.SendGridAPIKey != "" {
        providers = append(providers, NewSendGridAdapter(cfg.SendGridAPIKey, cfg.SendGridRegion))
    }

    return providers
}

func GetProviderFromRequest(breevoKey, sendgridKey, mailersendKey string) (EmailProvider, error) {
    if breevoKey != "" {
        return &BreevoAdapter{APIKey: breevoKey}, nil
    }
    // ... more conditions
    return nil, errors.New("no valid API key provided")
}
```

**Key Points:**

-   Creates objects based on input parameters
-   Hides object creation complexity
-   Returns interface types for flexibility

**Interview Tips:**

-   Explain different types of factory patterns
-   Know when to use factory vs constructor functions
-   Understand how factories help with polymorphism

---

### 20. Adapter Pattern

**What it is:** Makes incompatible interfaces work together.

**Example from our project:**

```go
// Common interface
type EmailProvider interface {
    SendEmail(email model.EmailRequest) error
    GetName() string
    IsAvailable() bool
}

// Adapter for SendGrid API
type SendGridAdapter struct {
    APIKey string
    Region string
}

func (s *SendGridAdapter) SendEmail(email model.EmailRequest) error {
    // Convert our model to SendGrid's expected format
    payload := map[string]interface{}{
        "personalizations": []map[string]interface{}{
            {"to": []map[string]string{{"email": email.ToEmail}}},
        },
        "from": map[string]string{"email": email.FromEmail},
        "subject": email.Subject,
    }
    // ... make HTTP request to SendGrid API
}
```

**Key Points:**

-   Adapts external APIs to our internal interface
-   Allows using different email providers with same interface
-   Hides implementation details of external services

**Interview Tips:**

-   Explain when adapter pattern is useful
-   Know the difference between adapter and wrapper
-   Understand how it enables polymorphism

---

### 21. Service Layer Architecture

**What it is:** Business logic layer that orchestrates between controllers and data layer.

**Example from our project:**

```go
type Service struct {
    repo      *Repository
    providers []adapters.EmailProvider
}

func (s *Service) SendEmail(ctx context.Context, req *EmailRequest) *SendEmailResult {
    // Business logic: try providers in order
    for _, provider := range s.providers {
        err := provider.SendEmail(emailReq)
        if err == nil {
            // Log success
            s.logEmailAttempt(ctx, req, provider.GetName(), "sent", nil)
            return &SendEmailResult{Success: true, Provider: provider.GetName()}
        }
    }
    return &SendEmailResult{Success: false, Error: lastError}
}
```

**Key Points:**

-   Contains business logic and rules
-   Coordinates between different components
-   Independent of HTTP/database details

**Interview Tips:**

-   Explain layered architecture benefits
-   Know about separation of concerns
-   Understand how service layer enables testing

---

### 22. Interface Design

**What it is:** Designing clean, minimal interfaces for better abstraction.

**Example from our project:**

```go
// Clean, minimal interface
type EmailProvider interface {
    SendEmail(email model.EmailRequest) error  // Core functionality
    GetName() string                          // Identification
    IsAvailable() bool                        // Health check
}

// Interface segregation - separate concerns
type LogRepository interface {
    InsertLog(ctx context.Context, log *EmailLog) error
    GetLogs(ctx context.Context, limit int) ([]EmailLog, error)
}
```

**Key Points:**

-   Keep interfaces small and focused
-   Define interfaces at point of use
-   Follow interface segregation principle

**Interview Tips:**

-   Explain interface design principles
-   Know about interface composition
-   Understand the difference between fat and thin interfaces

---

### 23. Error Wrapping

**What it is:** Adding context to errors as they bubble up.

**Example from our project:**

```go
func (s *SendGridAdapter) SendEmail(email model.EmailRequest) error {
    payloadBytes, err := json.Marshal(payload)
    if err != nil {
        return fmt.Errorf("failed to marshal SendGrid payload: %w", err)
    }

    req, err := http.NewRequest("POST", baseURL+"/v3/mail/send", bytes.NewBuffer(payloadBytes))
    if err != nil {
        return fmt.Errorf("failed to create SendGrid request: %w", err)
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return fmt.Errorf("SendGrid request failed: %w", err)
    }
}
```

**Key Points:**

-   Use `fmt.Errorf()` with `%w` verb to wrap errors
-   Adds context while preserving original error
-   Enables error unwrapping with `errors.Unwrap()`

**Interview Tips:**

-   Explain error wrapping vs error hiding
-   Know about `errors.Is()` and `errors.As()`
-   Understand when to wrap vs return original error

---

### 24. Database Connection Pooling

**What it is:** Managing database connections efficiently with pools.

**Example from our project:**

```go
var Pool *pgxpool.Pool

func InitPostgres(dsn string) error {
    config, err := pgxpool.ParseConfig(dsn)
    if err != nil {
        return err
    }

    pool, err := pgxpool.NewWithConfig(context.Background(), config)
    if err != nil {
        return err
    }

    Pool = pool  // Global pool for reuse
    return nil
}

func Close() {
    if Pool != nil {
        Pool.Close()  // Clean shutdown
    }
}
```

**Key Points:**

-   Connection pools manage expensive database connections
-   Reuse connections instead of creating new ones
-   Handle connection lifecycle properly

**Interview Tips:**

-   Explain why connection pooling is important
-   Know about connection pool configuration
-   Understand connection leaks and how to prevent them

---

### 25. Load Balancing

**What it is:** Distributing load across multiple service providers.

**Example from our project:**

```go
type LoadBalancer struct {
    providers []EmailProvider
}

func (lb *LoadBalancer) SendEmail(req model.EmailRequest) (string, error) {
    var lastError error

    // Try each provider until one succeeds
    for _, provider := range lb.providers {
        err := provider.SendEmail(req)
        if err == nil {
            return provider.GetName(), nil  // Success
        }
        lastError = err  // Keep track of last error
    }

    return "", lastError  // All providers failed
}
```

**Key Points:**

-   Failover mechanism for high availability
-   Try providers in sequence until success
-   Track errors for debugging

**Interview Tips:**

-   Explain different load balancing strategies
-   Know about health checks and circuit breakers
-   Understand failure handling in distributed systems

---

### 26. Modular Architecture

**What it is:** Organizing code into independent, focused modules.

**Example from our project:**

```
internal/
├── config/           # Configuration management
├── database/         # Database connection
├── email/           # Email provider adapters
├── modules/
│   └── email/       # Email business logic
├── model/           # Data models
└── utils/           # Shared utilities

cmd/
└── main.go          # Application entry point
```

**Key Points:**

-   Each module has single responsibility
-   Clear boundaries between modules
-   Internal packages prevent external access

**Interview Tips:**

-   Explain module design principles
-   Know about package organization best practices
-   Understand internal vs public packages

---

### 27. Resource Management

**What it is:** Properly managing resources like files, connections, etc.

**Example from our project:**

```go
func (s *SendGridAdapter) SendEmail(email model.EmailRequest) error {
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return fmt.Errorf("SendGrid request failed: %w", err)
    }
    defer resp.Body.Close()  // Ensure body is closed

    body, err := io.ReadAll(resp.Body)
    // ... rest of function
}

func main() {
    if err := database.InitPostgres(cfg.DatabaseURL); err != nil {
        log.Fatal("Failed to initialize database:", err)
    }
    defer database.Close()  // Ensure database is closed on exit
}
```

**Key Points:**

-   Use `defer` to ensure cleanup happens
-   Close resources as soon as possible
-   Handle cleanup in error cases

**Interview Tips:**

-   Explain the `defer` statement and its uses
-   Know about resource leaks and how to prevent them
-   Understand RAII-style resource management

---

## Interview Preparation Tips

### Common Go Interview Questions

1. **Explain goroutines and channels** (Note: Not used in this project, but important)
2. **What's the difference between arrays and slices?**
3. **How does interface{} work?**
4. **Explain the defer statement**
5. **How do you handle errors in Go?**
6. **What's the difference between value and pointer receivers?**
7. **Explain Go's memory management**
8. **How do you test Go code?**

### Best Practices Demonstrated in This Project

1. **Error Handling**: Always check errors explicitly
2. **Interface Design**: Keep interfaces small and focused
3. **Dependency Injection**: Pass dependencies rather than creating them
4. **Configuration**: Use environment variables for configuration
5. **Logging**: Add meaningful log messages for debugging
6. **Resource Management**: Use defer for cleanup
7. **Package Organization**: Group related functionality

### Key Concepts to Master

1. **Concurrency**: Understand goroutines, channels, and sync package
2. **Testing**: Learn testing patterns and mocking
3. **Performance**: Know about profiling and optimization
4. **Security**: Understand common security practices
5. **Deployment**: Know about building and deploying Go applications

---

## Quick Reference for Interviews

### Go Syntax Cheat Sheet

```go
// Variable declarations
var name string = "value"
name := "value"              // Short declaration
const PI = 3.14

// Function with multiple returns
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Interface definition
type Writer interface {
    Write([]byte) (int, error)
}

// Struct with methods
type Person struct {
    Name string
    Age  int
}

func (p *Person) String() string {
    return fmt.Sprintf("%s (%d years old)", p.Name, p.Age)
}

// Error handling
result, err := someFunction()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}

// JSON handling
type User struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}

// HTTP handler
func handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
```

### Common Interview Gotchas

1. **Slice vs Array**: Arrays have fixed size `[5]int`, slices are dynamic `[]int`
2. **Nil Interface**: `var i interface{} = (*string)(nil)` - `i != nil` is true!
3. **Range Loop**: `for i, v := range slice` - `v` is a copy, not a reference
4. **Goroutine Closures**: Always pass variables or use function parameters
5. **Map Iteration**: Order is not guaranteed, don't rely on it

### Performance Tips

-   Use pointers for large structs
-   Prefer slices over arrays
-   Use `strings.Builder` for string concatenation
-   Understand when to use buffered channels
-   Profile before optimizing

### Testing Patterns

```go
func TestEmailService(t *testing.T) {
    service := NewService(Config{})

    result := service.SendEmail(context.Background(), &EmailRequest{
        ToEmail: "test@example.com",
        Subject: "Test",
    })

    if !result.Success {
        t.Errorf("Expected success, got error: %v", result.Error)
    }
}
```

### Architecture Patterns Used in This Project

1. **Layered Architecture**: Handler → Service → Repository
2. **Dependency Injection**: Services receive dependencies via constructors
3. **Interface Segregation**: Small, focused interfaces
4. **Factory Pattern**: Creating providers based on configuration
5. **Adapter Pattern**: Wrapping external APIs with common interface
6. **Repository Pattern**: Abstracting data access

---

_This knowledge base covers all Go concepts used in the Chitthi email service project. Practice implementing these patterns and you'll be well-prepared for Go backend engineering interviews!_
