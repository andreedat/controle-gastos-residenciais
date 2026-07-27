using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeopleController : ControllerBase
{
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonResponseDto>>> GetAll()
    {
        var people = await _context.People
            .OrderBy(p => p.Name)
            .Select(p => ToResponseDto(p))
            .ToListAsync();

        return Ok(people);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PersonResponseDto>> GetById(Guid id)
    {
        var person = await _context.People.FirstOrDefaultAsync(p => p.Id == id);
        if (person is null)
            return NotFound(new { message = "Pessoa não encontrada." });

        return Ok(ToResponseDto(person));
    }

    [HttpPost]
    public async Task<ActionResult<PersonResponseDto>> Create([FromBody] CreatePersonDto dto)
    {
        var person = new Person
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Age = dto.Age,
            CreatedAt = DateTime.UtcNow
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = person.Id }, ToResponseDto(person));
    }

    // Atualiza nome/idade de uma pessoa já cadastrada
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PersonResponseDto>> Update(Guid id, [FromBody] UpdatePersonDto dto)
    {
        var person = await _context.People.FirstOrDefaultAsync(p => p.Id == id);
        if (person is null)
            return NotFound(new { message = "Pessoa não encontrada." });

        person.Name = dto.Name.Trim();
        person.Age = dto.Age;
        person.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ToResponseDto(person));
    }

    // Soft delete: marca a pessoa como deletada em vez de apagar do banco.
    // As transações dela seguem junto (também viram soft delete).
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var person = await _context.People
            .Include(p => p.Transactions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (person is null)
            return NotFound(new { message = "Pessoa não encontrada." });

        var now = DateTime.UtcNow;

        person.IsDeleted = true;
        person.DeletedAt = now;

        foreach (var transaction in person.Transactions)
        {
            transaction.IsDeleted = true;
            transaction.DeletedAt = now;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static PersonResponseDto ToResponseDto(Person p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Age = p.Age,
        IsMinor = p.IsMinor,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt
    };
}
