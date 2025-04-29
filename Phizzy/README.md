# Phizzy - Health Tracking App

Phizzy is a React Native mobile application built with Expo that helps users track their fitness progress through exercise videos and personalized workout programs.

## Features

- **User Authentication**: Secure login system with parent code verification
- **Personalized Workout Programs**: Dynamic week-based exercise programs
- **Exercise Video Recording**: Record and upload exercise videos for form checking
- **Video Library**: View and manage recorded exercise videos
- **Progress Tracking**: Track completion of exercises and weekly progress
- **Avatar Selection**: Customize user profile with avatar selection
- **Modern UI**: User-friendly interface with consistent styling

## Technical Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase
  - Authentication
  - Storage (for video uploads)
  - Firestore (for program data)
- **Routing**: Expo Router with file-based routing
- **Styling**: React Native StyleSheet with custom theme support

## Project Structure

- `/app`: Main application screens and navigation
  - `/(tabs)`: Tab-based navigation screens
  - `/exercise`: Dynamic exercise pages
  - `/week`: Dynamic week pages
- `/firebase`: Firebase integration
  - `program.ts`: Program data management
  - `videos.ts`: Video upload and management
  - `avatars.ts`: Avatar management
- `/components`: Reusable UI components
- `/constants`: Application constants
- `/hooks`: Custom React hooks
- `/assets`: Static assets (images, fonts)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Firebase:
   - Create a Firebase project
   - Update `firebaseConfig.js` with your Firebase credentials
   - Enable Authentication, Storage, and Firestore in your Firebase console

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - iOS Simulator
   - Android Emulator
   - Physical device using Expo Go

## Key Features Implementation

### Exercise Program Management
- Dynamic week and exercise pages
- Progress tracking for each week
- Exercise details with sets and descriptions

### Video Recording and Management
- Video recording using device camera
- Upload to Firebase Storage with progress tracking
- Video playback and management interface
- Exercise-specific video organization

### User Interface
- Modern design with orange accent color (#FF6B6B)
- Responsive design for various screen sizes
- Loading states and error handling
- Smooth navigation between screens

## Development

The application uses a file-based routing system with Expo Router. Key files include:

- `app/_layout.tsx`: Root layout and theme provider
- `app/(tabs)/_layout.tsx`: Tab navigation configuration
- `app/exercise/[exerciseName].tsx`: Dynamic exercise pages
- `app/week/[weekNumber].tsx`: Dynamic week pages
- `app/play.tsx`: Video recording interface
- `app/upload-complete.tsx`: Upload confirmation screen

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
