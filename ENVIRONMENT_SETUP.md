# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Irvine Onnuri Choir app.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Copy the local development file:**
   ```bash
   cp env.local.example .env.local
   ```

3. **Edit the files** with your actual values

## File Types

### `.env` (Production/Shared)
- Contains production configuration
- Should be committed to version control (with sensitive data removed)
- Used by all environments

### `.env.local` (Local Development)
- Contains local development settings
- Should NOT be committed to version control
- Overrides `.env` values for local development

### `.env.development` (Development Environment)
- Development-specific settings
- Can be committed to version control

### `.env.production` (Production Environment)
- Production-specific settings
- Should NOT be committed to version control

## Environment Variables

### API Configuration
```bash
VITE_API_BASE_URL=http://localhost:3000
```

### Firebase Configuration (when ready)
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

### App Configuration
```bash
VITE_APP_NAME=Irvine Onnuri Choir
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### Development Features
```bash
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_MOCK_DATA=true
VITE_MOCK_DELAY=500
VITE_MOCK_ERROR_RATE=0.1
```

## Important Notes

1. **Vite Prefix**: All environment variables must start with `VITE_` to be accessible in the browser
2. **Restart Required**: Changes to `.env` files require restarting the development server
3. **Security**: Never commit sensitive data like API keys to version control
4. **Fallbacks**: The app has fallback values for all environment variables

## Usage in Code

```javascript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL
const debugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true'

// Check environment
if (import.meta.env.DEV) {
  console.log('Development mode')
}

if (import.meta.env.PROD) {
  console.log('Production mode')
}
```

## Firebase Setup (Future)

When you're ready to integrate Firebase:

1. Create a Firebase project
2. Get your configuration from Firebase Console
3. Update `.env.local` with your Firebase config
4. The services will automatically use Firebase instead of mock data

## Troubleshooting

### Environment variables not working?
- Make sure they start with `VITE_`
- Restart the development server
- Check the browser console for errors

### Mock data not working?
- Ensure `VITE_ENABLE_MOCK_DATA=true`
- Check `VITE_MOCK_DELAY` and `VITE_MOCK_ERROR_RATE` values
- Look for console logs from the API service

### Firebase integration issues?
- Verify all Firebase environment variables are set
- Check Firebase project configuration
- Ensure Firebase is enabled in your project











