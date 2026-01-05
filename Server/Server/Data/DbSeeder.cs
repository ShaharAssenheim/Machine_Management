using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Check if database already has data
            if (await context.Machines.AnyAsync())
            {
                return; // Database already seeded
            }

            // Seed Locations first - comprehensive database of major cities
            var locations = new List<Location>
            {
                // Israel
                new Location { Country = "Israel", City = "Migdal Haemek", Latitude = 32.6744, Longitude = 35.2397 },
                new Location { Country = "Israel", City = "Tel Aviv", Latitude = 32.0853, Longitude = 34.7818 },
                
                // Asia Pacific
                new Location { Country = "Japan", City = "Tokyo", Latitude = 35.6762, Longitude = 139.6503 },
                new Location { Country = "China", City = "Shanghai", Latitude = 31.2304, Longitude = 121.4737 },
                new Location { Country = "Singapore", City = "Singapore", Latitude = 1.3521, Longitude = 103.8198 },
                new Location { Country = "South Korea", City = "Seoul", Latitude = 37.5665, Longitude = 126.9780 },
                new Location { Country = "Australia", City = "Sydney", Latitude = -33.8688, Longitude = 151.2093 },
                new Location { Country = "China", City = "Beijing", Latitude = 39.9042, Longitude = 116.4074 },
                new Location { Country = "China", City = "Hong Kong", Latitude = 22.3193, Longitude = 114.1694 },
                new Location { Country = "Thailand", City = "Bangkok", Latitude = 13.7563, Longitude = 100.5018 },
                new Location { Country = "India", City = "Mumbai", Latitude = 19.0760, Longitude = 72.8777 },
                new Location { Country = "Australia", City = "Melbourne", Latitude = -37.8136, Longitude = 144.9631 },
                
                // Europe
                new Location { Country = "UK", City = "London", Latitude = 51.5074, Longitude = -0.1278 },
                new Location { Country = "Germany", City = "Munich", Latitude = 48.1351, Longitude = 11.5820 },
                new Location { Country = "Germany", City = "Berlin", Latitude = 52.5200, Longitude = 13.4050 },
                new Location { Country = "France", City = "Paris", Latitude = 48.8566, Longitude = 2.3522 },
                new Location { Country = "Netherlands", City = "Amsterdam", Latitude = 52.3676, Longitude = 4.9041 },
                new Location { Country = "Sweden", City = "Stockholm", Latitude = 59.3293, Longitude = 18.0686 },
                new Location { Country = "Spain", City = "Madrid", Latitude = 40.4168, Longitude = -3.7038 },
                new Location { Country = "Italy", City = "Rome", Latitude = 41.9028, Longitude = 12.4964 },
                new Location { Country = "Austria", City = "Vienna", Latitude = 48.2082, Longitude = 16.3738 },
                new Location { Country = "Switzerland", City = "Zurich", Latitude = 47.3769, Longitude = 8.5417 },
                
                // Americas
                new Location { Country = "USA", City = "Austin", Latitude = 30.2672, Longitude = -97.7431 },
                new Location { Country = "USA", City = "New York", Latitude = 40.7128, Longitude = -74.0060 },
                new Location { Country = "USA", City = "San Francisco", Latitude = 37.7749, Longitude = -122.4194 },
                new Location { Country = "USA", City = "Chicago", Latitude = 41.8781, Longitude = -87.6298 },
                new Location { Country = "Canada", City = "Toronto", Latitude = 43.6532, Longitude = -79.3832 },
                new Location { Country = "Canada", City = "Vancouver", Latitude = 49.2827, Longitude = -123.1207 },
                new Location { Country = "Brazil", City = "São Paulo", Latitude = -23.5505, Longitude = -46.6333 },
                new Location { Country = "Mexico", City = "Mexico City", Latitude = 19.4326, Longitude = -99.1332 },
                new Location { Country = "Argentina", City = "Buenos Aires", Latitude = -34.6037, Longitude = -58.3816 },
                new Location { Country = "USA", City = "Los Angeles", Latitude = 34.0522, Longitude = -118.2437 },
                
                // Middle East & Africa
                new Location { Country = "UAE", City = "Dubai", Latitude = 25.2048, Longitude = 55.2708 },
                new Location { Country = "Egypt", City = "Cairo", Latitude = 30.0444, Longitude = 31.2357 },
                new Location { Country = "South Africa", City = "Johannesburg", Latitude = -26.2041, Longitude = 28.0473 },
                new Location { Country = "Turkey", City = "Istanbul", Latitude = 41.0082, Longitude = 28.9784 }
            };

            context.Locations.AddRange(locations);
            await context.SaveChangesAsync();

            // Now seed machines with location references
            var israelLocation = await context.Locations.FirstAsync(l => l.Country == "Israel" && l.City == "Migdal Haemek");
            var tokyoLocation = await context.Locations.FirstAsync(l => l.Country == "Japan" && l.City == "Tokyo");
            var berlinLocation = await context.Locations.FirstAsync(l => l.Country == "Germany" && l.City == "Berlin");

            var machines = new List<Machine>
            {
                new Machine
                {
                    Name = "M15",
                    Model = ModelType.Onyx3200,
                    Status = MachineStatus.Running,
                    PlcVersion = "Siemens S7-1500 FW 2.9",
                    AcsVersion = "ACS SPiiPlus v2.40",
                    TubesNumber = 2,
                    Owner = "Shahar Assenheim",
                    TeamviewerName = "XRM5000-RIG-01",
                    LocationId = israelLocation.Id,
                    Tubes = new List<Tube>
                    {
                        new Tube
                        {
                            TubeIndex = 1,
                            TubeType = TubeType.MXR,
                            PurgingConnected = true,
                            ShutterExists = true
                        },
                        new Tube
                        {
                            TubeIndex = 2,
                            TubeType = TubeType.ColorsTW,
                            PurgingConnected = true,
                            ShutterExists = true
                        }
                    }
                },
                new Machine
                {
                    Name = "M16",
                    Model = ModelType.Onyx3000,
                    Status = MachineStatus.Idle,
                    PlcVersion = "Siemens S7-1200 FW 2.7",
                    AcsVersion = "ACS SPiiPlus v2.35",
                    TubesNumber = 1,
                    Owner = "Dana Cohen",
                    TeamviewerName = "ONYX3000-IL-02",
                    LocationId = tokyoLocation.Id,
                    Tubes = new List<Tube>
                    {
                        new Tube
                        {
                            TubeIndex = 1,
                            TubeType = TubeType.Petrick,
                            PurgingConnected = false,
                            ShutterExists = true
                        }
                    }
                },
                new Machine
                {
                    Name = "M17",
                    Model = ModelType.Onyx3200,
                    Status = MachineStatus.Maintenance,
                    PlcVersion = "Siemens S7-1500 FW 2.9",
                    AcsVersion = "ACS SPiiPlus v2.40",
                    TubesNumber = 2,
                    Owner = "Alex Green",
                    TeamviewerName = "ONYX3200-DE-01",
                    LocationId = berlinLocation.Id,
                    Tubes = new List<Tube>
                    {
                        new Tube
                        {
                            TubeIndex = 1,
                            TubeType = TubeType.ColorsTAu,
                            PurgingConnected = true,
                            ShutterExists = false
                        },
                        new Tube
                        {
                            TubeIndex = 2,
                            TubeType = TubeType.ColorsTMo,
                            PurgingConnected = false,
                            ShutterExists = true
                        }
                    }
                }
            };

            context.Machines.AddRange(machines);
            await context.SaveChangesAsync();
        }
    }
}
