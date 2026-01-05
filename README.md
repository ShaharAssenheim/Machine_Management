# Machine Management System

A comprehensive production machine management system with real-time monitoring, global fleet visualization, and enterprise-grade authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Quick Start](#quick-start)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Authentication System](#authentication-system)
- [API Documentation](#api-documentation)
- [Global Fleet Map](#global-fleet-map)
- [Database](#database)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

ProMMS (Production Machine Management System) is a professional, modern dashboard for managing manufacturing production lines with real-time status monitoring, machine diagnostics, intelligent analytics, and secure authentication for Rigaku employees.

## Features

### 🔐 Security & Authentication
- **JWT Token Authentication**: Industry-standard JSON Web Tokens for stateless authentication
- **BCrypt Password Hashing**: Automatic salting and secure password storage
- **Strong Password Requirements**: Enterprise-grade password policies
- **Email Domain Validation**: Only @rigaku.com email addresses allowed
- **Protected API Endpoints**: All machine data endpoints require authentication
- **Role-Based Access**: Admin and user roles

### 📊 Machine Management
- **Real-time Machine Monitoring**: Live status updates for all production units
- **Performance Analytics**: Efficiency tracking and trend analysis
- **AI Diagnostics**: Intelligent machine health analysis
- **CRUD Operations**: Full create, read, update, delete functionality
- **Advanced Filtering**: By status, location, name, and more

### 🗺️ Global Fleet Visualization
- **Interactive World Map**: Full-featured map with smooth pan/zoom
- **Smart Markers**: Status-based color coding with animations
- **Clustering**: Automatic grouping for better performance
- **Real-time Search**: Instant filtering by name, location, or status
- **Machine Popups**: Detailed information with rich UI

### 🎨 User Experience
- **Dark/Light Theme**: Beautiful UI that adapts to user preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Fast & Modern**: Built with React 19, TypeScript, and Vite
- **Professional UI**: Glassmorphic panels, smooth animations, premium design

---

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4, Custom CSS Variables
- **Charts**: Recharts
- **Icons**: Lucide React
- **Maps**: MapLibre GL JS (open-source, no API key required)
- **Animation**: Framer Motion
- **Build Tool**: Vite

### Backend
- **Framework**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core
- **Database**: SQL Server (LocalDB for development)
- **Authentication**: JWT with BCrypt
- **API**: RESTful with Swagger/OpenAPI

### Architecture
- Clean Architecture pattern
- Repository pattern for data access
- Service layer for business logic
- DTO pattern for API contracts

---

## Project Structure

```
Machine_Management/
├── Client/                      # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Login.tsx       # Login form
│   │   │   ├── Register.tsx    # Registration form
│   │   │   ├── MapView.tsx     # Global fleet map
│   │   │   ├── MachinePopup.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.tsx # Authentication state
│   │   │   └── ThemeContext.tsx
│   │   ├── services/           # API services
│   │   │   ├── machineApi.ts   # Machine API client
│   │   │   └── geolocationService.ts
│   │   ├── styles/             # Global styles
│   │   ├── App.tsx             # Main app component
│   │   └── types.ts            # TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── Server/                      # ASP.NET Core backend
    └── Server/
        ├── Controllers/        # API endpoints
        │   ├── AuthController.cs
        │   └── MachinesController.cs
        ├── Models/             # Entity models
        │   ├── User.cs
        │   ├── Machine.cs
        │   ├── Location.cs
        │   └── Tube.cs
        ├── DTOs/               # Data transfer objects
        ├── Repositories/       # Data access layer
        ├── Services/           # Business logic
        ├── Data/               # EF Core context
        ├── Migrations/         # Database migrations
        ├── Program.cs          # Application entry point
        └── appsettings.json    # Configuration
```

---

## Getting Started

### Quick Start

#### 1. Start the Server

```powershell
cd Server\Server
dotnet run
```

The server will:
- ✅ Automatically create the database
- ✅ Apply all migrations
- ✅ Seed sample data (M15, M16, M17)
- ✅ Start on HTTPS (check console for port, typically https://localhost:7123)

#### 2. Start the Client

```powershell
cd Client
npm install  # First time only
npm run dev
```

The client will run on http://localhost:5173

#### 3. Register and Login

1. Open http://localhost:5173
2. Click "Create Account"
3. Enter email: `yourname@rigaku.com`
4. Enter a strong password (min 8 chars, uppercase, lowercase, digit, special char)
5. Click "Create Account"
6. You'll be automatically logged in

---

### Server Setup

#### Prerequisites
- .NET 8.0 SDK
- SQL Server (LocalDB, SQL Server Express, or full SQL Server)
- Visual Studio 2022 or VS Code with C# extension

#### Configuration

**Connection String** (if needed, update in `appsettings.json`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MachineManagementDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

**JWT Settings** (in `appsettings.json`):

```json
{
  "JwtSettings": {
    "SecretKey": "YourVerySecureSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "MachineManagementAPI",
    "Audience": "MachineManagementClient",
    "ExpirationHours": 24
  }
}
```

#### Database Setup

```powershell
cd Server\Server

# Create migration (if needed)
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update

# Run the server
dotnet run
```

#### Access Swagger UI

Navigate to: `https://localhost:7123/swagger` (replace port with actual port from console)

---

### Client Setup

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Environment Configuration

Create `.env.local` in the Client directory:

```env
VITE_API_URL=https://localhost:7123/api
```

**Important**: Update the port to match your server port.

#### Installation

```powershell
cd Client
npm install
npm run dev
```

#### Build for Production

```powershell
npm run build
```

The production build will be in the `dist` directory.

---

## Authentication System

### Features

- **JWT Token Authentication**: Secure, stateless authentication
- **Password Security**: BCrypt hashing with automatic salting
- **Email Validation**: Only @rigaku.com addresses accepted
- **Username Extraction**: Automatic from email (e.g., `shahar.assenheim@rigaku.com` → `shahar.assenheim`)
- **Protected Routes**: All machine endpoints require valid JWT token
- **Token Expiration**: 24-hour token lifetime
- **Admin Support**: IsAdmin flag for role-based access

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (@$!%*?&)

### Authentication Flow

#### Registration
1. User enters @rigaku.com email and strong password
2. Client validates format and requirements
3. POST to `/api/auth/register`
4. Server validates and hashes password
5. Server creates user and generates JWT
6. Client stores token in localStorage
7. User is logged in

#### Login
1. User enters email and password
2. POST to `/api/auth/login`
3. Server verifies credentials
4. Server generates JWT token
5. Client stores token and updates state

#### Protected API Access
1. Client includes token in Authorization header: `Bearer {token}`
2. Server validates token signature and expiration
3. Server processes request if valid
4. Returns 401 Unauthorized if invalid

### API Endpoints

#### Authentication

**POST /api/auth/register**
```json
Request:
{
  "email": "user@rigaku.com",
  "password": "SecurePass123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "user",
  "email": "user@rigaku.com",
  "expiresAt": "2026-01-06T12:00:00Z"
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@rigaku.com",
  "password": "SecurePass123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "user",
  "email": "user@rigaku.com",
  "expiresAt": "2026-01-06T12:00:00Z"
}
```

---

## API Documentation

### Machines (Protected)

All machine endpoints require `Authorization: Bearer {token}` header.

#### GET /api/machines
Get all machines

#### GET /api/machines/{id}
Get a specific machine by ID

#### GET /api/machines/by-name/{name}
Get a machine by name

#### GET /api/machines/by-status/{status}
Get machines by status (Running, Idle, Maintenance, Error)

#### GET /api/machines/by-location?country={country}&city={city}
Get machines by location

#### POST /api/machines
Create a new machine

**Request Body:**
```json
{
  "name": "M18",
  "model": "Onyx3200",
  "image": "/ONYX-3000.png",
  "status": "Running",
  "plcVersion": "Siemens S7-1500 FW 2.9",
  "acsVersion": "ACS SPiiPlus v2.40",
  "tubesNumber": 2,
  "tubes": [
    {
      "tubeIndex": 1,
      "tubeType": "MXR",
      "purgingConnected": true,
      "shutterExists": true
    },
    {
      "tubeIndex": 2,
      "tubeType": "ColorsTW",
      "purgingConnected": true,
      "shutterExists": true
    }
  ],
  "owner": "John Doe",
  "teamviewerName": "ONYX-TEST-01",
  "location": {
    "country": "USA",
    "city": "New York"
  }
}
```

#### PUT /api/machines/{id}
Update a machine (full update)

#### PATCH /api/machines/{id}
Partially update a machine

#### DELETE /api/machines/{id}
Delete a machine

---

## Global Fleet Map

### Features

- 🗺️ **Interactive Map**: MapLibre GL JS with OpenStreetMap tiles (no API key required)
- 📍 **Smart Markers**: Status-based color coding, animated pulse effects
- 🔍 **Clustering**: Automatic grouping, cluster counts
- 🎯 **Filtering & Search**: Real-time search, status filters, live stats
- 💬 **Machine Popups**: Rich detail modal with smooth animations
- 🎨 **Premium UI**: Glassmorphic panels, theme-aware design

### Color Coding

- 🟢 **Green** (#10B981): Running
- 🟡 **Yellow** (#EAB308): Idle
- 🔵 **Blue** (#3B82F6): Maintenance
- 🔴 **Red** (#EF4444): Error

### Map Controls

| Action         | Method                        |
|----------------|-------------------------------|
| Pan            | Click + Drag                  |
| Zoom In        | Mouse wheel up OR `+` button  |
| Zoom Out       | Mouse wheel down OR `-` button|
| Reset View     | Click reset button            |
| Search         | Type in search bar            |
| Filter         | Click "Filters" button        |

### Global Machine Distribution

- **Asia Pacific**: Tokyo, Shanghai, Singapore, Seoul, Sydney
- **Americas**: Austin, São Paulo
- **Europe**: Munich, London

### Adding New Locations

In `src/services/geolocationService.ts`:

```typescript
const CITY_COORDINATES: Record<string, CityCoordinates> = {
  // ... existing cities
  'Paris': { lat: 48.8566, lng: 2.3522 },
};
```

---

## Database

### Schema

#### Users Table
- Id (PK)
- Email (Unique, Indexed)
- Username (Indexed)
- PasswordHash
- IsAdmin
- CreatedAt
- LastLoginAt

#### Machines Table
- Id (PK)
- Name (Unique, Indexed)
- Model
- Image
- Status (Indexed)
- PlcVersion
- AcsVersion
- TubesNumber
- Owner
- TeamviewerName
- CreatedAt
- UpdatedAt

#### Locations Table (1:1 with Machine)
- Id (PK)
- Country (Indexed)
- City (Indexed)
- MachineId (FK)

#### Tubes Table (N:1 with Machine)
- Id (PK)
- TubeIndex (Indexed)
- TubeType
- PurgingConnected
- ShutterExists
- MachineId (FK)

### Connection String

**Development (LocalDB):**
```
Server=(localdb)\mssqllocaldb;Database=MachineManagementDb;Trusted_Connection=true
```

**SQL Server:**
```
Server=YOUR_SERVER;Database=MachineManagementDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;MultipleActiveResultSets=true;TrustServerCertificate=true
```

### Common EF Core Commands

```powershell
# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Rollback
dotnet ef database update PreviousMigrationName

# Remove last migration
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script

# Drop database
dotnet ef database drop
```

---

## Development

### Client Development

```powershell
cd Client
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

### Server Development

```powershell
cd Server\Server
dotnet run           # Run server
dotnet watch         # Run with hot reload
dotnet test          # Run tests
dotnet build         # Build project
```

### Testing API

Use the provided `Server/Server/api-tests.http` file with VS Code REST Client extension, or access Swagger UI at `https://localhost:7123/swagger`.

### Sample Data

After first run, you'll have 3 sample machines:
- **M15** - Onyx3200, Running, Israel (Migdal Haemek)
- **M16** - Onyx3000, Idle, Japan (Tokyo)
- **M17** - Onyx3200, Maintenance, Germany (Berlin)

---

## Production Deployment

### Security Checklist

- [ ] Use HTTPS only
- [ ] Store JWT secret in environment variables or Azure Key Vault
- [ ] Update CORS to allow only production domain
- [ ] Enable rate limiting
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Set up audit logging
- [ ] Configure production logging (Application Insights, Serilog)
- [ ] Enable HSTS
- [ ] Configure CSP headers

### Performance Optimization

- [ ] Enable response compression
- [ ] Add Redis caching
- [ ] Configure connection pooling
- [ ] Set up CDN for static assets
- [ ] Implement API rate limiting
- [ ] Add health check endpoints
- [ ] Configure database indexes

### Client Production Build

```powershell
cd Client
npm run build
```

Deploy the `dist/` folder to:
- Azure Static Web Apps
- Netlify
- Vercel
- AWS S3 + CloudFront

Create `.env.production`:
```env
VITE_API_URL=https://your-api.example.com/api
```

### Server Deployment

Deploy to:
- Azure App Service
- AWS Elastic Beanstalk
- Docker containers
- IIS

Update `appsettings.Production.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_PRODUCTION_CONNECTION_STRING"
  },
  "JwtSettings": {
    "SecretKey": "USE_ENVIRONMENT_VARIABLE_OR_KEY_VAULT"
  }
}
```

---

## Troubleshooting

### Authentication Issues

**Problem**: "Failed to fetch machines" or "401 Unauthorized"
- Ensure server is running
- Check token in localStorage
- Verify token hasn't expired (24 hours)
- Clear localStorage and login again

**Problem**: "Email must be @rigaku.com"
- Only Rigaku email addresses are allowed
- Check for typos in email domain

**Problem**: "Password does not meet requirements"
- Minimum 8 characters
- Include uppercase, lowercase, digit, and special character

### Connection Issues

**Problem**: Cannot connect to server
- Make sure server is running (`dotnet run`)
- Check server port matches client `.env.local`
- Verify CORS is configured correctly

**Problem**: CORS errors
- Server is configured for localhost:5173, 3000, 5174
- Add your port in `Server/Server/Program.cs` if different

**Problem**: SSL Certificate error
- Click "Advanced" → "Proceed to localhost" in browser
- Or run: `dotnet dev-certs https --trust`

### Database Issues

**Problem**: Cannot connect to SQL Server
- Verify SQL Server is running
- Check connection string
- Ensure LocalDB is installed (comes with Visual Studio)

**Problem**: Migration fails
- Check if database already exists
- Verify SQL Server permissions
- Try dropping and recreating: `dotnet ef database drop`

### Map Issues

**Problem**: Map not loading
- Check browser console for errors
- Ensure MapLibre GL JS CSS is imported
- Verify internet connection (for tile loading)

**Problem**: Markers not appearing
- Check if machines have coordinates
- Verify geolocationService has city mappings
- Check browser console for errors

---

## Future Enhancements

### Authentication
- [ ] Password reset via email
- [ ] Refresh tokens
- [ ] Multi-factor authentication
- [ ] Email verification
- [ ] Session management
- [ ] Rate limiting for login attempts
- [ ] Audit logging

### Features
- [ ] Real-time updates (SignalR)
- [ ] Machine comparison view
- [ ] Performance trends and analytics
- [ ] Export data (CSV, PDF)
- [ ] Custom dashboards
- [ ] Notification system
- [ ] Mobile app

### Map Enhancements
- [ ] Heat map overlay
- [ ] Region-based filtering
- [ ] Route planning between machines
- [ ] Historical location tracking
- [ ] Custom map layers
- [ ] Geofencing
- [ ] Performance by region

---

## License

This project is private and proprietary.

---

## Support

For issues or questions:
1. Check this README
2. Review troubleshooting section
3. Check server logs
4. Check browser console
5. Contact the development team

---

**Built with ❤️ for Rigaku**
