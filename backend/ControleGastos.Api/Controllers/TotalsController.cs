using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Mostra, pra cada pessoa, o total de receitas, despesas e o saldo.
// No fim soma tudo e devolve o total geral também.
[ApiController]
[Route("api/[controller]")]
public class TotalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<TotalsResponseDto>> GetTotals()
    {
        var people = await _context.People
            .Include(p => p.Transactions)
            .OrderBy(p => p.Name)
            .ToListAsync();

        var response = new TotalsResponseDto();

        foreach (var person in people)
        {
            var totalReceitas = person.Transactions
                .Where(t => t.Type == TransactionType.Receita)
                .Sum(t => t.Value);

            var totalDespesas = person.Transactions
                .Where(t => t.Type == TransactionType.Despesa)
                .Sum(t => t.Value);

            response.People.Add(new PersonTotalDto
            {
                PersonId = person.Id,
                PersonName = person.Name,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            });
        }

        response.TotalGeralReceitas = response.People.Sum(p => p.TotalReceitas);
        response.TotalGeralDespesas = response.People.Sum(p => p.TotalDespesas);
        response.SaldoGeral = response.TotalGeralReceitas - response.TotalGeralDespesas;

        return Ok(response);
    }
}
