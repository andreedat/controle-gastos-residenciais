using ControleGastos.Api.Models.Enums;

namespace ControleGastos.Api.Models;

// Uma transação (receita ou despesa) de uma pessoa.
public class Transaction
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public TransactionType Type { get; set; }

    public Guid PersonId { get; set; }
    public Person? Person { get; set; }

    // Quando a pessoa dona é deletada, as transações dela também viram soft delete.
    public bool IsDeleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}
