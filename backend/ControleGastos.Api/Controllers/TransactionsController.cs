using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using ControleGastos.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetAll([FromQuery] Guid? personId)
    {
        var query = _context.Transactions
            .Include(t => t.Person)
            .AsQueryable();

        if (personId.HasValue)
            query = query.Where(t => t.PersonId == personId.Value);

        var transactions = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => ToResponseDto(t))
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> Create([FromBody] CreateTransactionDto dto)
    {
        var person = await _context.People.FirstOrDefaultAsync(p => p.Id == dto.PersonId);
        if (person is null)
        {
            ModelState.AddModelError(nameof(dto.PersonId), "Pessoa informada não existe.");
            return ValidationProblem(ModelState);
        }

        // menor de idade só pode ter despesa cadastrada, não receita
        if (person.IsMinor && dto.Type != TransactionType.Despesa)
        {
            ModelState.AddModelError(nameof(dto.Type),
                "Pessoas menores de idade só podem ter transações do tipo Despesa cadastradas.");
            return ValidationProblem(ModelState);
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Description = dto.Description.Trim(),
            Value = dto.Value,
            Type = dto.Type,
            PersonId = dto.PersonId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        transaction.Person = person;

        return CreatedAtAction(nameof(GetAll), null, ToResponseDto(transaction));
    }

    private static TransactionResponseDto ToResponseDto(Transaction t) => new()
    {
        Id = t.Id,
        Description = t.Description,
        Value = t.Value,
        Type = t.Type,
        PersonId = t.PersonId,
        PersonName = t.Person?.Name,
        CreatedAt = t.CreatedAt
    };
}
