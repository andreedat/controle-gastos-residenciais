using System.ComponentModel.DataAnnotations;
using ControleGastos.Api.Models.Enums;

namespace ControleGastos.Api.Dtos;

public class CreateTransactionDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(300)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Value { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required(ErrorMessage = "O identificador da pessoa é obrigatório.")]
    public Guid PersonId { get; set; }
}

public class TransactionResponseDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public TransactionType Type { get; set; }
    public Guid PersonId { get; set; }
    public string? PersonName { get; set; }
    public DateTime CreatedAt { get; set; }
}
