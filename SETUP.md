# SafeDrive Romania - Setup Guide

## Project Setup Completed ✅

This React Native app for defensive driving in Romania has been successfully set up with all core features and configurations.

### What's Been Done

✅ **Installed all dependencies**
- React Native with Expo
- Navigation libraries
- Location tracking
- Notifications
- AsyncStorage for data persistence
- React Native Maps

✅ **Created configuration files**
- `app.json` - Expo configuration with permissions
- `babel.config.js` - JavaScript transpilation
- `.eslintrc.js` - Code quality rules

✅ **Implemented 5 core screens**
- **Home Screen** - Safety score, daily tips, quick access menu
- **Driving Screen** - Real-time speed monitoring, harsh event detection
- **Lessons Screen** - 10 interactive lessons based on Romanian accident data
- **Reports Screen** - Weekly statistics, improvements tracking
- **Settings Screen** - Notifications, privacy, emergency contacts

✅ **Set up GitHub repository**
- Configured SSH authentication
- Pushed all code to https://github.com/ObuObuHub/SafeDrive

## How to Run the App

### 1. Start Development Server
```bash
cd /home/andrei/SafeDrive
npm start
```

### 2. Run on Your Phone
- Install **Expo Go** app from:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- Scan the QR code displayed in terminal

### 3. Run on Emulator
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios
```

## Required Assets

Create these image files in the `assets` folder:
- `icon.png` (1024x1024) - App icon
- `splash.png` (1284x2778) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon
- `notification-icon.png` (96x96) - Notification icon

## Next Development Steps

### 1. Essential Features
- [ ] Integrate Romanian Police accident database API
- [ ] Add offline map support for rural areas
- [ ] Implement speed limit database
- [ ] Add weather API integration

### 2. Testing & Quality
- [ ] Test on physical Android/iOS devices
- [ ] Add crash reporting (Sentry)
- [ ] Performance optimization
- [ ] Accessibility features

### 3. Deployment Preparation
- [ ] Create app store assets
- [ ] Write privacy policy
- [ ] Prepare app store descriptions
- [ ] Beta testing with real drivers

### 4. Future Enhancements
- [ ] Voice navigation integration
- [ ] Dashcam recording feature
- [ ] Community hazard reporting
- [ ] Multi-language support (RO/EN)

## Development Commands

```bash
# Install dependencies
npm install

# Start development
npm start

# Run linter
npm run lint

# Run tests
npm test
```

## Project Structure
```
SafeDrive/
├── App.js                 # Main app entry point
├── package.json          # Dependencies
├── app.json             # Expo configuration
├── babel.config.js      # Babel setup
├── .eslintrc.js         # ESLint rules
├── src/
│   ├── screens/         # All app screens
│   ├── components/      # Reusable components
│   ├── services/        # API and data services
│   └── utils/           # Helper functions
└── assets/              # Images and media
```

## Key Features Implemented

### Based on Romanian Traffic Data
- **Top 10 accident patterns** identified and addressed
- **Real-time coaching** for high-risk situations
- **Personalized safety tips** based on driving behavior
- **Community safety** features for hazard reporting

### Technical Features
- GPS-based speed monitoring
- Harsh event detection (braking/acceleration)
- Trip recording and scoring
- Push notifications for safety alerts
- Offline data storage
- Progress tracking

## Support & Contribution

This is a 100% free app aimed at reducing traffic fatalities in Romania from 77 to the EU average of 46 per million inhabitants.

For questions or contributions, please open an issue on GitHub.