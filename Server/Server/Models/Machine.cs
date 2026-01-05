using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Machine
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public ModelType Model { get; set; }

        [Required]
        public MachineStatus Status { get; set; }

        [Required]
        [MaxLength(100)]
        public string PlcVersion { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string AcsVersion { get; set; } = string.Empty;

        [Required]
        public int TubesNumber { get; set; }

        [Required]
        [MaxLength(200)]
        public string Owner { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string TeamviewerName { get; set; } = string.Empty;

        // Foreign key to Location
        [Required]
        public int LocationId { get; set; }

        // Navigation properties
        public Location Location { get; set; } = null!;
        public ICollection<Tube> Tubes { get; set; } = new List<Tube>();

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
