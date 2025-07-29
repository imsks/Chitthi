#!/bin/bash

# Chitthi Development Script - Enhanced Version
# This script provides automated setup and development tools for Chitthi
# Supports macOS, Linux, and Windows (WSL/Git Bash)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Version
SCRIPT_VERSION="2.0.0"

echo -e "${BLUE}🚀 Chitthi Development Script v${SCRIPT_VERSION}${NC}"
echo "=================================================="

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*)    OS="macos";;
        Linux*)     OS="linux";;
        CYGWIN*|MINGW*|MSYS*) OS="windows";;
        *)          OS="unknown";;
    esac
    echo -e "${CYAN}📱 Detected OS: ${OS}${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if script is run with sudo (for Linux package installation)
check_sudo() {
    if [[ $EUID -eq 0 ]] && [[ "$OS" == "linux" ]]; then
        echo -e "${RED}❌ Please don't run this script as root. It will use sudo when needed.${NC}"
        exit 1
    fi
}

# Function to install Homebrew on macOS
install_homebrew() {
    if ! command_exists brew; then
        echo -e "${YELLOW}📦 Installing Homebrew...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        # Add Homebrew to PATH
        if [[ -f "/opt/homebrew/bin/brew" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    fi
}

# Function to update package managers
update_package_manager() {
    case $OS in
        "macos")
            if command_exists brew; then
                echo -e "${BLUE}🔄 Updating Homebrew...${NC}"
                brew update
            fi
            ;;
        "linux")
            echo -e "${BLUE}🔄 Updating package manager...${NC}"
            if command_exists apt; then
                sudo apt update
            elif command_exists yum; then
                sudo yum update -y
            elif command_exists pacman; then
                sudo pacman -Sy
            fi
            ;;
    esac
}

# Function to install Go
install_go() {
    if ! command_exists go; then
        echo -e "${YELLOW}📦 Installing Go...${NC}"
        case $OS in
            "macos")
                brew install go
                ;;
            "linux")
                if command_exists apt; then
                    sudo apt install -y golang-go
                elif command_exists yum; then
                    sudo yum install -y golang
                elif command_exists pacman; then
                    sudo pacman -S go
                else
                    echo -e "${YELLOW}⚠️  Please install Go manually from https://golang.org/dl/${NC}"
                fi
                ;;
            "windows")
                echo -e "${YELLOW}⚠️  Please install Go from https://golang.org/dl/ and restart your terminal${NC}"
                ;;
        esac
    else
        echo -e "${GREEN}✅ Go $(go version | cut -d' ' -f3) is already installed${NC}"
    fi
}

# Function to install Node.js
install_nodejs() {
    if ! command_exists node; then
        echo -e "${YELLOW}📦 Installing Node.js...${NC}"
        case $OS in
            "macos")
                brew install node
                ;;
            "linux")
                # Install Node.js via NodeSource
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                if command_exists apt; then
                    sudo apt-get install -y nodejs
                elif command_exists yum; then
                    curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                    sudo yum install -y nodejs
                elif command_exists pacman; then
                    sudo pacman -S nodejs npm
                fi
                ;;
            "windows")
                echo -e "${YELLOW}⚠️  Please install Node.js from https://nodejs.org/ and restart your terminal${NC}"
                ;;
        esac
    else
        echo -e "${GREEN}✅ Node.js $(node --version) is already installed${NC}"
    fi
}

# Function to install Docker
install_docker() {
    if ! command_exists docker; then
        echo -e "${YELLOW}📦 Installing Docker...${NC}"
        case $OS in
            "macos")
                echo -e "${BLUE}Installing Docker Desktop for macOS...${NC}"
                brew install --cask docker
                echo -e "${YELLOW}⚠️  Please start Docker Desktop manually after installation${NC}"
                ;;
            "linux")
                # Install Docker using official script
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                sudo usermod -aG docker $USER
                rm get-docker.sh
                
                # Install Docker Compose
                sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                sudo chmod +x /usr/local/bin/docker-compose
                
                echo -e "${YELLOW}⚠️  Please logout and login again to use Docker without sudo${NC}"
                ;;
            "windows")
                echo -e "${YELLOW}⚠️  Please install Docker Desktop from https://docs.docker.com/desktop/windows/install/${NC}"
                ;;
        esac
    else
        echo -e "${GREEN}✅ Docker $(docker --version | cut -d' ' -f3 | tr -d ',') is already installed${NC}"
    fi
}

# Function to install Air for Go hot reloading
install_air() {
    if ! command_exists air; then
        echo -e "${YELLOW}📦 Installing Air for Go hot reloading...${NC}"
        
        # Try the modern go install method first
        if go install github.com/cosmtrek/air@latest 2>/dev/null; then
            echo -e "${GREEN}✅ Air installed successfully using go install${NC}"
        else
            # Fallback to curl installation method
            echo -e "${YELLOW}⚠️  go install failed, trying curl installation...${NC}"
            case $OS in
                "macos"|"linux")
                    curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin
                    ;;
                "windows")
                    echo -e "${YELLOW}⚠️  Please install Air manually: go install github.com/cosmtrek/air@latest${NC}"
                    return 1
                    ;;
            esac
        fi
        
        # Add GOPATH/bin to PATH if not already there
        GOPATH_BIN="$(go env GOPATH)/bin"
        if [[ ":$PATH:" != *":$GOPATH_BIN:"* ]]; then
            echo "export PATH=\$PATH:$GOPATH_BIN" >> ~/.bashrc
            echo "export PATH=\$PATH:$GOPATH_BIN" >> ~/.zshrc 2>/dev/null || true
            export PATH=$PATH:$GOPATH_BIN
        fi
        
        # Verify installation
        if command_exists air; then
            echo -e "${GREEN}✅ Air installed successfully${NC}"
        else
            echo -e "${RED}❌ Air installation failed${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ Air is already installed${NC}"
    fi
}

# Function to create .env file from template
create_env_file() {
    if [[ ! -f ".env" ]]; then
        echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
        cat > .env << 'EOF'
# Server Configuration
PORT=8080

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chitthi?sslmode=disable

# Redis Configuration
REDIS_URL=redis://localhost:6379

# PostgreSQL Configuration (for Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chitthi

# Message Queue (Optional)
RABBITMQ_URL=amqp://guest:guest@localhost:5672/

# Email Provider Configuration (Optional - for fallback)
BREEVO_API_KEY=
SENDGRID_API_KEY=
SENDGRID_REGION=global
MAILERSEND_API_KEY=

# SMTP Configuration (Optional - for fallback)
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=
SMTP_USE_TLS=true
EOF
        echo -e "${GREEN}✅ .env file created successfully${NC}"
        echo -e "${PURPLE}💡 Please edit .env file with your configuration${NC}"
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
}

# Function to validate .env file
validate_env_file() {
    echo -e "${BLUE}🔍 Validating environment configuration...${NC}"
    
    if [[ ! -f ".env" ]]; then
        echo -e "${RED}❌ .env file not found${NC}"
        return 1
    fi
    
    # Load .env file
    set -a
    source .env
    set +a
    
    # Required variables
    local required_vars=("PORT" "DATABASE_URL" "REDIS_URL")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        printf '%s\n' "${missing_vars[@]}" | sed 's/^/  - /'
        return 1
    fi
    
    echo -e "${GREEN}✅ Environment configuration is valid${NC}"
    
    # Optional: Show configured email providers
    local providers=()
    [[ -n "$BREEVO_API_KEY" ]] && providers+=("Breevo")
    [[ -n "$SENDGRID_API_KEY" ]] && providers+=("SendGrid")
    [[ -n "$MAILERSEND_API_KEY" ]] && providers+=("MailerSend")
    [[ -n "$SMTP_HOST" ]] && providers+=("SMTP")
    
    if [[ ${#providers[@]} -gt 0 ]]; then
        echo -e "${CYAN}📧 Configured email providers: ${providers[*]}${NC}"
    else
        echo -e "${YELLOW}⚠️  No email providers configured (optional for development)${NC}"
    fi
    
    return 0
}

# Function to check Docker daemon
check_docker_daemon() {
    if command_exists docker; then
        if ! docker info >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  Docker daemon is not running. Please start Docker Desktop or Docker service.${NC}"
            return 1
        fi
        echo -e "${GREEN}✅ Docker daemon is running${NC}"
    fi
    return 0
}

# Function to start infrastructure
start_infrastructure() {
    echo -e "${BLUE}🏗️  Starting infrastructure (Redis & PostgreSQL)...${NC}"
    if command_exists docker && check_docker_daemon; then
        docker compose up redis db -d
        echo -e "${GREEN}✅ Infrastructure started${NC}"
        echo -e "${CYAN}   - PostgreSQL: localhost:5432${NC}"
        echo -e "${CYAN}   - Redis: localhost:6379${NC}"
    else
        echo -e "${RED}❌ Docker not available or not running${NC}"
        return 1
    fi
}

# Function to install web dependencies
install_web_deps() {
    echo -e "${BLUE}📦 Installing web dependencies...${NC}"
    if [[ -d "web" ]]; then
        cd web
        npm install
        cd ..
        echo -e "${GREEN}✅ Web dependencies installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Web directory not found${NC}"
    fi
}

# Function to start Go backend
start_backend() {
    echo -e "${BLUE}🚀 Starting Go backend...${NC}"
    if ! validate_env_file; then
        echo -e "${RED}❌ Environment validation failed. Please fix .env file.${NC}"
        return 1
    fi
    
    if command_exists air; then
        echo -e "${CYAN}Using Air for hot reloading...${NC}"
        air
    else
        echo -e "${YELLOW}⚠️  Air not installed. Running with go run...${NC}"
        go run cmd/main.go
    fi
}

# Function to start web frontend
start_frontend() {
    echo -e "${BLUE}🌐 Starting web frontend...${NC}"
    if [[ -d "web" ]]; then
        cd web
        npm run dev
    else
        echo -e "${RED}❌ Web directory not found${NC}"
        return 1
    fi
}

# Function for full automated setup
full_setup() {
    echo -e "${PURPLE}🎯 Running full automated setup...${NC}"
    
    # Update package managers
    update_package_manager
    
    # Install all dependencies
    install_go
    install_nodejs
    install_docker
    install_air
    
    # Setup environment
    create_env_file
    validate_env_file
    
    # Install web dependencies
    install_web_deps
    
    # Start infrastructure
    start_infrastructure
    
    echo -e "${GREEN}🎉 Full setup complete!${NC}"
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo -e "${CYAN}   1. Edit .env file with your configuration${NC}"
    echo -e "${CYAN}   2. Start backend: ./dev.sh backend${NC}"
    echo -e "${CYAN}   3. Start frontend: ./dev.sh frontend${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    local missing_deps=()
    
    ! command_exists go && missing_deps+=("Go")
    ! command_exists node && missing_deps+=("Node.js")
    ! command_exists docker && missing_deps+=("Docker")
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        echo -e "${YELLOW}⚠️  Missing dependencies: ${missing_deps[*]}${NC}"
        echo -e "${BLUE}💡 Run './dev.sh install-deps' to install them automatically${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites are installed${NC}"
    return 0
}

# Function to install dependencies only
install_dependencies() {
    echo -e "${PURPLE}📦 Installing dependencies...${NC}"
    update_package_manager
    install_go
    install_nodejs
    install_docker
    install_air
    echo -e "${GREEN}✅ Dependencies installation complete${NC}"
}

# Main menu
show_menu() {
    echo ""
    echo -e "${BLUE}Choose an option:${NC}"
    echo "1)  Check prerequisites"
    echo "2)  Install dependencies automatically"
    echo "3)  Create/validate .env file"
    echo "4)  Start infrastructure (Redis & PostgreSQL)"
    echo "5)  Install web dependencies"
    echo "6)  Start Go backend"
    echo "7)  Start web frontend"
    echo "8)  Start both backend and frontend"
    echo "9)  Full automated setup"
    echo "10) Show project status"
    echo "11) Exit"
    echo ""
    read -p "Enter your choice (1-11): " choice
}

# Function to show project status
show_status() {
    echo -e "${BLUE}📊 Project Status${NC}"
    echo "=================="
    
    # Environment file
    if [[ -f ".env" ]]; then
        echo -e "${GREEN}✅ .env file exists${NC}"
        if validate_env_file >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Environment configuration is valid${NC}"
        else
            echo -e "${YELLOW}⚠️  Environment configuration has issues${NC}"
        fi
    else
        echo -e "${RED}❌ .env file missing${NC}"
    fi
    
    # Dependencies
    echo ""
    echo -e "${BLUE}Dependencies:${NC}"
    command_exists go && echo -e "${GREEN}✅ Go $(go version | cut -d' ' -f3)${NC}" || echo -e "${RED}❌ Go not installed${NC}"
    command_exists node && echo -e "${GREEN}✅ Node.js $(node --version)${NC}" || echo -e "${RED}❌ Node.js not installed${NC}"
    command_exists docker && echo -e "${GREEN}✅ Docker $(docker --version | cut -d' ' -f3 | tr -d ',')${NC}" || echo -e "${RED}❌ Docker not installed${NC}"
    command_exists air && echo -e "${GREEN}✅ Air (Go hot reload)${NC}" || echo -e "${YELLOW}⚠️  Air not installed${NC}"
    
    # Infrastructure status
    echo ""
    echo -e "${BLUE}Infrastructure:${NC}"
    if command_exists docker && check_docker_daemon >/dev/null 2>&1; then
        if docker compose ps | grep -q "chitthi_db.*Up"; then
            echo -e "${GREEN}✅ PostgreSQL running${NC}"
        else
            echo -e "${RED}❌ PostgreSQL not running${NC}"
        fi
        
        if docker compose ps | grep -q "chitthi_redis.*Up"; then
            echo -e "${GREEN}✅ Redis running${NC}"
        else
            echo -e "${RED}❌ Redis not running${NC}"
        fi
    else
        echo -e "${RED}❌ Docker not available or not running${NC}"
    fi
    
    # Web dependencies
    echo ""
    echo -e "${BLUE}Web Dependencies:${NC}"
    if [[ -d "web/node_modules" ]]; then
        echo -e "${GREEN}✅ Web dependencies installed${NC}"
    else
        echo -e "${RED}❌ Web dependencies not installed${NC}"
    fi
}

# Handle menu choice
handle_choice() {
    case $choice in
        1)
            check_prerequisites
            ;;
        2)
            install_dependencies
            ;;
        3)
            create_env_file
            validate_env_file
            ;;
        4)
            start_infrastructure
            ;;
        5)
            install_web_deps
            ;;
        6)
            start_backend
            ;;
        7)
            start_frontend
            ;;
        8)
            echo -e "${BLUE}🚀 Starting both services...${NC}"
            if start_infrastructure && install_web_deps; then
                echo -e "${GREEN}✅ Infrastructure and dependencies ready${NC}"
                echo -e "${YELLOW}📝 Start backend in one terminal: ./dev.sh backend${NC}"
                echo -e "${YELLOW}📝 Start frontend in another terminal: ./dev.sh frontend${NC}"
                echo -e "${CYAN}🌐 URLs will be:${NC}"
                echo -e "${CYAN}   - Backend: http://localhost:8080${NC}"
                echo -e "${CYAN}   - Frontend: http://localhost:3000${NC}"
            fi
            ;;
        9)
            full_setup
            ;;
        10)
            show_status
            ;;
        11)
            echo -e "${GREEN}Goodbye! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
}

# Main execution
main() {
    # Detect OS and check sudo
    detect_os
    check_sudo
    
    # Check if script is run with arguments
    if [[ $# -eq 0 ]]; then
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
            "check"|"prereq"|"prerequisites")
                check_prerequisites
                ;;
            "install-deps"|"install"|"deps")
                install_dependencies
                ;;
            "env"|"environment")
                create_env_file
                validate_env_file
                ;;
            "infra"|"infrastructure")
                start_infrastructure
                ;;
            "web-deps"|"web")
                install_web_deps
                ;;
            "backend"|"back"|"api")
                start_backend
                ;;
            "frontend"|"front"|"ui")
                start_frontend
                ;;
            "full"|"setup"|"init")
                full_setup
                ;;
            "status"|"info")
                show_status
                ;;
            "help"|"--help"|"-h")
                echo -e "${BLUE}Chitthi Development Script v${SCRIPT_VERSION}${NC}"
                echo ""
                echo -e "${YELLOW}Usage: $0 [command]${NC}"
                echo ""
                echo -e "${CYAN}Commands:${NC}"
                echo "  check          - Check prerequisites"
                echo "  install-deps   - Install dependencies automatically"
                echo "  env            - Create/validate .env file"
                echo "  infra          - Start infrastructure"
                echo "  web-deps       - Install web dependencies"
                echo "  backend        - Start Go backend"
                echo "  frontend       - Start web frontend"
                echo "  full           - Run full automated setup"
                echo "  status         - Show project status"
                echo "  help           - Show this help message"
                echo ""
                echo -e "${PURPLE}Examples:${NC}"
                echo "  $0 full        # Complete automated setup"
                echo "  $0 backend     # Start backend server"
                echo "  $0 frontend    # Start frontend server"
                echo "  $0 status      # Check project status"
                ;;
            *)
                echo -e "${RED}Unknown command: $1${NC}"
                echo -e "${YELLOW}Run '$0 help' for usage information${NC}"
                exit 1
                ;;
        esac
    fi
}

# Run main function with all arguments
main "$@" 