# Irvine Onnuri Choir - Nuxt.js Application

A modern choir management system built with Nuxt.js, featuring Korean language support and mobile-first design.

## 🚀 Features

- **Choir Management**: Song management, announcements, absence tracking
- **QT Sharing**: Daily devotional sharing platform
- **Meal Sign-up**: Meal planning and coordination
- **Donations**: Financial contribution management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Korean Language Support**: Full Korean UI with proper font optimization

## 🛠 Technology Stack

- **Framework**: Nuxt.js 3.12+
- **Styling**: Tailwind CSS 4.x
- **State Management**: Pinia
- **Language**: Vue.js 3 with Composition API
- **Build Tool**: Vite (via Nuxt)

## 📁 Project Structure

```
├── assets/           # CSS and static assets
├── components/       # Vue components
├── composables/      # Nuxt composables (services)
├── layouts/          # Layout components
├── pages/            # File-based routing
├── plugins/          # Nuxt plugins
├── public/           # Static files
├── types/            # TypeScript definitions
└── nuxt.config.ts    # Nuxt configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## 🎨 Styling

The application uses Tailwind CSS with custom configurations:

- **Custom Colors**: Primary and secondary color palettes
- **Korean Fonts**: Noto Sans KR for optimal Korean text rendering
- **Animations**: Custom fade-in, slide-up, and gentle bounce effects
- **Responsive Design**: Mobile-first approach with breakpoints

## 📱 Pages

- `/` - Home page
- `/songs` - Song management
- `/notices` - Announcements
- `/absence` - Absence tracking
- `/qt-sharing` - QT sharing platform
- `/meal-signup` - Meal sign-up
- `/donation` - Donation management
- `/login` - Authentication
- `/admin` - Admin dashboard
- `/profile` - User profile

## 🔧 Configuration

### Environment Variables

Copy `env.nuxt.example` to `.env` and configure:

```env
# API Configuration
API_BASE_URL=http://localhost:3000/api

# Development Settings
NODE_ENV=development
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
```

### Nuxt Configuration

The `nuxt.config.ts` file contains:
- Module configuration (Tailwind CSS, Pinia)
- App metadata and SEO settings
- Runtime configuration
- SSR settings

## 🚀 Deployment

### Static Generation

```bash
npm run generate
```

### Server Deployment

```bash
npm run build
npm run preview
```

## 📝 Development Notes

- The application uses file-based routing (Nuxt convention)
- Components are auto-imported
- Services are converted to Nuxt composables
- Static assets are served from the `public/` directory
- Korean language support is optimized with proper font loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to Irvine Onnuri Church.