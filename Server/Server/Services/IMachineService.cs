using Server.DTOs;
using Server.Models;

namespace Server.Services
{
    public interface IMachineService
    {
        Task<IEnumerable<MachineDto>> GetAllMachinesAsync();
        Task<MachineDto?> GetMachineByIdAsync(int id);
        Task<MachineDto?> GetMachineByNameAsync(string name);
        Task<IEnumerable<MachineDto>> GetMachinesByStatusAsync(MachineStatus status);
        Task<IEnumerable<MachineDto>> GetMachinesByLocationAsync(string country, string? city = null);
        Task<MachineDto> CreateMachineAsync(CreateMachineDto createDto);
        Task<MachineDto?> UpdateMachineAsync(int id, UpdateMachineDto updateDto);
        Task<bool> DeleteMachineAsync(int id);
    }
}
