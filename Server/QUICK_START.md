# Quick Start Guide - Machine Management Server

## 🚀 Get Started in 3 Steps

### Step 1: Run the Server
```powershell
cd Server\Server
dotnet run
```

The server will:
- ✅ Automatically create the database
- ✅ Apply all migrations
- ✅ Seed sample data (M15, M16, M17)
- ✅ Start on HTTPS (check console for port)

### Step 2: Test the API

Open your browser and go to Swagger UI:
```
https://localhost:7XXX/swagger
```
(Replace 7XXX with the actual port shown in console)

Or use the VS Code REST Client with `api-tests.http`

### Step 3: Connect Your Client

Update your React client to use the API:

```typescript
const API_BASE_URL = 'https://localhost:7XXX/api';

// Example: Get all machines
const response = await fetch(`${API_BASE_URL}/machines`);
const machines = await response.json();
```

## 📊 Sample Data Available

After first run, you'll have 3 machines:
- **M15** - Onyx3200, Running, Israel (Migdal Haemek)
- **M16** - Onyx3000, Idle, Japan (Tokyo)
- **M17** - Onyx3200, Maintenance, Germany (Berlin)

## 🔧 Common Operations

### Get All Machines
```http
GET https://localhost:7XXX/api/machines
```

### Create a Machine
```http
POST https://localhost:7XXX/api/machines
Content-Type: application/json

{
  "name": "M18",
  "model": "Onyx3200",
  "status": "Running",
  "plcVersion": "Siemens S7-1500 FW 2.9",
  "acsVersion": "ACS SPiiPlus v2.40",
  "tubesNumber": 1,
  "tubes": [
    {
      "tubeIndex": 1,
      "tubeType": "MXR",
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

### Update Machine Status
```http
PATCH https://localhost:7XXX/api/machines/1
Content-Type: application/json

{
  "status": "Maintenance"
}
```

## 🗄️ Database

**Type**: SQL Server LocalDB  
**Name**: MachineManagementDb  
**Connection**: Automatic

To view data, use:
- Visual Studio: SQL Server Object Explorer
- Azure Data Studio
- SQL Server Management Studio (SSMS)

**Connection String**:
```
Server=(localdb)\mssqllocaldb;Database=MachineManagementDb;Trusted_Connection=true
```

## 📝 Important Notes

1. **CORS**: Configured for localhost:5173, 3000, 5174
2. **Enums**: Sent as strings ("Running", "Idle", etc.)
3. **Validation**: Name must be unique, tubes count must match
4. **Auto-migration**: Database updates automatically in development

## 🐛 Troubleshooting

**Problem**: Server won't start  
**Solution**: Check if port is in use, try `dotnet run --urls "https://localhost:5001"`

**Problem**: Cannot connect to database  
**Solution**: Ensure SQL Server LocalDB is installed (comes with Visual Studio)

**Problem**: CORS errors  
**Solution**: Add your client URL to CORS policy in Program.cs

## 📚 Full Documentation

- See [README_SERVER.md](README_SERVER.md) for complete documentation
- See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture details
- Use [api-tests.http](api-tests.http) for API testing

## ✨ Features

✅ RESTful API  
✅ Entity Framework Core  
✅ SQL Server  
✅ Auto migrations  
✅ Sample data  
✅ Swagger UI  
✅ CORS enabled  
✅ Input validation  
✅ Error handling  
✅ Logging  

Enjoy! 🎉
