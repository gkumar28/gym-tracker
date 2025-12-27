# Gym Tracker Mobile (Expo + TypeScript)

This folder contains a scaffolded Expo TypeScript app that works with the Spring Boot backend.

Prereqs:
- Node.js & npm
- Expo CLI (optional) / Expo Go app for device testing
- Backend (Spring Boot) running at `http://localhost:8080` or set `app.json` extra.API_URL

Quick start:
```bash
cd ui/mobile
npm install
npm run start
```

Platform targets:
- Android emulator: `npm run android`
- iOS simulator (macOS): `npm run ios`
- Web: `npm run web`

Configuration:
- The app will use the value from `app.json` -> `expo.extra.API_URL` for backend base URL. Change it to your backend host for device testing.
	- Android emulator (Android Studio): use `http://10.0.2.2:8080` as API base.
	- Real device (same LAN): use `http://<your-host-ip>:8080` and set `expo.extra.API_URL`.
	- Expo Tunnel: expo's dev server can be run with tunnel to enable real device testing.

Development notes:
- React Native Paper is used for UI components.
- TanStack Query (React Query) + Axios are used for API calls and caching.
- The `SetTable` component implements the tabular sets + rest row behavior you specified.
