# EclipseAI - Advanced AI Solutions Platform

A cutting-edge, professional website featuring intelligent AI solutions with advanced dark theme, glassmorphic UI components, and interactive animations. This platform showcases EclipseAI's innovative approach to artificial intelligence, delivering smarter solutions for modern businesses.

## ✨ Advanced Features

### 🌙 Dark Theme & Glassmorphic Design
- **Professional Dark Palette**: Sophisticated dark theme with high contrast text
- **Translucent UI Components**: Semi-transparent panels, cards, and sections
- **Glassmorphic Effects**: Subtle blur effects with backdrop-filter support
- **Enhanced Contrast**: Accessible colors within the dark theme palette

### 🎨 Interactive Animations
- **Dynamic Particle System**: 150+ animated particles with mouse interaction
- **Performance Optimized**: GPU-accelerated WebGL rendering
- **Responsive Design**: Automatically adjusts to screen size
- **Mobile Friendly**: Optimized performance for mobile devices

### ⚡ Enhanced UI Interactions
- **GPU-Accelerated Animations**: Smooth, fluid transitions using CSS transforms
- **Ripple Effects**: Material Design-inspired ripple effects on buttons
- **Glow Effects**: Subtle glow animations on hover
- **Parallax Scrolling**: Enhanced parallax effects with GSAP
- **Smooth Scrolling**: Advanced easing with GSAP ScrollTo plugin

### ♿ Accessibility Features
- **Reduced Motion Support**: Respects user's motion preferences
- **Keyboard Navigation**: Enhanced keyboard navigation support
- **Screen Reader Compatible**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and tab order
- **High Contrast Mode**: Support for high contrast display preferences

### Platform Sections
- **Hero Section**: Compelling headline with animated floating cards and performance statistics
- **Value Proposition**: Clear messaging about EclipseAI's intelligent solutions
- **Core Capabilities**: Three key platform strengths with icons and descriptions
- **Feature Highlights**: Six main platform features with visual cards
- **Solution Workflow**: Real-world application example with step-by-step process
- **Security & Infrastructure**: Enterprise-grade security badges and deployment options
- **User Journey**: Complete process visualization from concept to production
- **Target Users**: Comprehensive overview for different organizational roles
- **Competitive Advantages**: Platform differentiators and comparison matrix
- **Footer**: Complete footer with links and company information

### Technical Features
- **Smooth Scrolling**: Native smooth scroll behavior with custom animations
- **Intersection Observer**: Performance-optimized scroll animations
- **Mobile-First**: Responsive design starting from mobile devices
- **Accessibility**: Keyboard navigation, focus management, and semantic HTML
- **Performance**: Optimized with debounced scroll events and efficient animations
- **Cross-Browser**: Compatible with all modern browsers

## 🛠️ Technologies Used

### Core Technologies
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Advanced styling with custom properties and glassmorphic effects
- **Vanilla JavaScript**: Modern ES6+ features with modular architecture

### Animation & Effects
- **Three.js**: WebGL particle system and 3D animations
- **GSAP**: Professional-grade animation library for smooth transitions
- **CSS Custom Properties**: Dynamic theming and responsive design

### Performance
- **WebGL**: Hardware-accelerated graphics
- **RequestAnimationFrame**: Optimized animation loops
- **Intersection Observer**: Efficient scroll-based animations
- **Debounced Events**: Performance-optimized event handling

## 📁 Project Structure

```
eclipse-ai-website/
├── index.html              # Main HTML file with Three.js canvas
├── styles.css              # Advanced CSS with dark theme and glassmorphic effects
├── script.js               # Enhanced JavaScript with Three.js and GSAP
├── package.json            # Dependencies (Three.js, GSAP, dev tools)
└── README.md              # This documentation
```

## 🎨 Design System

### Dark Theme Color Palette
- **Background Primary**: #0f172a
- **Background Secondary**: #1e293b
- **Accent Blue**: #60a5fa
- **Accent Purple**: #a78bfa
- **Accent Cyan**: #22d3ee
- **Text Primary**: #f8fafc
- **Text Secondary**: #cbd5e1
- **Glass Background**: rgba(255, 255, 255, 0.1)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Hero Title**: 3.5rem (desktop), 2.5rem (tablet), 2rem (mobile)
- **Section Titles**: 2.5rem (desktop), 2rem (tablet), 1.75rem (mobile)

### Spacing
- **Section Padding**: 80px (desktop), 60px (mobile)
- **Container Max Width**: 1200px
- **Grid Gaps**: 2rem standard, 1rem on mobile

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Node.js (for development server)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eclipse-ai-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   # Option 1: Use the batch file (Windows)
   start-server.bat
   
   # Option 2: Manual start
   cd server
   npm install
   npm start
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Alternative Setup
For a simple static server:
```bash
npm run start
```

### Quick Start (No Installation)
Simply open `index.html` in a modern web browser. Note: Some advanced features may not work without a local server due to CORS restrictions.

## 🔧 Backend Server Setup

The EclipseAI platform includes a Node.js backend server for user authentication and data management.

### Server Features
- **User Registration**: Secure account creation with password hashing
- **User Authentication**: JWT-based login system
- **MongoDB Integration**: Cloud database for user data storage
- **CORS Support**: Cross-origin requests enabled
- **API Endpoints**: RESTful API for frontend integration

### API Endpoints
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication  
- `GET /api/profile` - Get user profile (requires token)
- `GET /api/health` - Health check

### Server Configuration
- **Port**: 4000
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Password Security**: bcrypt hashing

### Troubleshooting
If you encounter network errors when creating accounts or signing in:

1. **Check server status**: Visit `http://localhost:4000/api/health`
2. **Start the server**: Run `start-server.bat` or `npm start` in the server folder
3. **Test API**: Use `test-api.html` to verify all endpoints are working

For detailed server setup instructions, see [SERVER_SETUP.md](SERVER_SETUP.md).

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## ✨ Key Animations

### Scroll Animations
- **Fade In**: Elements fade in as they enter viewport
- **Slide In**: Left/right slide animations for variety
- **Scale In**: Scale animations for emphasis
- **Staggered**: Delayed animations for grouped elements

### Interactive Animations
- **Hover Effects**: Card lift and scale on hover
- **Button Ripples**: Click ripple effects on buttons
- **Floating Cards**: Continuous floating animation in hero
- **Parallax**: Subtle parallax effect on floating elements

### Performance Optimizations
- **Intersection Observer**: Efficient scroll-based animations
- **Debounced Events**: Optimized scroll event handling
- **CSS Transforms**: Hardware-accelerated animations
- **RequestAnimationFrame**: Smooth counter animations

## 🎯 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+

## 🔧 Customization

### Color Scheme
The website uses CSS custom properties for easy theming. Main variables are defined in `:root`:

```css
:root {
    /* Dark Theme Colors */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --accent-blue-bright: #60a5fa;
    --accent-purple: #a78bfa;
    
    /* Glassmorphic Effects */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-blur: blur(20px);
}
```

### Animation Settings
Adjust animation timing and effects:

```css
:root {
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Three.js Configuration
Modify particle system settings in `script.js`:

```javascript
// Adjust particle count and behavior
const particleCount = 150; // Increase for more particles
const speed = 0.5 + (index * 0.1); // Adjust parallax speed
```

### Content
- **Text**: Update content in `index.html`
- **Images**: Replace placeholder content with actual images
- **Links**: Update navigation and footer links
- **Branding**: EclipseAI branding throughout the platform

## 📈 Performance Features

### Desktop
- **WebGL Rendering**: Hardware-accelerated particle system
- **GSAP Animations**: Optimized animation library
- **CSS Transforms**: GPU-accelerated transitions
- **Lazy Loading**: Intersection Observer for scroll animations

### Mobile
- **Three.js Disabled**: Particle system disabled on mobile for performance
- **Reduced Animations**: Simplified animations for better battery life
- **Touch Optimized**: Enhanced touch interactions

### Performance Metrics
- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repos
- **AWS S3**: Scalable static hosting

### CDN Optimization
For production, consider:
- **Image Optimization**: WebP format with fallbacks
- **CSS/JS Minification**: Reduce file sizes
- **Gzip Compression**: Server-side compression
- **CDN**: Global content delivery

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository or contact the EclipseAI development team.

---

**Note**: This is an advanced version of the EclipseAI website with professional-grade animations and effects. The platform showcases intelligent AI solutions designed to shape smarter business outcomes.

**Built with ❤️ for the future of AI**