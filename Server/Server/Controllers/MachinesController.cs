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
        /// Get all machines
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MachineDto>>> GetAllMachines()
        {
            try
            {
                var machines = await _machineService.GetAllMachinesAsync();
                return Ok(machines);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all machines");
                return StatusCode(500, "An error occurred while retrieving machines.");
            }
        }

        /// <summary>
        /// Get a machine by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MachineDto>> GetMachineById(int id)
        {
            try
            {
                var machine = await _machineService.GetMachineByIdAsync(id);
                if (machine == null)
                {
                    return NotFound($"Machine with ID {id} not found.");
                }
                return Ok(machine);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving machine with ID {MachineId}", id);
                return StatusCode(500, "An error occurred while retrieving the machine.");
            }
        }

        /// <summary>
        /// Get a machine by name
        /// </summary>
        [HttpGet("by-name/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MachineDto>> GetMachineByName(string name)
        {
            try
            {
                var machine = await _machineService.GetMachineByNameAsync(name);
                if (machine == null)
                {
                    return NotFound($"Machine with name '{name}' not found.");
                }
                return Ok(machine);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving machine with name {MachineName}", name);
                return StatusCode(500, "An error occurred while retrieving the machine.");
            }
        }

        /// <summary>
        /// Get machines by status
        /// </summary>
        [HttpGet("by-status/{status}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MachineDto>>> GetMachinesByStatus(MachineStatus status)
        {
            try
            {
                var machines = await _machineService.GetMachinesByStatusAsync(status);
                return Ok(machines);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving machines with status {Status}", status);
                return StatusCode(500, "An error occurred while retrieving machines.");
            }
        }

        /// <summary>
        /// Get machines by location
        /// </summary>
        [HttpGet("by-location")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MachineDto>>> GetMachinesByLocation(
            [FromQuery] string country, 
            [FromQuery] string? city = null)
        {
            try
            {
                var machines = await _machineService.GetMachinesByLocationAsync(country, city);
                return Ok(machines);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving machines for location {Country}/{City}", country, city);
                return StatusCode(500, "An error occurred while retrieving machines.");
            }
        }

        /// <summary>
        /// Create a new machine
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MachineDto>> CreateMachine([FromBody] CreateMachineDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var machine = await _machineService.CreateMachineAsync(createDto);
                return CreatedAtAction(nameof(GetMachineById), new { id = machine.Id }, machine);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error creating machine");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating machine");
                return StatusCode(500, "An error occurred while creating the machine.");
            }
        }

        /// <summary>
        /// Update an existing machine
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MachineDto>> UpdateMachine(int id, [FromBody] UpdateMachineDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var machine = await _machineService.UpdateMachineAsync(id, updateDto);
                if (machine == null)
                {
                    return NotFound($"Machine with ID {id} not found.");
                }
                return Ok(machine);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error updating machine {MachineId}", id);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating machine {MachineId}", id);
                return StatusCode(500, "An error occurred while updating the machine.");
            }
        }

        /// <summary>
        /// Partially update a machine (PATCH)
        /// </summary>
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MachineDto>> PatchMachine(int id, [FromBody] UpdateMachineDto updateDto)
        {
            // Same implementation as PUT since UpdateMachineDto has nullable properties
            return await UpdateMachine(id, updateDto);
        }

        /// <summary>
        /// Delete a machine
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteMachine(int id)
        {
            try
            {
                var deleted = await _machineService.DeleteMachineAsync(id);
                if (!deleted)
                {
                    return NotFound($"Machine with ID {id} not found.");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting machine {MachineId}", id);
                return StatusCode(500, "An error occurred while deleting the machine.");
            }
        }
    }
}
