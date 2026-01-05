# Machine Management System - Authentication Guide

## Overview
This system implements a comprehensive JWT-based authentication system with enterprise-grade security features, specifically designed for Rigaku employees.

## Features Implemented

### Security Best Practices
- **JWT Token Authentication**: Industry-standard JSON Web Tokens for stateless authentication
- **BCrypt Password Hashing**: Automatic salting and secure password storage
- **Strong Password Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (@$!%*?&)
- **Email Domain Validation**: Only @rigaku.com email addresses are allowed
- **Protected API Endpoints**: All machine data endpoints require authentication

### Email Validation & Username Extraction
- **Pattern**: Only emails ending with `@rigaku.com` are accepted
- **Username Extraction**: Username is automatically extracted from email
  - Example: `shahar.assenheim@rigaku.com` → username: `shahar.assenheim`

## Server-Side Components

### Models
- **User.cs**: User entity with Email, Username, PasswordHash, CreatedAt, LastLoginAt

### DTOs
- **RegisterDto**: Email and Password validation
- **LoginDto**: Email and Password for authentication
- **AuthResponseDto**: Token, Username, Email, ExpiresAt

### Repositories
- **IUserRepository**: User data access interface
- **UserRepository**: User data access implementation with email/username lookups

### Services
- **IAuthService**: Authentication service interface
- **AuthService**: Core authentication logic
  - User registration with email validation and password hashing
  - User login with password verification
  - JWT token generation with 24-hour expiration

### Controllers
- **AuthController**: Authentication API endpoints
  - `POST /api/auth/register`: Register new user
  - `POST /api/auth/login`: Login existing user

### Database
- **Users Table**: Stores user credentials
  - Unique constraint on Email
  - Index on Username
  - PasswordHash stored securely with BCrypt

### Configuration
- **JWT Settings** (appsettings.json):
  ```json
  "JwtSettings": {
    "SecretKey": "YourVerySecureSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "MachineManagementAPI",
    "Audience": "MachineManagementClient",
    "ExpirationHours": 24
  }
  ```

- **CORS**: Configured to allow requests from client (localhost:3000)

## Client-Side Components

### Context
- **AuthContext**: Global authentication state management
  - `login(credentials)`: Authenticate user and store token
  - `register(credentials)`: Register new user
  - `logout()`: Clear authentication state
  - `isAuthenticated`: Boolean indicating auth status
  - `user`: Current user information
  - `token`: JWT token for API requests

### Components
- **Login.tsx**: Modern login form
  - Email and password inputs
  - Error display
  - Loading states
  - Switch to register button
  - Dark mode support

- **Register.tsx**: Modern registration form
  - Email validation with @rigaku.com requirement
  - Password requirements checklist with visual feedback
  - Password confirmation
  - Real-time validation
  - Dark mode support

### Services
- **machineApi.ts**: Updated to include Authorization header
  - All API requests include `Bearer ${token}` header
  - Token retrieved from localStorage

### App Integration
- **App.tsx**: Authentication flow
  - Shows Login/Register when not authenticated
  - Shows Dashboard when authenticated
  - Logout button with username display

## Authentication Flow

### Registration
1. User enters email (@rigaku.com) and strong password
2. Client validates email pattern and password requirements
3. Client sends POST to `/api/auth/register`
4. Server validates credentials
5. Server hashes password with BCrypt
6. Server saves user to database
7. Server generates JWT token
8. Client receives token and user data
9. Client stores token in localStorage
10. User is automatically logged in

### Login
1. User enters email and password
2. Client sends POST to `/api/auth/login`
3. Server finds user by email
4. Server verifies password with BCrypt
5. Server updates LastLoginAt timestamp
6. Server generates JWT token
7. Client receives token and user data
8. Client stores token in localStorage
9. User can access protected routes

### Protected API Access
1. Client retrieves token from localStorage
2. Client includes token in Authorization header: `Bearer ${token}`
3. Server validates token signature and expiration
4. Server extracts user claims from token
5. Server processes request if token is valid
6. Server returns 401 Unauthorized if token is invalid/missing

### Logout
1. User clicks logout button
2. Client clears token from localStorage
3. Client redirects to login page
4. Protected routes become inaccessible

## API Endpoints

### Authentication
- **POST /api/auth/register**
  - Body: `{ "email": "user@rigaku.com", "password": "SecurePass123!" }`
  - Response: `{ "token": "...", "username": "user", "email": "user@rigaku.com", "expiresAt": "..." }`

- **POST /api/auth/login**
  - Body: `{ "email": "user@rigaku.com", "password": "SecurePass123!" }`
  - Response: `{ "token": "...", "username": "user", "email": "user@rigaku.com", "expiresAt": "..." }`

### Machines (Protected)
All machine endpoints require `Authorization: Bearer {token}` header:
- GET /api/machines
- GET /api/machines/{id}
- GET /api/machines/by-name/{name}
- GET /api/machines/by-status/{status}
- GET /api/machines/by-location?country={country}&city={city}

## Testing the System

### 1. Start the Server
```bash
cd Server/Server
dotnet run --project Server.csproj
```
Server will run on: http://localhost:5001

### 2. Start the Client
```bash
cd Client
npm run dev
```
Client will run on: http://localhost:3000

### 3. Register a New User
1. Open http://localhost:3000
2. Click "Create Account"
3. Enter email: `yourname@rigaku.com`
4. Enter a strong password (e.g., `SecurePass123!`)
5. Confirm password
6. Click "Create Account"

### 4. Login
1. Enter your @rigaku.com email
2. Enter your password
3. Click "Sign In"
4. You'll see the machine dashboard

### 5. Access Protected Data
- All machine data is now protected
- Token is automatically included in all API requests
- Logout to test protection (you'll be redirected to login)

## Security Considerations

### Password Security
- Passwords are never stored in plain text
- BCrypt handles automatic salting
- Minimum password complexity enforced

### Token Security
- Tokens expire after 24 hours
- Tokens are validated on every request
- Tokens are signed with a secret key

### Email Validation
- Only Rigaku employees can register (@rigaku.com)
- Email uniqueness enforced at database level

### HTTPS (Production)
- For production, use HTTPS to encrypt token transmission
- Update CORS to allow only production domain
- Store JWT secret in environment variables, not appsettings.json

## Future Enhancements

### Recommended Additions
1. **Password Reset**: Email-based password recovery
2. **Refresh Tokens**: Long-lived refresh tokens for seamless re-authentication
3. **Role-Based Authorization**: Admin, Manager, User roles
4. **Multi-Factor Authentication**: Additional security layer
5. **Session Management**: Track active sessions, allow remote logout
6. **Rate Limiting**: Prevent brute force attacks
7. **Email Verification**: Confirm email ownership before account activation
8. **Audit Logging**: Track authentication events

## Troubleshooting

### "Failed to fetch machines"
- Ensure server is running on port 5001
- Check that token is present in localStorage
- Verify token hasn't expired (24 hours)

### "401 Unauthorized"
- Token may be expired - logout and login again
- Token may be invalid - clear localStorage and login
- Server authentication may not be configured correctly

### "Email must be @rigaku.com"
- Only Rigaku email addresses are allowed
- Check for typos in email domain

### "Password does not meet requirements"
- Ensure password has at least 8 characters
- Include uppercase, lowercase, digit, and special character

## Files Modified/Created

### Server
- Server/Models/User.cs
- Server/DTOs/AuthDtos.cs
- Server/Repositories/IUserRepository.cs
- Server/Repositories/UserRepository.cs
- Server/Services/IAuthService.cs
- Server/Services/AuthService.cs
- Server/Controllers/AuthController.cs
- Server/Data/ApplicationDbContext.cs (Users DbSet added)
- Server/Program.cs (JWT authentication configured)
- Server/Controllers/MachinesController.cs ([Authorize] added)

### Client
- Client/src/context/AuthContext.tsx
- Client/src/components/Login.tsx
- Client/src/components/Register.tsx
- Client/src/services/machineApi.ts (Authorization header added)
- Client/src/App.tsx (Authentication flow integrated)

### Database Migration
- Server/Migrations/[timestamp]_AddAuthentication.cs
