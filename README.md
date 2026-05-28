# Woliba Registration Frontend

## App Overview

This project is a React-based registration flow for Woliba. It guides a user through company verification, user details, OTP verification, login credential setup, wellness interest selection, wellbeing pillar selection, registration completion, and a welcome screen.

The app includes a lightweight local Node.js backend in `backend/server.js`. The backend reads and writes mock data from `backend/db.json`, verifies company credentials, sends or logs OTP codes, and completes user registration.

Default registration route:

```bash
http://localhost:3000/registration
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the local backend API:

```bash
node server.js
```

The backend runs on:

```bash
http://localhost:5000
```

3. Start the React app in another terminal:

```bash
npm start
```

The frontend runs on:

```bash
http://localhost:3000
```

```

4. Optional environment configuration:

Frontend API settings can be configured in `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/v1
REACT_APP_JSON_SERVER_BASE_URL=http://localhost:5010
```



## Libraries/Tools Used

- React 19
- React DOM
- React Router DOM
- Redux Toolkit
- React Redux
- Axios
- Fetch API
- Node.js HTTP server
- Nodemailer
- Tailwind CSS
- PostCSS
- Autoprefixer
- Create React App / React Scripts
- React Testing Library
- Web Vitals

## Folder Structure

```text
frontend/
├── backend/
│   ├── db.json              # Mock database for companies, registrations, users, interests, and pillars
│   ├── server.js            # Local Node.js API server
│   └── .env                 # Backend environment variables
├── build/                   # Production build output
├── docs/
│   └── screenshots/         # App screenshots
├── public/
│   ├── index.html           # HTML template
│   ├── manifest.json        # Web app manifest
│   └── robots.txt
├── src/
│   ├── api/
│   │   └── apiClient.js     # API request helpers and base URL fallback logic
│   ├── assests/             # Images and media used by the app
│   ├── assets/              # Additional static assets
│   ├── components/          # Shared UI components
│   ├── pages/               # Registration flow screens
│   ├── redux/               # Redux store and registration slice
│   ├── routes/              # App route definitions
│   ├── services/            # API service functions
│   ├── styles/              # Additional style files
│   ├── utils/               # Validation helpers
│   ├── App.js               # Root app component
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and npm scripts
├── package-lock.json        # Locked dependency versions
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md
```

## Available Scripts

```bash
npm start
```

Runs the React development server.

```bash
npm run server
```

Runs the local backend API.

```bash
npm run build
```

Creates a production build in the `build/` folder.

```bash
npm test
```

Runs the test suite in watch mode.
