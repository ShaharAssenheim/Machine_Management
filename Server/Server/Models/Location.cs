using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Location
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        // Navigation property
        public ICollection<Machine> Machines { get; set; } = new List<Machine>();
    }
}
