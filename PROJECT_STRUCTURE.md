# 📁 Project Structure

This is a monorepo containing both the Go backend and web frontend for Chitthi.

```
chitthi/
├── 📁 cmd/                    # Go application entry point
│   └── main.go               # Main application file
├── 📁 internal/               # Go internal packages
│   ├── 📁 config/            # Configuration management
│   ├── 📁 database/          # Database connections
│   ├── 📁 email/             # Email provider implementations
│   ├── 📁 handler/           # HTTP handlers
│   ├── 📁 model/             # Data models
│   ├── 📁 modules/           # Business logic modules
│   └── 📁 utils/             # Utility functions
├── 📁 web/                   # Next.js web frontend
│   ├── 📁 app/               # Next.js 13+ app directory
│   │   ├── 📁 docs/          # Documentation pages
│   │   ├── 📁 quick-start/   # Quick start guide
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── 📁 components/        # React components
│   │   └── 📁 ui/            # UI components (shadcn/ui)
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 lib/               # Utility libraries
│   ├── package.json          # Node.js dependencies
│   └── next.config.js        # Next.js configuration
├── 📁 migrations/            # Database migrations
├── 📁 tmp/                   # Temporary files
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── dev.sh                   # Development script
├── docker-compose.yml       # Docker services
├── Dockerfile               # Docker configuration
├── go.mod                   # Go module definition
├── go.sum                   # Go dependencies checksum
├── readme.md                # Project documentation
└── PROJECT_STRUCTURE.md     # This file
```

## 🚀 Development Workflow

### Single Repository Benefits

1. **Unified Versioning**: Both backend and frontend are versioned together
2. **Simplified Deployment**: Deploy both services from one repository
3. **Shared Configuration**: Common environment variables and settings
4. **Easier Development**: One command to start both services

### Key Files

-   **`dev.sh`**: Development script for managing both services
-   **`.env.example`**: Template for environment variables
-   **`docker-compose.yml`**: Infrastructure services (Redis, PostgreSQL)
-   **`web/`**: Complete Next.js web application
-   **`cmd/main.go`**: Go backend entry point

### Development Commands

```bash
# Full setup
./dev.sh full

# Individual services
./dev.sh infra     # Start Redis & PostgreSQL
./dev.sh install   # Install web dependencies
./dev.sh backend   # Start Go backend
./dev.sh frontend  # Start web frontend

# Interactive mode
./dev.sh
```

### Access Points

-   **Backend API**: http://localhost:8080
-   **Web Frontend**: http://localhost:3000
-   **Documentation**: http://localhost:3000/docs
-   **Quick Start**: http://localhost:3000/quick-start

## 🔧 Technology Stack

### Backend (Go)

-   **Framework**: Standard Go HTTP server
-   **Database**: PostgreSQL with migrations
-   **Cache**: Redis
-   **Email Providers**: SMTP, SendGrid, Breevo, MailerSend
-   **Development**: Air (hot reload)

### Frontend (Next.js)

-   **Framework**: Next.js 13+ with App Router
-   **UI**: shadcn/ui components
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **TypeScript**: Full type safety

### Infrastructure

-   **Containerization**: Docker & Docker Compose
-   **Database**: PostgreSQL
-   **Cache**: Redis
-   **Development**: Hot reload for both services
