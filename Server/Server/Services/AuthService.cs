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
        private readonly IEmailValidationService _emailValidationService;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IEmailService emailService, IEmailValidationService emailValidationService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
            _emailValidationService = emailValidationService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Validate email domain
            if (!registerDto.Email.EndsWith("@rigaku.com", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Only Rigaku email addresses (@rigaku.com) are allowed.");
            }

            // Validate email is real/legal
            var isValidEmail = await _emailValidationService.IsValidEmailAsync(registerDto.Email);
            if (!isValidEmail)
            {
                throw new InvalidOperationException("The email address is not valid or does not exist.");
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

            // Send welcome email
            await SendWelcomeEmailAsync(user.Email, user.Username);

            // Generate JWT token
            var token = GenerateJwtToken(user.Email, user.Username, user.Id, user.IsAdmin);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                RequirePasswordChange = user.RequirePasswordChange,
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
                RequirePasswordChange = user.RequirePasswordChange,
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
                new Claim("IsAdmin", isAdmin.ToString()),
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
            try
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

                // Update user password and set flag to require password change
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);
                user.RequirePasswordChange = true;
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
                            <div style='background: white; padding: 20px; border-left: 4px solid #2596be; margin: 20px 0;'>
                                <p style='margin: 0;'><strong>Temporary Password:</strong></p>
                                <p style='margin: 10px 0 0 0; font-family: monospace; font-size: 18px; font-weight: bold;'>{tempPassword}</p>
                            </div>
                            <p><strong>Important:</strong> Please log in with this temporary password and change it immediately in your account settings.</p>
                            <p>If you didn't request this password reset, please contact your system administrator immediately.</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='http://localhost:3001' style='background: #2596be; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;'>Go to Login</a>
                            </div>
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>
                            <p style='color: #666; font-size: 12px;'>This is an automated message from the Machine Control System. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>";

                // This will throw an exception if email fails to send
                await _emailService.SendEmailAsync(user.Email, "Password Reset - Machine Control System", emailBody);

                return new ForgotPasswordResponseDto
                {
                    Message = "If an account with this email exists, a password reset has been sent."
                };
            }
            catch (Exception ex)
            {
                // Log the error but don't reveal details to the user for security
                throw new InvalidOperationException($"Failed to process password reset request: {ex.Message}", ex);
            }
        }

        public async Task<ChangePasswordResponseDto> ChangePasswordAsync(string userEmail, ChangePasswordDto changePasswordDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(userEmail);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found.");
            }

            // If current password is provided, verify it (for normal password changes)
            // If RequirePasswordChange is true, skip verification (user just logged in with temp password)
            if (!user.RequirePasswordChange && !string.IsNullOrEmpty(changePasswordDto.CurrentPassword))
            {
                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
                {
                    throw new UnauthorizedAccessException("Current password is incorrect.");
                }

                // Check if new password is different from current
                if (changePasswordDto.CurrentPassword == changePasswordDto.NewPassword)
                {
                    throw new InvalidOperationException("New password must be different from current password.");
                }
            }

            // Update password and clear the RequirePasswordChange flag
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            user.RequirePasswordChange = false;
            await _userRepository.UpdateAsync(user);

            return new ChangePasswordResponseDto
            {
                Message = "Password changed successfully."
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

        private async Task SendWelcomeEmailAsync(string email, string username)
        {
            var emailBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                        <div style='background: linear-gradient(135deg, #2596be 0%, #1d7a9e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                            <h1 style='color: white; margin: 0;'>Welcome to Machine Control System!</h1>
                        </div>
                        <div style='background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;'>
                            <h2 style='color: #2596be;'>Registration Successful</h2>
                            <p>Hello {username},</p>
                            <p>Congratulations! Your registration has been completed successfully.</p>
                            <div style='background: white; padding: 20px; border-left: 4px solid #2596be; margin: 20px 0;'>
                                <p style='margin: 0;'><strong>Your Account Details:</strong></p>
                                <p style='margin: 10px 0 0 0;'>Email: <strong>{email}</strong></p>
                                <p style='margin: 5px 0 0 0;'>Username: <strong>{username}</strong></p>
                            </div>
                            <p>You can now log in to the Machine Control System and start managing your machines.</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='http://localhost:3001' style='background: #2596be; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;'>Go to Dashboard</a>
                            </div>
                            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>
                            <p style='color: #666; font-size: 12px;'>This is an automated message from the Machine Control System. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await _emailService.SendEmailAsync(email, "Welcome to Machine Control System", emailBody);
        }
    }
}
