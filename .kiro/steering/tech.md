# Technology Stack

## Framework & Runtime
- **React Native**: 0.79.5 with React 19.0.0
- **Expo SDK**: ~53.0.17 with new architecture enabled
- **Expo Router**: ~5.1.3 for file-based routing with typed routes
- **TypeScript**: ~5.8.3 with strict mode enabled

## Key Dependencies
- **Navigation**: @react-navigation/native, @react-navigation/bottom-tabs
- **UI & Styling**: expo-blur, react-native-reanimated, expo-symbols
- **Device Features**: expo-haptics, expo-image, expo-font, expo-constants
- **Development**: ESLint with expo config, Babel core

## Build System
- **Metro Bundler**: For web builds with static output
- **Expo CLI**: Primary development and build tool

## Common Commands

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run ios          # iOS simulator
npm run android      # Android emulator  
npm run web          # Web browser

# Linting
npm run lint
```

### Project Management
```bash
# Install dependencies
npm install

# Reset project (moves starter code to app-example)
npm run reset-project
```

## Code Style & Linting
- ESLint with Expo configuration
- TypeScript strict mode enabled
- Path aliases configured (`@/*` maps to root)
- Automatic code formatting expected

## Platform Configuration
- iOS: Tablet support enabled, transparent tab bar with blur effect
- Android: Adaptive icons, edge-to-edge display
- Web: Metro bundler, static output, favicon support