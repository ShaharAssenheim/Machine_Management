# Client Setup - API Integration

## Overview
The client application now fetches data from the ASP.NET Core server API instead of using mock data.

## Configuration

### Environment Variables

Create a `.env.local` file in the Client directory (already created):

```env
VITE_API_URL=https://localhost:7123/api
```

**Important**: Update the port `7123` to match your actual server port. Check the server console output when running `dotnet run` to find the correct HTTPS port.

### API Service

The API service is located in `src/services/machineApi.ts` and provides:

- `getAll()` - Fetch all machines
- `getById(id)` - Fetch a specific machine by ID
- `getByName(name)` - Fetch a machine by name
- `getByStatus(status)` - Filter machines by status
- `getByLocation(country, city?)` - Filter machines by location

## How It Works

### Data Mapping

The server uses camelCase (e.g., `plcVersion`), while the client uses snake_case (e.g., `plc_version`). The API service automatically converts between these formats.

**Server Response:**
```json
{
  "id": 1,
  "name": "M15",
  "plcVersion": "Siemens S7-1500 FW 2.9",
  "acsVersion": "ACS SPiiPlus v2.40",
  "tubesNumber": 2,
  ...
}
```

**Client Machine Object:**
```typescript
{
  name: "M15",
  plc_version: "Siemens S7-1500 FW 2.9",
  acs_version: "ACS SPiiPlus v2.40",
  tubes_number: 2,
  ...
}
```

### Auto-Refresh

The application automatically refreshes data from the server every 30 seconds to show real-time updates.

## Running the Application

### 1. Start the Server

```powershell
cd Server\Server
dotnet run
```

Note the HTTPS port (e.g., `https://localhost:7123`)

### 2. Update .env.local

If your server runs on a different port, update `.env.local`:

```env
VITE_API_URL=https://localhost:YOUR_PORT/api
```

### 3. Start the Client

```powershell
cd Client
npm install  # First time only
npm run dev
```

The client will run on `http://localhost:5173`

## Features

### Loading States
- Shows a loading spinner while fetching data
- Displays error message if server is unreachable
- Provides retry button on connection errors

### Real-time Updates
- Data refreshes automatically every 30 seconds
- No page reload required to see updates

### Error Handling
- Connection errors are caught and displayed to the user
- Helpful error messages guide users to check if the server is running
- Retry functionality built-in

## Troubleshooting

### Issue: "Failed to load machines"

**Cause**: Cannot connect to the server

**Solutions**:
1. Make sure the server is running (`dotnet run` in Server/Server directory)
2. Check the server port matches your `.env.local` configuration
3. Verify CORS is configured correctly on the server (already done)
4. Check browser console for detailed error messages

### Issue: CORS Error

**Error**: "Access to fetch at 'https://localhost:7123/api/machines' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solution**: The server is already configured for CORS with localhost:5173, 3000, and 5174. If you use a different port, update `Program.cs` on the server:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:YOUR_PORT"  // Add your port here
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

### Issue: SSL Certificate Error

**Error**: "NET::ERR_CERT_AUTHORITY_INVALID"

**Solution**: 
1. In Chrome/Edge, click "Advanced" and "Proceed to localhost (unsafe)"
2. Or trust the development certificate:
   ```powershell
   dotnet dev-certs https --trust
   ```

### Issue: Data not updating

**Solution**: 
- The app auto-refreshes every 30 seconds
- Force refresh by clicking the "Retry Connection" button
- Or reload the page (F5)

## API Endpoints Used

The client uses these endpoints:

- `GET /api/machines` - Dashboard and machine list
- (Future) `POST /api/machines` - Create new machine
- (Future) `PUT /api/machines/{id}` - Update machine
- (Future) `DELETE /api/machines/{id}` - Delete machine

## Next Steps

To add create/update/delete functionality:

1. Add forms in the client UI
2. Call the appropriate API methods
3. Refresh the machine list after successful operations

Example:
```typescript
// In machineApi.ts, add:
async create(machine: CreateMachineDto): Promise<Machine> {
  const response = await fetch(`${API_BASE_URL}/machines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(machine),
  });
  if (!response.ok) throw new Error('Failed to create machine');
  const apiMachine = await response.json();
  return mapApiMachineToMachine(apiMachine);
}
```

## Development vs Production

### Development
- `.env.local` - Local API URL (https://localhost:7123/api)
- Auto-refresh enabled
- Detailed error messages

### Production
Create `.env.production`:
```env
VITE_API_URL=https://your-production-api.com/api
```

Build for production:
```powershell
npm run build
```

The build output will be in the `dist/` folder.
