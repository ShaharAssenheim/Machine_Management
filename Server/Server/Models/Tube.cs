using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Tube
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TubeIndex { get; set; }

        [Required]
        public TubeType TubeType { get; set; }

        public bool PurgingConnected { get; set; }

        public bool ShutterExists { get; set; }

        // Navigation property
        public int MachineId { get; set; }
        public Machine Machine { get; set; } = null!;
    }
}
