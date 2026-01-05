using Server.Models;

namespace Server.Repositories
{
    public interface IMachineRepository
    {
        Task<IEnumerable<Machine>> GetAllAsync();
        Task<Machine?> GetByIdAsync(int id);
        Task<Machine?> GetByNameAsync(string name);
        Task<IEnumerable<Machine>> GetByStatusAsync(MachineStatus status);
        Task<IEnumerable<Machine>> GetByLocationAsync(string country, string? city = null);
        Task<Machine> CreateAsync(Machine machine);
        Task<Machine> UpdateAsync(Machine machine);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    }
}
