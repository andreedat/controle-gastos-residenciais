namespace ControleGastos.Api.Dtos;

public class PersonTotalDto
{
    public Guid PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

public class TotalsResponseDto
{
    public List<PersonTotalDto> People { get; set; } = new();
    public decimal TotalGeralReceitas { get; set; }
    public decimal TotalGeralDespesas { get; set; }
    public decimal SaldoGeral { get; set; }
}
