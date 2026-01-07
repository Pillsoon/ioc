# Project Structure

This document outlines the organized structure of the Irvine Onnuri Choir app.

## 📁 Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   │   ├── PageHeader.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── ErrorState.vue
│   │   └── Card.vue
│   └── layout/          # Layout-specific components
│       └── (future components)
├── layouts/             # Page layouts
│   └── MainLayout.vue   # Main app layout with header, nav, etc.
├── pages/               # Page components (routes)
│   ├── choir/           # Choir-related pages
│   │   ├── Home.vue
│   │   ├── songs/
│   │   │   └── Songs.vue
│   │   ├── notices/
│   │   │   └── Notices.vue
│   │   ├── absence/
│   │   │   └── Absence.vue
│   │   ├── qt-sharing/
│   │   │   └── QTSharing.vue
│   │   ├── meal-signup/
│   │   │   └── MealSignUp.vue
│   │   ├── donation/
│   │   │   └── Donation.vue
│   │   └── index.js
│   ├── auth/            # Authentication pages
│   │   ├── Login.vue
│   │   └── index.js
│   ├── admin/           # Admin pages
│   │   ├── Dashboard.vue
│   │   └── index.js
│   ├── member/          # Member pages
│   │   ├── Profile.vue
│   │   └── index.js
│   └── index.js
├── services/            # API and business logic
│   ├── api.js          # Main API service
│   ├── songsService.js
│   ├── announcementsService.js
│   ├── absencesService.js
│   ├── qtSharingService.js
│   ├── mealSignupService.js
│   ├── donationsService.js
│   └── index.js        # Service exports
├── types/               # Type definitions and constants
│   └── index.js
├── stores/              # Pinia stores (future)
├── utils/               # Utility functions (future)
├── assets/              # Static assets (future)
├── App.vue              # Root component
├── main.js              # App entry point
└── style.css            # Global styles
```

## 🎯 Component Organization

### **Pages** (`/pages`)
- **Purpose**: Full page components that represent routes
- **Naming**: PascalCase (e.g., `Home.vue`, `Songs.vue`)
- **Structure**: Complete page logic with data fetching and UI
- **Organization**: Grouped by feature/domain for better scalability

#### **Page Categories**
- **`/choir`** - Main choir functionality (songs, notices, absence, etc.)
- **`/auth`** - Authentication pages (login, register, password reset)
- **`/admin`** - Administrative pages (dashboard, user management)
- **`/member`** - Member-specific pages (profile, settings)

#### **Sub-categories** (e.g., `/choir/songs`)
- **Purpose**: Group related pages within a domain
- **Benefits**: Better organization, easier to find related functionality
- **Examples**: `/choir/songs`, `/choir/notices`, `/admin/users`

### **UI Components** (`/components/ui`)
- **Purpose**: Reusable, generic UI components
- **Naming**: PascalCase (e.g., `PageHeader.vue`, `LoadingSpinner.vue`)
- **Structure**: Pure UI components with minimal logic
- **Examples**: Buttons, Cards, Spinners, Error States

### **Layout Components** (`/components/layout`)
- **Purpose**: Layout-specific components
- **Naming**: PascalCase (e.g., `Header.vue`, `Sidebar.vue`)
- **Structure**: Components that define page structure
- **Examples**: Navigation, Sidebar, Footer

### **Layouts** (`/layouts`)
- **Purpose**: Page layout templates
- **Naming**: PascalCase (e.g., `MainLayout.vue`)
- **Structure**: Wrapper components that define page structure
- **Examples**: MainLayout, AuthLayout, AdminLayout

## 🔧 Service Organization

### **API Service** (`/services/api.js`)
- **Purpose**: Core API functionality and Firebase integration
- **Features**: CRUD operations, data transformation, error handling

### **Feature Services** (`/services/*Service.js`)
- **Purpose**: Feature-specific business logic
- **Examples**: SongsService, AnnouncementsService, AbsencesService
- **Structure**: Each service handles one domain/feature

### **Service Index** (`/services/index.js`)
- **Purpose**: Centralized service exports and initialization
- **Features**: Service initialization, status checking

## 📋 Naming Conventions

### **Files**
- **Components**: PascalCase (`PageHeader.vue`)
- **Pages**: PascalCase (`Home.vue`)
- **Services**: camelCase (`songsService.js`)
- **Utilities**: camelCase (`dateUtils.js`)

### **Directories**
- **Components**: lowercase (`components/`)
- **Pages**: lowercase (`pages/`)
- **Services**: lowercase (`services/`)

### **Variables**
- **Reactive**: camelCase (`currentSong`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Functions**: camelCase (`fetchSongs`)

## 🚀 Benefits of This Structure

### **1. Scalability**
- Easy to add new pages and components
- Clear separation of concerns
- Modular architecture

### **2. Maintainability**
- Logical organization
- Easy to find files
- Consistent patterns

### **3. Reusability**
- UI components can be reused across pages
- Services can be shared between components
- Layouts can be used for different page types

### **4. Team Collaboration**
- Clear ownership of different areas
- Easy to understand project structure
- Consistent patterns for new developers

## 🔄 Future Additions

### **Stores** (`/stores`)
- Pinia stores for state management
- Global state for user, app settings, etc.

### **Utils** (`/utils`)
- Utility functions
- Helper functions for common operations

### **Assets** (`/assets`)
- Images, icons, fonts
- Static resources

### **Composables** (`/composables`)
- Vue 3 composables
- Reusable composition functions

## 📝 Best Practices

### **Component Organization**
1. **Keep components small and focused**
2. **Use props and events for communication**
3. **Avoid deep nesting in component structure**
4. **Use slots for flexible content**

### **Service Organization**
1. **One service per domain/feature**
2. **Keep business logic in services**
3. **Use consistent error handling**
4. **Document service methods**

### **Page Organization**
1. **Pages should be self-contained**
2. **Use services for data fetching**
3. **Keep page logic focused on UI**
4. **Use layouts for common structure**

This structure provides a solid foundation for the choir management app and can easily scale as new features are added.
