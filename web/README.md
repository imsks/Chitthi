# Chitthi Website

A modern, minimal hacker-themed landing page and documentation site for the Chitthi email microservice.

## Features

-   🎨 **Hacker Theme**: Dark design with green terminal-style accents
-   ✨ **Animations**: Smooth animations using Framer Motion
-   📱 **Responsive**: Works perfectly on all devices
-   📚 **Documentation**: Comprehensive API documentation with code examples
-   🎯 **Copy Code**: One-click code copying functionality
-   🌐 **Static Ready**: Optimized for deployment on static platforms

## Tech Stack

-   **Next.js 15** - React framework with App Router
-   **TypeScript** - Type safety
-   **Tailwind CSS** - Utility-first CSS framework
-   **Framer Motion** - Animation library
-   **Lucide React** - Icon library

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Run the development server:**

    ```bash
    npm run dev
    ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── docs/
│   │   │   └── page.tsx          # Documentation page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   └── components/
│       └── MatrixRain.tsx        # Matrix rain effect
├── public/                       # Static assets
└── package.json
```

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Deploy automatically** on push to main branch

### Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `.next`
3. **Deploy automatically** on push to main branch

### GitHub Pages

1. **Add to package.json:**

    ```json
    {
        "scripts": {
            "export": "next build && next export"
        }
    }
    ```

2. **Build and deploy:**
    ```bash
    npm run export
    ```

### Docker

1. **Build the image:**

    ```bash
    docker build -t chitthi-web .
    ```

2. **Run the container:**
    ```bash
    docker run -p 3000:3000 chitthi-web
    ```

## Customization

### Colors

The theme uses a green terminal color scheme. You can customize colors in `src/app/globals.css`:

```css
:root {
    --accent-green: 0, 255, 0;
    --accent-cyan: 0, 255, 255;
    --accent-purple: 147, 51, 234;
}
```

### Animations

Animations are powered by Framer Motion. You can modify animation parameters in the component files.

### Content

-   **Landing page content:** Edit `src/app/page.tsx`
-   **Documentation content:** Edit `src/app/docs/page.tsx`
-   **Global styles:** Edit `src/app/globals.css`

## Performance

-   **Static Generation**: Pages are pre-rendered at build time
-   **Image Optimization**: Next.js Image component for optimal loading
-   **Code Splitting**: Automatic code splitting for better performance
-   **Minification**: CSS and JS are minified in production

## Browser Support

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see the main repository for details.

---

**Built with ❤️ by Sachin (@imsks)**
