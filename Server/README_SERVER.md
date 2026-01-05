# Machine Management Server - Setup Guide

## Overview
This server implementation uses ASP.NET Core 8.0 with Entity Framework Core and SQL Server to provide a RESTful API for managing industrial machines.

## Architecture & Best Practices Implemented

### 1. **Clean Architecture**
- **Models**: Entity models representing database tables
- **DTOs**: Data Transfer Objects for API request/response
- **Repositories**: Data access layer with abstraction
- **Services**: Business logic layer
- **Controllers**: API endpoints

### 2. **Entity Framework Core**
- Code-first approach with migrations
- Proper relationships (one-to-one, one-to-many)
- Indexes for performance optimization
- Enum to string conversion for readability
- Cascade delete for data integrity
- Automatic timestamp management

### 3. **Repository Pattern**
- Interface-based repository for testability
- Separation of data access from business logic
- Async/await for better performance

### 4. **Service Layer**
- Business logic encapsulation
- Input validation
- DTO mapping
- Error handling

### 5. **Security & Configuration**
- CORS configuration for client access
- Connection string externalization
- Environment-specific settings
- SQL retry logic for resilience

## Prerequisites

1. .NET 8.0 SDK
2. SQL Server (LocalDB, SQL Server Express, or full SQL Server)
3. Visual Studio 2022 or VS Code with C# extension

## Setup Instructions

### Step 1: Restore NuGet Packages

```powershell
cd Server\Server
dotnet restore
```

### Step 2: Update Connection String (if needed)

The default connection string uses SQL Server LocalDB. If you want to use a different SQL Server instance:

**appsettings.json** or **appsettings.Development.json**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=MachineManagementDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

For SQL Server with username/password:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=MachineManagementDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

### Step 3: Create and Apply Migrations

```powershell
# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

### Step 4: (Optional) Seed Database

To seed the database with sample data, update Program.cs to call the seeder:

Add this code in Program.cs after the migration code:
```csharp
try
{
    await DbSeeder.SeedAsync(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred while seeding the database.");
}
```

### Step 5: Run the Server

```powershell
dotnet run
```

The server will start on:
- HTTPS: https://localhost:7XXX
- HTTP: http://localhost:5XXX

(Check console output for exact ports)

## API Endpoints

### Machines

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

## Swagger Documentation

Access Swagger UI at: https://localhost:7XXX/swagger

## Database Schema

### Machines Table
- Id (PK, int)
- Name (nvarchar(100), indexed)
- Model (nvarchar(50))
- Image (nvarchar(500))
- Status (nvarchar(50), indexed)
- PlcVersion (nvarchar(100))
- AcsVersion (nvarchar(100))
- TubesNumber (int)
- Owner (nvarchar(200))
- TeamviewerName (nvarchar(200))
- CreatedAt (datetime2)
- UpdatedAt (datetime2, nullable)

### Locations Table
- Id (PK, int)
- Country (nvarchar(100))
- City (nvarchar(100))
- MachineId (FK, int)
- Composite index on (Country, City)

### Tubes Table
- Id (PK, int)
- TubeIndex (int)
- TubeType (nvarchar(50))
- PurgingConnected (bit)
- ShutterExists (bit)
- MachineId (FK, int)
- Composite index on (MachineId, TubeIndex)

## Connecting Client Application

The server is configured with CORS to allow requests from:
- http://localhost:5173 (Vite default)
- http://localhost:3000
- http://localhost:5174

Update the client's API base URL to point to the server (e.g., `https://localhost:7XXX/api`)

## Common Commands

```powershell
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Rollback to a specific migration
dotnet ef database update PreviousMigrationName

# Remove last migration (if not applied)
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script

# Drop database
dotnet ef database drop
```

## Troubleshooting

### Issue: Cannot connect to SQL Server
- Verify SQL Server is running
- Check connection string
- Ensure LocalDB is installed (comes with Visual Studio)

### Issue: Migration fails
- Check if database already exists
- Verify SQL Server permissions
- Try dropping and recreating the database

### Issue: CORS errors from client
- Verify client URL is in CORS policy in Program.cs
- Check that UseCors is called before MapControllers

## Production Considerations

1. **Connection Pooling**: Already enabled by default
2. **Logging**: Configure production logging (Application Insights, Serilog, etc.)
3. **Authentication**: Add JWT or OAuth authentication
4. **Rate Limiting**: Implement API rate limiting
5. **Caching**: Add Redis or in-memory caching
6. **Health Checks**: Implement health check endpoints
7. **Connection String**: Use Azure Key Vault or similar for secrets
8. **Migrations**: Use migration scripts in CI/CD pipelines

## License
MIT
