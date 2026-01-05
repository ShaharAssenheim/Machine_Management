using Server.DTOs;
using Server.Models;
using Server.Repositories;

namespace Server.Services
{
    public class MachineService : IMachineService
    {
        private readonly IMachineRepository _machineRepository;
        private readonly ILocationRepository _locationRepository;

        public MachineService(IMachineRepository machineRepository, ILocationRepository locationRepository)
        {
            _machineRepository = machineRepository;
            _locationRepository = locationRepository;
        }

        public async Task<IEnumerable<MachineDto>> GetAllMachinesAsync()
        {
            var machines = await _machineRepository.GetAllAsync();
            return machines.Select(MapToDto);
        }

        public async Task<MachineDto?> GetMachineByIdAsync(int id)
        {
            var machine = await _machineRepository.GetByIdAsync(id);
            return machine != null ? MapToDto(machine) : null;
        }

        public async Task<MachineDto?> GetMachineByNameAsync(string name)
        {
            var machine = await _machineRepository.GetByNameAsync(name);
            return machine != null ? MapToDto(machine) : null;
        }

        public async Task<IEnumerable<MachineDto>> GetMachinesByStatusAsync(MachineStatus status)
        {
            var machines = await _machineRepository.GetByStatusAsync(status);
            return machines.Select(MapToDto);
        }

        public async Task<IEnumerable<MachineDto>> GetMachinesByLocationAsync(string country, string? city = null)
        {
            var machines = await _machineRepository.GetByLocationAsync(country, city);
            return machines.Select(MapToDto);
        }

        public async Task<MachineDto> CreateMachineAsync(CreateMachineDto createDto)
        {
            // Validate that name doesn't already exist
            if (await _machineRepository.ExistsByNameAsync(createDto.Name))
            {
                throw new InvalidOperationException($"A machine with the name '{createDto.Name}' already exists.");
            }

            // Validate tubes count matches tubes number
            if (createDto.Tubes.Count != createDto.TubesNumber)
            {
                throw new InvalidOperationException("The number of tubes must match the tubes_number value.");
            }

            // Get or create location
            var location = await _locationRepository.GetByCountryAndCityAsync(
                createDto.Location.Country, 
                createDto.Location.City);

            if (location == null)
            {
                // Create new location with coordinates from DTO
                location = await _locationRepository.CreateAsync(new Location
                {
                    Country = createDto.Location.Country,
                    City = createDto.Location.City,
                    Latitude = createDto.Location.Latitude,
                    Longitude = createDto.Location.Longitude
                });
            }

            var machine = new Machine
            {
                Name = createDto.Name,
                Model = createDto.Model,
                Status = createDto.Status,
                PlcVersion = createDto.PlcVersion,
                AcsVersion = createDto.AcsVersion,
                TubesNumber = createDto.TubesNumber,
                Owner = createDto.Owner,
                TeamviewerName = createDto.TeamviewerName,
                LocationId = location.Id,
                Tubes = createDto.Tubes.Select(t => new Tube
                {
                    TubeIndex = t.TubeIndex,
                    TubeType = t.TubeType,
                    PurgingConnected = t.PurgingConnected,
                    ShutterExists = t.ShutterExists
                }).ToList()
            };

            var createdMachine = await _machineRepository.CreateAsync(machine);
            return MapToDto(createdMachine);
        }

        public async Task<MachineDto?> UpdateMachineAsync(int id, UpdateMachineDto updateDto)
        {
            var machine = await _machineRepository.GetByIdAsync(id);
            if (machine == null)
            {
                return null;
            }

            // Check if name is being changed and if it conflicts
            if (updateDto.Name != null && updateDto.Name != machine.Name)
            {
                if (await _machineRepository.ExistsByNameAsync(updateDto.Name, id))
                {
                    throw new InvalidOperationException($"A machine with the name '{updateDto.Name}' already exists.");
                }
                machine.Name = updateDto.Name;
            }

            // Update properties if provided
            if (updateDto.Model.HasValue)
                machine.Model = updateDto.Model.Value;

            if (updateDto.Status.HasValue)
                machine.Status = updateDto.Status.Value;

            if (updateDto.PlcVersion != null)
                machine.PlcVersion = updateDto.PlcVersion;

            if (updateDto.AcsVersion != null)
                machine.AcsVersion = updateDto.AcsVersion;

            if (updateDto.Owner != null)
                machine.Owner = updateDto.Owner;

            if (updateDto.TeamviewerName != null)
                machine.TeamviewerName = updateDto.TeamviewerName;

            if (updateDto.TubesNumber.HasValue)
                machine.TubesNumber = updateDto.TubesNumber.Value;

            // Update location if provided
            if (updateDto.Location != null)
            {
                var location = await _locationRepository.GetByCountryAndCityAsync(
                    updateDto.Location.Country, 
                    updateDto.Location.City);

                if (location == null)
                {
                    // Create new location with coordinates from DTO
                    location = await _locationRepository.CreateAsync(new Location
                    {
                        Country = updateDto.Location.Country,
                        City = updateDto.Location.City,
                        Latitude = updateDto.Location.Latitude,
                        Longitude = updateDto.Location.Longitude
                    });
                }

                machine.LocationId = location.Id;
            }

            // Update tubes if provided
            if (updateDto.Tubes != null)
            {
                // Validate tubes count matches tubes number
                var tubesNumber = updateDto.TubesNumber ?? machine.TubesNumber;
                if (updateDto.Tubes.Count != tubesNumber)
                {
                    throw new InvalidOperationException("The number of tubes must match the tubes_number value.");
                }

                // Remove old tubes and add new ones
                machine.Tubes.Clear();
                machine.Tubes = updateDto.Tubes.Select(t => new Tube
                {
                    MachineId = machine.Id,
                    TubeIndex = t.TubeIndex,
                    TubeType = t.TubeType,
                    PurgingConnected = t.PurgingConnected,
                    ShutterExists = t.ShutterExists
                }).ToList();
            }

            var updatedMachine = await _machineRepository.UpdateAsync(machine);
            return MapToDto(updatedMachine);
        }

        public async Task<bool> DeleteMachineAsync(int id)
        {
            return await _machineRepository.DeleteAsync(id);
        }

        private static MachineDto MapToDto(Machine machine)
        {
            return new MachineDto
            {
                Id = machine.Id,
                Name = machine.Name,
                Model = machine.Model,
                Status = machine.Status,
                PlcVersion = machine.PlcVersion,
                AcsVersion = machine.AcsVersion,
                TubesNumber = machine.TubesNumber,
                Owner = machine.Owner,
                TeamviewerName = machine.TeamviewerName,
                Location = new LocationDto
                {
                    Country = machine.Location.Country,
                    City = machine.Location.City,
                    Latitude = machine.Location.Latitude,
                    Longitude = machine.Location.Longitude
                },
                Tubes = machine.Tubes.Select(t => new TubeDto
                {
                    TubeIndex = t.TubeIndex,
                    TubeType = t.TubeType,
                    PurgingConnected = t.PurgingConnected,
                    ShutterExists = t.ShutterExists
                }).OrderBy(t => t.TubeIndex).ToList(),
                CreatedAt = machine.CreatedAt,
                UpdatedAt = machine.UpdatedAt
            };
        }
    }
}
