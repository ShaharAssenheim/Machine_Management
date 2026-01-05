using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.DTOs;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class MachinesController : ControllerBase
    {
        private readonly IMachineService _machineService;
        private readonly ILogger<MachinesController> _logger;

        public MachinesController(IMachineService machineService, ILogger<MachinesController> logger)
        {
            _machineService = machineService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all machines
        /// </summary>
        /// <returns>List of all machines</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<MachineDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<MachineDto>>> GetAllMachines()
        {
            var machines = await _machineService.GetAllMachinesAsync();
            return Ok(machines);
        }

        /// <summary>
        /// Retrieves a machine by its ID
        /// </summary>
        /// <param name="id">The machine ID</param>
        /// <returns>The requested machine</returns>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(MachineDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MachineDto>> GetMachineById(int id)
        {
            var machine = await _machineService.GetMachineByIdAsync(id);
            
            if (machine == null)
            {
                _logger.LogWarning("Machine with ID {MachineId} not found", id);
                return NotFound(new { message = $"Machine with ID {id} not found" });
            }
            
            return Ok(machine);
        }

        /// <summary>
        /// Retrieves a machine by its name
        /// </summary>
        /// <param name="name">The machine name</param>
        /// <returns>The requested machine</returns>
        [HttpGet("by-name/{name}")]
        [ProducesResponseType(typeof(MachineDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MachineDto>> GetMachineByName(string name)
        {
            var machine = await _machineService.GetMachineByNameAsync(name);
            
            if (machine == null)
            {
                _logger.LogWarning("Machine with name '{MachineName}' not found", name);
                return NotFound(new { message = $"Machine with name '{name}' not found" });
            }
            
            return Ok(machine);
        }

        /// <summary>
        /// Retrieves machines by status
        /// </summary>
        /// <param name="status">The machine status</param>
        /// <returns>List of machines with the specified status</returns>
        [HttpGet("by-status/{status}")]
        [ProducesResponseType(typeof(IEnumerable<MachineDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<MachineDto>>> GetMachinesByStatus(MachineStatus status)
        {
            var machines = await _machineService.GetMachinesByStatusAsync(status);
            return Ok(machines);
        }

        /// <summary>
        /// Retrieves machines by location
        /// </summary>
        /// <param name="country">The country name</param>
        /// <param name="city">The city name (optional)</param>
        /// <returns>List of machines in the specified location</returns>
        [HttpGet("by-location")]
        [ProducesResponseType(typeof(IEnumerable<MachineDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<MachineDto>>> GetMachinesByLocation(
            [FromQuery] string country, 
            [FromQuery] string? city = null)
        {
            var machines = await _machineService.GetMachinesByLocationAsync(country, city);
            return Ok(machines);
        }

        /// <summary>
        /// Creates a new machine
        /// </summary>
        /// <param name="createDto">Machine creation data</param>
        /// <returns>The created machine</returns>
        [HttpPost]
        [ProducesResponseType(typeof(MachineDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MachineDto>> CreateMachine([FromBody] CreateMachineDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var machine = await _machineService.CreateMachineAsync(createDto);
                return CreatedAtAction(nameof(GetMachineById), new { id = machine.Id }, machine);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error creating machine");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing machine
        /// </summary>
        /// <param name="id">The machine ID</param>
        /// <param name="updateDto">Machine update data</param>
        /// <returns>The updated machine</returns>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(MachineDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MachineDto>> UpdateMachine(int id, [FromBody] UpdateMachineDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var machine = await _machineService.UpdateMachineAsync(id, updateDto);
                
                if (machine == null)
                {
                    _logger.LogWarning("Machine with ID {MachineId} not found for update", id);
                    return NotFound(new { message = $"Machine with ID {id} not found" });
                }
                
                return Ok(machine);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error updating machine {MachineId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Partially updates a machine
        /// </summary>
        /// <param name="id">The machine ID</param>
        /// <param name="updateDto">Machine partial update data</param>
        /// <returns>The updated machine</returns>
        [HttpPatch("{id:int}")]
        [ProducesResponseType(typeof(MachineDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MachineDto>> PatchMachine(int id, [FromBody] UpdateMachineDto updateDto)
        {
            // PATCH and PUT use the same update logic since UpdateMachineDto already supports partial updates
            return await UpdateMachine(id, updateDto);
        }

        /// <summary>
        /// Deletes a machine
        /// </summary>
        /// <param name="id">The machine ID</param>
        /// <returns>No content on success</returns>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteMachine(int id)
        {
            var deleted = await _machineService.DeleteMachineAsync(id);
            
            if (!deleted)
            {
                _logger.LogWarning("Machine with ID {MachineId} not found for deletion", id);
                return NotFound(new { message = $"Machine with ID {id} not found" });
            }
            
            _logger.LogInformation("Machine with ID {MachineId} deleted successfully", id);
            return NoContent();
        }
    }
}
