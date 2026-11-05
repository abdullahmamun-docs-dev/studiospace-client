# StudioSpace

StudioSpace is a peer-to-peer creative studio booking platform where creators can discover, list, and book creative spaces such as photography studios, podcast rooms, music studios, sound stages, and art workshops.

## Live Project

- **Live Client:** https://studiospace-client-lemon.vercel.app
- **Client Repository:** https://github.com/abdullahmamun-docs-dev/studiospace-client
- **Server Repository:** https://github.com/abdullahmamun-docs-dev/studiospace-server

## Features

- User registration and login with email/password
- Google social authentication
- Secure authentication with Better Auth
- JWT-based authentication for protected API requests
- HTTP-only authentication cookies
- Browse available creative studios
- Search and filter studios by category
- View detailed studio information
- Create and manage studio listings
- Edit and delete owned studios
- Book studios with date, time, and guest information
- Automatic booking price and security deposit calculation
- Booking overlap prevention
- Booking status management
- Users can view and cancel their eligible bookings
- Hosts can confirm, reject, and complete bookings
- Dashboard with booking and studio statistics
- Responsive design for desktop, tablet, and mobile
- Loading and empty states
- Toast notifications
- Custom confirmation modals
- Custom 404 page
- Protected routes and protected API endpoints
- Host ownership and booking authorization checks

## Technology Stack

### Client

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Sonner

### Server

- Node.js
- Express.js
- MongoDB
- Better Auth
- JWT
- MongoDB Adapter
- CORS

## Project Structure

```text
StudioSpace
├── studiospace-client
│   ├── src
│   ├── public
│   ├── package.json
│   └── README.md
│
└── studiospace-server
    ├── routes
    ├── auth.js
    ├── server.js
    ├── db.js
    ├── package.json
    └── .env
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- MongoDB database

### Client Setup

Clone the client repository:

```bash
git clone https://github.com/abdullahmamun-docs-dev/studiospace-client.git
```

Go to the project directory:

```bash
cd studiospace-client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The client will run at:

```text
http://localhost:3000
```

### Server Setup

Clone the server repository:

```bash
git clone https://github.com/abdullahmamun-docs-dev/studiospace-server.git
```

Go to the server directory:

```bash
cd studiospace-server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

BETTER_AUTH_SECRET=your_better_auth_secret

BETTER_AUTH_URL=http://localhost:5000

CLIENT_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the development server:

```bash
npm run dev
```

The server will run at:

```text
http://localhost:5000
```

## Authentication

StudioSpace uses Better Auth for authentication.

Supported authentication methods:

- Email and password
- Google social login

Protected API operations require an authenticated user.

Authentication sessions are handled using secure HTTP-only cookies, while JWT functionality is used to protect API access where required.

## Booking System

Users can:

1. Select a studio
2. Choose a booking date
3. Select start and end times
4. Enter the number of guests
5. Review the booking price and security deposit
6. Submit the booking request
7. View their bookings
8. Cancel eligible bookings

The server validates:

- Authentication
- Studio availability
- Booking date
- Booking time
- Guest capacity
- Booking overlap
- Studio ownership and authorization
- Booking ownership and authorization

Only appropriate booking statuses can be cancelled or updated.

## Studio Management

Hosts can:

- Add a studio
- Edit studio information
- Delete their own studio
- Manage incoming booking requests
- Confirm bookings
- Reject bookings
- Complete bookings

Users cannot modify or delete another host's studio.

## Security

The application includes several security measures:

- Protected API endpoints
- JWT-based API authentication
- Better Auth session management
- HTTP-only authentication cookies
- Secure cookie configuration
- Server-side authorization checks
- Studio ownership verification
- Booking ownership verification
- Host authorization checks
- Booking overlap prevention
- MongoDB indexes for efficient queries
- CORS configuration
- Protected production authentication routes

## Production Build

To create a production build for the client:

```bash
npm run build
```

To start the production client:

```bash
npm run start
```

## Deployment

The client is deployed using Vercel.

The server is deployed using a Node.js-compatible hosting platform.

For production deployment:

1. Configure the required environment variables.
2. Configure the production client URL in the server CORS settings.
3. Configure the production URL in Better Auth trusted origins.
4. Configure Google OAuth production redirect URLs.
5. Build and deploy the client and server.

## Demo / Examiner Credentials

### Email/Password Login

```text
Email: YOUR_DEMO_EMAIL
Password: YOUR_DEMO_PASSWORD
```

> Replace `YOUR_DEMO_EMAIL` and `YOUR_DEMO_PASSWORD` with the actual demo account credentials before submitting the assignment.

### Google Login

Google login is also available from the login page.

## Author

**Abdullah Al Mamun**

StudioSpace — Creative studio discovery and booking platform.