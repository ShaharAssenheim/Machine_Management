# Machine Management System

A comprehensive production machine management system with real-time monitoring, global fleet visualization, and enterprise-grade authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Quick Start](#quick-start)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Authentication System](#authentication-system)
  - [Password Reset Flow](#password-reset-flow)
  - [Email Verification](#email-verification)
- [Admin User Management](#admin-user-management)
- [API Documentation](#api-documentation)
- [Global Fleet Map](#global-fleet-map)
- [Database](#database)
- [Code Quality & Optimizations](#code-quality--optimizations)
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
- **Strong Password Requirements**: Enterprise-grade password policies with real-time validation
- **Email Domain Validation**: Only @rigaku.com email addresses allowed
- **Email Verification**: Verification emails sent upon registration with 24-hour token expiry
- **Password Reset**: Secure temporary password generation with forced password change
- **Protected API Endpoints**: All machine data endpoints require authentication
- **Role-Based Access Control**: Admin and user roles with granular permissions
- **Admin User Management**: Full CRUD operations for user management (admin only)

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
- SOLID principles implementation
- Dependency injection throughout
- Comprehensive error handling

---

## Architecture

### Backend Architecture

The server follows **Clean Architecture** and **SOLID principles**:

#### Layers

1. **Controllers** (API Layer)
   - Handle HTTP requests/responses
   - Input validation
   - Route definition
   - No business logic

2. **Services** (Business Logic Layer)
   - `IAuthService` / `AuthService`: Authentication, registration, password management
   - `IMachineService` / `MachineService`: Machine operations
   - `IUserManagementService` / `UserManagementService`: User CRUD operations
   - `IEmailService` / `EmailService`: Email sending functionality
   - Business rules and validation

3. **Repositories** (Data Access Layer)
   - `IUserRepository` / `UserRepository`: User data access
   - `IMachineRepository` / `MachineRepository`: Machine data access
   - `ILocationRepository` / `LocationRepository`: Location data access
   - EF Core abstraction

4. **Models** (Domain Layer)
   - `User`: User entity with authentication properties
   - `Machine`: Machine entity with status tracking
   - `Location`: Geographic data for machines
   - `Tube`: Machine component details

5. **DTOs** (Data Transfer Layer)
   - Request/Response models
   - Data validation attributes
   - API contracts

### SOLID Principles Applied

#### Single Responsibility Principle (SRP)
- Each class has one reason to change
- Controllers handle HTTP, Services handle business logic, Repositories handle data
- Configuration methods extracted into focused functions

#### Open/Closed Principle (OCP)
- Services use interfaces for easy extension
- New features can be added without modifying existing code

#### Liskov Substitution Principle (LSP)
- All interface implementations follow contracts
- Repositories can be swapped with different implementations

#### Interface Segregation Principle (ISP)
- Focused interfaces (`IMachineRepository`, `IUserRepository`, etc.)
- Clients depend only on methods they use

#### Dependency Inversion Principle (DIP)
- Controllers depend on abstractions (interfaces)
- Dependencies injected via constructor
- All services registered in DI container

### Frontend Architecture

**Component-Based Architecture** with React:

- **Components**: Reusable UI components (Login, Register, MapView, etc.)
- **Context Providers**: Global state management (AuthContext, ThemeContext)
- **Services**: API communication layer (machineApi.ts)
- **Types**: TypeScript definitions for type safety
- **Hooks**: Custom hooks for logic reuse

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
- **Email Validation**: Only @rigaku.com addresses accepted with real email verification
- **Username Extraction**: Automatic from email (e.g., `shahar.assenheim@rigaku.com` → `Shahar Assenheim`)
- **Protected Routes**: All machine endpoints require valid JWT token
- **Token Expiration**: 24-hour token lifetime
- **Admin Support**: IsAdmin flag for role-based access
- **Email Verification**: Automatic verification emails with 24-hour token expiry
- **Password Reset**: Secure temporary password with forced change on first login

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

**Real-time Validation**: Password requirements are validated in real-time with visual feedback (check marks/X marks) as users type.

### Authentication Flow

#### Registration
1. User enters @rigaku.com email and strong password
2. Client validates format and requirements with real-time feedback
3. POST to `/api/auth/register`
4. Server validates email domain (@rigaku.com)
5. Server checks email validity using email validation service
6. Server hashes password using BCrypt
7. Server creates user and generates JWT
8. **Server sends welcome email automatically**
9. Client stores token in localStorage
10. User is logged in and redirected to dashboard

#### Login
1. User enters email and password
2. POST to `/api/auth/login`
3. Server verifies credentials
4. Server generates JWT token with user claims
5. Server updates last login timestamp
6. Client stores token and user data
7. **If RequirePasswordChange flag is set, redirect to password change page**
8. Otherwise, redirect to dashboard

#### Protected API Access
1. Client includes token in Authorization header: `Bearer {token}`
2. Server validates token signature and expiration
3. Server extracts user claims (email, username, ID, role)
4. Server processes request if valid
5. Returns 401 Unauthorized if invalid/expired

---

### Password Reset Flow

Complete password reset implementation with forced password change:

#### Requesting Password Reset

1. User clicks "Forgot Password" on login page
2. User enters registered email address
3. POST to `/api/auth/forgot-password`
4. Server validates email exists in system
5. Server generates secure temporary password (12 characters)
6. Server sets `RequirePasswordChange = true` flag
7. Server updates user's password hash with temporary password
8. **Server sends password reset email with temporary password**
9. User receives beautifully formatted email with:
   - Temporary password clearly displayed
   - Instructions to log in and change password
   - Security warning if request was not made by them
   - 24-hour validity notice

#### Logging in with Temporary Password

1. User logs in with email and temporary password
2. Server authenticates successfully
3. Server returns JWT with `requirePasswordChange: true` flag
4. **Client detects flag and redirects to Change Password page** (not dashboard)
5. User sees dedicated password change screen (full page, not modal)

#### Changing Password

1. User sees "Change Password Required" page
2. User enters new password (with real-time validation)
3. User confirms new password (visual match indicator)
4. POST to `/api/auth/change-password` (no current password needed)
5. Server validates new password meets requirements
6. Server hashes new password
7. Server sets `RequirePasswordChange = false`
8. Server updates user record
9. **Client automatically redirects to main dashboard**

**Security Features:**
- Temporary passwords are immediately hashed (never stored plain text)
- User cannot access main app until password is changed
- New password must meet all strength requirements
- Real-time validation prevents weak passwords
- No email in query string (uses Authorization header)

---

### Email Verification

Comprehensive email verification system to ensure valid user registrations:

#### Verification Flow

1. **During Registration**:
   - User registers with @rigaku.com email
   - System generates unique verification token (GUID)
   - Token expiry set to 24 hours
   - User account created with `EmailVerified = false`
   - **Welcome email sent automatically with verification link**

2. **Email Content**:
   - Professional HTML design matching system branding
   - Clear "Verify Email Address" button
   - Clickable verification link: `https://your-domain/api/auth/verify-email?token={token}`
   - 24-hour expiration notice
   - Instructions for users who didn't register

3. **Verification Process**:
   - User clicks verification link in email
   - GET to `/api/auth/verify-email?token={token}`
   - Server validates token exists and hasn't expired
   - Server sets `EmailVerified = true`
   - Server clears verification token
   - User sees success HTML page

**Email Configuration** (appsettings.json):
```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@rigaku.com",
    "FromName": "Machine Control System"
  }
}
```

**Note**: If SMTP not configured, emails are logged to console (development mode).

---

## Admin User Management

Comprehensive user management system for administrators:

### Features

- **View All Users**: Complete user list with details
- **Create Users**: Admin can create user accounts
- **Edit Users**: Modify user information, passwords, roles
- **Delete Users**: Remove user accounts (cannot delete self)
- **Role Management**: Assign/remove admin privileges
- **Email Verification Control**: Manually verify user emails

### Admin Panel UI

**User Table Columns**:
- ID
- Username (with admin badge)
- Email
- Verification Status (verified/unverified badges)
- Creation Date
- Last Login Date
- Actions (Edit/Delete buttons)

**Create User Modal**:
- Email (required, validated)
- Username (required)
- Password (required, min 8 characters)
- Admin checkbox
- Email Verified checkbox (default: true)

**Edit User Modal**:
- Email (optional, must be unique)
- Username (optional)
- Password (optional, leave blank to keep current)
- Admin checkbox
- Email Verified checkbox

### Security

- All endpoints require authentication (`[Authorize]`)
- All endpoints require admin privileges
- Returns `403 Forbidden` for non-admin users
- Prevents admins from deleting their own account
- Email uniqueness enforced
- Passwords automatically hashed using BCrypt

### Admin API Endpoints

#### Get All Users
```
GET /api/users
Authorization: Bearer {admin-token}
```

#### Get User by ID
```
GET /api/users/{id}
Authorization: Bearer {admin-token}
```

#### Create User
```
POST /api/users
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "email": "newuser@rigaku.com",
  "username": "New User",
  "password": "SecurePass123",
  "isAdmin": false,
  "emailVerified": true
}
```

#### Update User
```
PUT /api/users/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "email": "updated@rigaku.com",
  "username": "Updated Name",
  "password": "NewPassword123",  // Optional
  "isAdmin": true,
  "emailVerified": true
}
```

**Note**: All fields optional in update. Only provided fields are updated.

#### Delete User
```
DELETE /api/users/{id}
Authorization: Bearer {admin-token}
```

**Response**: 204 No Content (success)

**Error**: 400 Bad Request if trying to delete self

---

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
  "username": "User",
  "email": "user@rigaku.com",
  "isAdmin": false,
  "requirePasswordChange": false,
  "expiresAt": "2026-01-07T12:00:00Z"
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
  "username": "User",
  "email": "user@rigaku.com",
  "isAdmin": false,
  "requirePasswordChange": false,
  "expiresAt": "2026-01-07T12:00:00Z"
}
```

**POST /api/auth/forgot-password**
```json
Request:
{
  "email": "user@rigaku.com"
}

Response:
{
  "message": "If an account with this email exists, a password reset has been sent."
}
```

**POST /api/auth/change-password**
```json
Request:
Authorization: Bearer {token}
{
  "newPassword": "NewSecurePass123!"
}

Response:
{
  "message": "Password changed successfully."
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

## Code Quality & Optimizations

### Clean Code Principles

The codebase follows industry best practices and clean code principles:

#### 1. **SOLID Principles**
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Services use interfaces for easy extension
- **Liskov Substitution**: Interface implementations follow contracts
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: Controllers depend on abstractions

#### 2. **Meaningful Names**
- Clear method names: `GetMachineById`, `RegisterAsync`, `ConfigureDatabase`
- Descriptive variable names: `authData`, `userData`, `machines`
- Self-documenting code

#### 3. **Small, Focused Functions**
- Program.cs refactored from monolithic to modular
- Each function does one thing well
- Easy to test and maintain

#### 4. **Consistent Error Handling**
- Proper exception types (`InvalidOperationException`, `UnauthorizedAccessException`)
- Meaningful error messages
- Consistent error response format

#### 5. **DRY (Don't Repeat Yourself)**
- Removed duplicate error handling
- Reusable helper functions
- Shared validation logic

### Performance Optimizations

#### Server Optimizations

1. **Async/Await Throughout**
   - All database operations are async
   - Non-blocking I/O operations
   - Better scalability

2. **Database Optimizations**
   - Connection pooling (EF Core default)
   - Retry logic for transient failures
   - Proper indexes on frequently queried columns
   - Efficient queries with EF Core

3. **Streamlined Controllers**
   - Removed try-catch blocks (handled by middleware)
   - Comprehensive Swagger documentation
   - Integer constraints on route parameters
   - Reduced code duplication

#### Client Optimizations

1. **Reduced Logging Overhead**
   - Removed 22+ console.log statements
   - Production-ready code
   - Better performance

2. **Cleaner Service Layer**
   - Removed excessive logging from API services
   - Simplified error handling
   - Better code maintainability

3. **Optimized Component Rendering**
   - Proper React hooks usage
   - Memoization where needed
   - Efficient state updates

### Security Enhancements

1. **Credentials Protection**
   - Comprehensive .gitignore
   - No sensitive data in source control
   - Environment-based configuration

2. **Input Validation**
   - DTO validation attributes
   - ModelState validation in controllers
   - Client-side validation with real-time feedback

3. **Best Practices**
   - HTTPS redirection
   - CORS properly configured
   - Proper HTTP status codes
   - JWT with secure secret keys

### Code Organization

#### Program.cs Refactoring

Before: 130 lines with mixed concerns
After: 180 lines, well-organized with focused methods:

- `ConfigureServices()` - Service registration
- `ConfigureDatabase()` - Database configuration
- `RegisterRepositories()` - Repository DI
- `RegisterServices()` - Service DI
- `ConfigureAuthentication()` - JWT auth setup
- `ConfigureCors()` - CORS policy
- `ConfigureSwagger()` - API documentation
- `ConfigureMiddleware()` - HTTP pipeline
- `InitializeDatabaseAsync()` - Database initialization

#### Controllers Enhancement

- Removed repetitive try-catch blocks
- Added comprehensive `ProducesResponseType` attributes
- Consistent error response format
- Improved logging with context
- Better API documentation

### Quality Metrics

**Before Optimizations:**
- Mixed concerns in configuration
- Repetitive error handling
- Excessive console logging
- Less maintainable code

**After Optimizations:**
- Clean, focused functions
- Consistent patterns
- Production-ready
- Highly maintainable
- Better performance
- Comprehensive documentation

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
