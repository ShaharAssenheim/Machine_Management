using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using Server.DTOs;
using Server.Models;
using Server.Repositories;
using BCrypt.Net;

namespace Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Validate email domain
            if (!registerDto.Email.EndsWith("@rigaku.com", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Only Rigaku email addresses (@rigaku.com) are allowed.");
            }

            // Check if user already exists
            if (await _userRepository.ExistsByEmailAsync(registerDto.Email))
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            // Extract username from email (everything before @) and capitalize each part
            var emailParts = registerDto.Email.Split('@')[0].Split('.');
            var capitalizedParts = emailParts.Select(part => 
                string.IsNullOrEmpty(part) ? part : char.ToUpper(part[0]) + part.Substring(1).ToLower()
            );
            var username = string.Join(" ", capitalizedParts);

            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Create new user
            var user = new User
            {
                Email = registerDto.Email.ToLower(),
                Username = username,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            // Generate JWT token
            var token = GenerateJwtToken(user.Email, user.Username, user.Id, user.IsAdmin);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Generate JWT token
            var token = GenerateJwtToken(user.Email, user.Username, user.Id, user.IsAdmin);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
        }

        public string GenerateJwtToken(string email, string username, int userId, bool isAdmin = false)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");
            var issuer = jwtSettings["Issuer"] ?? "MachineManagementAPI";
            var audience = jwtSettings["Audience"] ?? "MachineManagementClient";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, isAdmin ? "Admin" : "User"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                // Don't reveal if email exists or not for security
                return new ForgotPasswordResponseDto
                {
                    Message = "If an account with this email exists, a password reset has been sent."
                };
            }

            // Generate temporary password (8 characters: uppercase, lowercase, digits)
            var tempPassword = GenerateTemporaryPassword();

            // Update user password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);
            await _userRepository.UpdateAsync(user);

            // Send email with temporary password
            var emailBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                        <div style='background: linear-gradient(135deg, #2596be 0%, #1d7a9e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                            <h1 style='color: white; margin: 0;'>Machine Control System</h1>
                        </div>
                        <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;'>
                            <h2 style='color: #2596be;'>Password Reset</h2>
                            <p>Hello {user.Username},</p>
                            <p>You have requested to reset your password. Your temporary password is:</p>
                            <div style='background: white; padding: 15px; border-left: 4px solid #2596be; margin: 20px 0; font-family: monospace; font-size: 18px; font-weight: bold;'>
                                {tempPassword}
                            </div>
                            <p><strong>Important:</strong> Please log in with this temporary password and change it immediately in your account settings.</p>
                            <p>If you didn't request this password reset, please contact your system administrator immediately.</p>
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>
                            <p style='color: #666; font-size: 12px;'>This is an automated message from the Machine Control System. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await _emailService.SendEmailAsync(user.Email, "Password Reset - Machine Control System", emailBody);

            return new ForgotPasswordResponseDto
            {
                Message = "If an account with this email exists, a password reset has been sent."
            };
        }

        private string GenerateTemporaryPassword()
        {
            const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercase = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string all = uppercase + lowercase + digits;

            var random = new Random();
            var password = new char[12];

            // Ensure at least one of each required character type
            password[0] = uppercase[random.Next(uppercase.Length)];
            password[1] = lowercase[random.Next(lowercase.Length)];
            password[2] = digits[random.Next(digits.Length)];

            // Fill the rest randomly
            for (int i = 3; i < password.Length; i++)
            {
                password[i] = all[random.Next(all.Length)];
            }

            // Shuffle the password
            return new string(password.OrderBy(x => random.Next()).ToArray());
        }
    }
}
