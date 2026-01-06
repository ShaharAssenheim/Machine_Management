using System.Net;
using System.Net.Mail;

namespace Server.Services
{
    public interface IEmailValidationService
    {
        Task<bool> IsValidEmailAsync(string email);
    }

    public class EmailValidationService : IEmailValidationService
    {
        private readonly ILogger<EmailValidationService> _logger;

        public EmailValidationService(ILogger<EmailValidationService> logger)
        {
            _logger = logger;
        }

        public async Task<bool> IsValidEmailAsync(string email)
        {
            try
            {
                // Basic format validation
                var addr = new MailAddress(email);
                if (addr.Address != email)
                {
                    return false;
                }

                // Extract domain from email
                var domain = email.Split('@')[1];

                // Check for common invalid domains
                var invalidDomains = new[] { "test.com", "example.com", "localhost" };
                if (invalidDomains.Contains(domain.ToLower()))
                {
                    return false;
                }

                // For development: accept rigaku.com emails
                // In production, you could add DNS MX record validation here
                if (domain.ToLower() == "rigaku.com")
                {
                    return true;
                }

                // Validate DNS MX records exist for the domain
                try
                {
                    var hostEntry = await Dns.GetHostEntryAsync(domain);
                    return hostEntry.AddressList.Length > 0;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"DNS validation failed for {domain}: {ex.Message}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Email validation error: {ex.Message}");
                return false;
            }
        }
    }
}
