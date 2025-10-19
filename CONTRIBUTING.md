# Contributing to Chitthi 📬

Thank you for your interest in contributing to Chitthi! We welcome contributions from everyone. This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- **Be respectful** of differing viewpoints and experiences
- **Be collaborative** and help others succeed
- **Be patient** with newcomers and those learning
- **Be constructive** in feedback and criticism
- **Focus on what's best** for the community and project

---

## 🎯 How Can I Contribute?

There are many ways to contribute to Chitthi:

### 1. 🐛 Report Bugs

If you find a bug, please create an issue with:

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Go version, etc.)
- **Screenshots or logs** if applicable

[Report a Bug](https://github.com/imsks/chitthi/issues/new?labels=bug)

### 2. 💡 Suggest Features

Have an idea for a new feature? We'd love to hear it!

- **Check existing issues** to avoid duplicates
- **Describe the feature** and its use case
- **Explain why it would be valuable** to users
- **Consider implementation details** if possible

[Request a Feature](https://github.com/imsks/chitthi/issues/new?labels=enhancement)

### 3. 📝 Improve Documentation

Documentation improvements are always welcome:

- Fix typos or clarify existing docs
- Add examples or tutorials
- Improve API documentation
- Translate documentation

### 4. 💻 Submit Code Changes

Want to fix a bug or implement a feature? Great!

- Check the [open issues](https://github.com/imsks/chitthi/issues)
- Comment on an issue to let others know you're working on it
- Follow the [development workflow](#development-workflow)

### 5. 🌟 Spread the Word

Help us grow the community:

- Star the repository on GitHub
- Share Chitthi on social media
- Write blog posts or tutorials
- Present at meetups or conferences

---

## 🚀 Getting Started

### Prerequisites

Before you start contributing, make sure you have:

- **Go 1.24.3+** installed
- **Docker & Docker Compose** installed
- **Git** installed
- **Node.js 18+** (for web frontend)
- **Air** (for hot reloading): `go install github.com/air-verse/air@latest`

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/chitthi.git
cd chitthi
```

3. **Add upstream remote**:

```bash
git remote add upstream https://github.com/imsks/chitthi.git
```

### Set Up Development Environment

1. **Start infrastructure**:

```bash
docker compose up redis db -d
```

2. **Run the backend**:

```bash
# Option 1: Using Air (hot reload)
air

# Option 2: Using Go directly
go run cmd/main.go
```

3. **Run the frontend** (optional):

```bash
cd web
npm install
npm run dev
```

The API will be available at `http://localhost:8000`

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use prefixes:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring
- `test/` - for adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed
- Commit your changes with clear messages

### 3. Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**

```bash
git commit -m "feat(email): add support for CC and BCC fields"
git commit -m "fix(smtp): resolve connection timeout issue"
git commit -m "docs(api): update authentication examples"
```

### 4. Keep Your Fork Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

---

## 🔀 Pull Request Process

### Before Submitting

- ✅ Your code builds without errors
- ✅ All tests pass
- ✅ Code follows project conventions
- ✅ Documentation is updated
- ✅ Commits are clear and well-organized

### Submitting a Pull Request

1. **Go to GitHub** and open a Pull Request
2. **Fill out the PR template** completely
3. **Link related issues** using `Fixes #123` or `Closes #123`
4. **Request review** from maintainers
5. **Address review feedback** promptly

### PR Title Format

```
type(scope): brief description
```

Example: `feat(provider): add AWS SES email provider support`

### PR Description

Include:

- **What** - What changes does this PR introduce?
- **Why** - Why is this change needed?
- **How** - How does this change work?
- **Testing** - How was this tested?
- **Screenshots** - If applicable (for UI changes)

### Review Process

- Maintainers will review your PR
- You may be asked to make changes
- Once approved, your PR will be merged
- Your contribution will be credited

---

## 📏 Coding Standards

### Go Code

- Follow [Effective Go](https://golang.org/doc/effective_go.html) guidelines
- Use `gofmt` for formatting: `go fmt ./...`
- Use `golint` for linting: `golangci-lint run`
- Write meaningful variable and function names
- Add comments for exported functions and complex logic
- Keep functions small and focused

**Example:**

```go
// SendEmail sends an email using the configured provider.
// It returns an error if the email fails to send.
func (s *EmailService) SendEmail(ctx context.Context, req *EmailRequest) error {
    if err := s.validateRequest(req); err != nil {
        return fmt.Errorf("invalid request: %w", err)
    }
    
    provider, err := s.selectProvider(req)
    if err != nil {
        return fmt.Errorf("provider selection failed: %w", err)
    }
    
    return provider.Send(ctx, req)
}
```

### TypeScript/React Code

- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful component and prop names

**Example:**

```typescript
interface EmailFormProps {
  onSubmit: (data: EmailData) => Promise<void>;
  isLoading?: boolean;
}

export const EmailForm: React.FC<EmailFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  // Component implementation
};
```

### General Guidelines

- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple, Stupid
- **SOLID** - Follow SOLID principles
- **Error Handling** - Always handle errors gracefully
- **Security** - Never commit secrets or API keys

---

## 🏗️ Project Structure

Understanding the project structure will help you navigate the codebase:

```
chitthi/
├── cmd/
│   └── main.go              # Application entry point
├── internal/
│   ├── config/              # Configuration management
│   ├── database/            # Database connections
│   ├── email/               # Email provider implementations
│   │   ├── adapter.go       # Provider adapter interface
│   │   ├── sendgrid.go      # SendGrid implementation
│   │   ├── breevo.go        # Breevo implementation
│   │   ├── mailersend.go    # MailerSend implementation
│   │   └── smtp.go          # SMTP implementation
│   ├── handler/             # HTTP handlers
│   ├── middleware/          # HTTP middleware
│   ├── model/               # Data models
│   └── modules/             # Feature modules
│       └── email/           # Email module
│           ├── handler.go   # HTTP handlers
│           ├── service.go   # Business logic
│           ├── repository.go # Data access
│           └── model.go     # Domain models
├── migrations/              # Database migrations
├── web/                     # Frontend application
│   ├── app/                 # Next.js pages
│   └── components/          # React components
├── docker-compose.yml       # Docker services
├── Dockerfile              # Docker image
└── README.md               # Project documentation
```

---

## 🧪 Testing

### Writing Tests

- Write unit tests for new functionality
- Test edge cases and error conditions
- Use table-driven tests for Go
- Mock external dependencies

**Go Test Example:**

```go
func TestEmailService_SendEmail(t *testing.T) {
    tests := []struct {
        name    string
        request *EmailRequest
        wantErr bool
    }{
        {
            name: "valid email",
            request: &EmailRequest{
                From:    "sender@example.com",
                To:      "recipient@example.com",
                Subject: "Test",
                Body:    "Hello",
            },
            wantErr: false,
        },
        {
            name: "invalid email format",
            request: &EmailRequest{
                From:    "invalid-email",
                To:      "recipient@example.com",
                Subject: "Test",
                Body:    "Hello",
            },
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            service := NewEmailService()
            err := service.SendEmail(context.Background(), tt.request)
            
            if (err != nil) != tt.wantErr {
                t.Errorf("SendEmail() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
```

### Running Tests

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run tests with verbose output
go test -v ./...

# Run specific test
go test -run TestEmailService_SendEmail ./internal/modules/email
```

---

## 📚 Documentation

### Code Documentation

- Add comments to exported functions and types
- Use godoc format for Go documentation
- Include examples where helpful

### README and Guides

- Update README.md for significant changes
- Add examples to relevant sections
- Keep documentation in sync with code

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error codes and responses

---

## 👥 Community

### Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Email**: Contact maintainers directly

### Stay Connected

- ⭐ Star the repository
- 👀 Watch for updates
- 🍴 Fork and contribute
- 💬 Join discussions

---

## 🎉 Recognition

All contributors will be recognized in our [Contributors](https://github.com/imsks/chitthi/graphs/contributors) page.

Thank you for contributing to Chitthi! Together, we're building something great. 🚀

---

## 📝 License

By contributing to Chitthi, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Questions?** Feel free to reach out by opening a [discussion](https://github.com/imsks/chitthi/discussions) or [issue](https://github.com/imsks/chitthi/issues).

Happy coding! 💻✨

