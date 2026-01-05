using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ApplicationDbContext _context;

        public LocationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Location>> GetAllAsync()
        {
            return await _context.Locations
                .OrderBy(l => l.Country)
                .ThenBy(l => l.City)
                .ToListAsync();
        }

        public async Task<Location?> GetByIdAsync(int id)
        {
            return await _context.Locations.FindAsync(id);
        }

        public async Task<Location?> GetByCountryAndCityAsync(string country, string city)
        {
            return await _context.Locations
                .FirstOrDefaultAsync(l => l.Country == country && l.City == city);
        }

        public async Task<Location> CreateAsync(Location location)
        {
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();
            return location;
        }

        public async Task<bool> ExistsAsync(string country, string city)
        {
            return await _context.Locations
                .AnyAsync(l => l.Country == country && l.City == city);
        }
    }
}
