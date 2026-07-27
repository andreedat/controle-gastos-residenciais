namespace ControleGastos.Api.Models;

// Pessoa cadastrada no sistema. Cada pessoa pode ter várias transações.
public class Person
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }

    // Soft delete: em vez de apagar a linha do banco, só marca como deletado.
    // Assim a gente não perde histórico se precisar auditar depois.
    public bool IsDeleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public List<Transaction> Transactions { get; set; } = new();

    // Regra de negócio: pessoa menor de idade = menos de 18 anos.
    public bool IsMinor => Age < 18;
}
