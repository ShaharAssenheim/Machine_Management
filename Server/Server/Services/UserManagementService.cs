using Server.DTOs;
using Server.Models;
using Server.Repositories;

namespace Server.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly IUserRepository _userRepository;

        public UserManagementService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToDto);
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user != null ? MapToDto(user) : null;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserByAdminDto createDto)
        {
            // Check if user already exists
            if (await _userRepository.ExistsByEmailAsync(createDto.Email))
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password);

            var user = new User
            {
                Email = createDto.Email.ToLower(),
                Username = createDto.Username,
                PasswordHash = passwordHash,
                IsAdmin = createDto.IsAdmin,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);
            return MapToDto(user);
        }

        public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            // Update email if provided and different
            if (!string.IsNullOrWhiteSpace(updateDto.Email) && updateDto.Email != user.Email)
            {
                if (await _userRepository.ExistsByEmailAsync(updateDto.Email))
                {
                    throw new InvalidOperationException("A user with this email already exists.");
                }
                user.Email = updateDto.Email.ToLower();
            }

            // Update username if provided
            if (!string.IsNullOrWhiteSpace(updateDto.Username))
            {
                user.Username = updateDto.Username;
            }

            // Update password if provided
            if (!string.IsNullOrWhiteSpace(updateDto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);
            }

            // Update admin status if provided
            if (updateDto.IsAdmin.HasValue)
            {
                user.IsAdmin = updateDto.IsAdmin.Value;
            }

            await _userRepository.UpdateAsync(user);
            return MapToDto(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteAsync(id);
            return true;
        }

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            };
        }
    }
}