#!/bin/bash

# Chitthi Development Script
# This script helps you run both the Go backend and web frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Chitthi Development Script${NC}"
echo "=================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists go; then
    echo -e "${RED}❌ Go is not installed. Please install Go first.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Some features may not work.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Function to start infrastructure
start_infrastructure() {
    echo -e "${BLUE}Starting infrastructure (Redis & PostgreSQL)...${NC}"
    if command_exists docker; then
        docker compose up redis db -d
        echo -e "${GREEN}✅ Infrastructure started${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker not available. Please start Redis and PostgreSQL manually.${NC}"
    fi
}

# Function to install web dependencies
install_web_deps() {
    echo -e "${BLUE}Installing web dependencies...${NC}"
    cd web
    npm install
    cd ..
    echo -e "${GREEN}✅ Web dependencies installed${NC}"
}

# Function to start Go backend
start_backend() {
    echo -e "${BLUE}Starting Go backend...${NC}"
    if command_exists air; then
        air
    else
        echo -e "${YELLOW}⚠️  Air not installed. Running with go run...${NC}"
        go run cmd/main.go
    fi
}

# Function to start web frontend
start_frontend() {
    echo -e "${BLUE}Starting web frontend...${NC}"
    cd web
    npm run dev
}

# Main menu
show_menu() {
    echo ""
    echo -e "${BLUE}Choose an option:${NC}"
    echo "1) Start infrastructure (Redis & PostgreSQL)"
    echo "2) Install web dependencies"
    echo "3) Start Go backend"
    echo "4) Start web frontend"
    echo "5) Start both backend and frontend (in background)"
    echo "6) Full setup (infrastructure + dependencies + both services)"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
}

# Handle menu choice
handle_choice() {
    case $choice in
        1)
            start_infrastructure
            ;;
        2)
            install_web_deps
            ;;
        3)
            start_backend
            ;;
        4)
            start_frontend
            ;;
        5)
            echo -e "${BLUE}Starting both services in background...${NC}"
            start_infrastructure
            install_web_deps
            echo -e "${GREEN}✅ Backend and frontend started in background${NC}"
            echo -e "${YELLOW}Backend: http://localhost:8080${NC}"
            echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
            ;;
        6)
            echo -e "${BLUE}Running full setup...${NC}"
            start_infrastructure
            install_web_deps
            echo -e "${GREEN}✅ Full setup complete!${NC}"
            echo -e "${YELLOW}You can now start the services manually:${NC}"
            echo -e "${YELLOW}  Backend: go run cmd/main.go${NC}"
            echo -e "${YELLOW}  Frontend: cd web && npm run dev${NC}"
            ;;
        7)
            echo -e "${GREEN}Goodbye! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    # Interactive mode
    while true; do
        show_menu
        handle_choice
        echo ""
        read -p "Press Enter to continue..."
    done
else
    # Command line mode
    case $1 in
        "infra")
            start_infrastructure
            ;;
        "install")
            install_web_deps
            ;;
        "backend")
            start_backend
            ;;
        "frontend")
            start_frontend
            ;;
        "full")
            echo -e "${BLUE}Running full setup...${NC}"
            start_infrastructure
            install_web_deps
            echo -e "${GREEN}✅ Full setup complete!${NC}"
            ;;
        *)
            echo -e "${RED}Usage: $0 [infra|install|backend|frontend|full]${NC}"
            echo "  infra     - Start infrastructure"
            echo "  install   - Install web dependencies"
            echo "  backend   - Start Go backend"
            echo "  frontend  - Start web frontend"
            echo "  full      - Run full setup"
            exit 1
            ;;
    esac
fi 