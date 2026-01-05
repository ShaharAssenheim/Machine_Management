using Server.Models;

namespace Server.Repositories
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Location>> GetAllAsync();
        Task<Location?> GetByIdAsync(int id);
        Task<Location?> GetByCountryAndCityAsync(string country, string city);
        Task<Location> CreateAsync(Location location);
        Task<bool> ExistsAsync(string country, string city);
    }
}
