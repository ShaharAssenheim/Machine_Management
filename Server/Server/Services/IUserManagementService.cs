using Server.DTOs;

namespace Server.Services
{
    public interface IUserManagementService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserByAdminDto createDto);
        Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateDto);
        Task<bool> DeleteUserAsync(int id);
    }
}
