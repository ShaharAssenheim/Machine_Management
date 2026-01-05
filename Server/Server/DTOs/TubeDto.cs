using Server.Models;

namespace Server.DTOs
{
    public class TubeDto
    {
        public int TubeIndex { get; set; }
        public TubeType TubeType { get; set; }
        public bool PurgingConnected { get; set; }
        public bool ShutterExists { get; set; }
    }
}
