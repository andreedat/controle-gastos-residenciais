import { useEffect, useState } from "react";
import type { Person, Transaction, TransactionType } from "../types";
import { TransactionsApi } from "../api/client";

interface Props {
  people: Person[];
  refreshKey: number; // muda quando pessoas são alteradas em outra seção
  onChanged: () => void;
}

export default function TransactionsSection({ people, refreshKey, onChanged }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<TransactionType>("Despesa");
  const [personId, setPersonId] = useState("");

  const selectedPerson = people.find((p) => p.id === personId);

  async function loadTransactions() {
    setLoading(true);
    setError(null);
    try {
      const data = await TransactionsApi.list();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [refreshKey]);

  // Se a pessoa selecionada for menor de idade e o tipo estiver como Receita,
  // força de volta para Despesa (a API também valida isso, mas evitamos o erro).
  useEffect(() => {
    if (selectedPerson?.isMinor && type === "Receita") {
      setType("Despesa");
    }
  }, [selectedPerson, type]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await TransactionsApi.create({
        description,
        value: Number(value),
        type,
        personId,
      });
      setDescription("");
      setValue("");
      await loadTransactions();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar transação.");
    }
  }

  return (
    <section className="card">
      <h2>Transações</h2>

      {people.length === 0 ? (
        <p className="empty">Cadastre uma pessoa antes de lançar transações.</p>
      ) : (
        <form className="inline-form" onSubmit={handleCreate}>
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} required>
            <option value="" disabled>
              Selecione a pessoa
            </option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.isMinor ? "(menor)" : ""}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Valor"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            disabled={selectedPerson?.isMinor}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita" disabled={selectedPerson?.isMinor}>
              Receita
            </option>
          </select>

          <button type="submit">Lançar</button>
        </form>
      )}

      {selectedPerson?.isMinor && (
        <p className="hint">Esta pessoa é menor de idade: apenas despesas podem ser cadastradas.</p>
      )}

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : transactions.length === 0 ? (
        <p className="empty">Nenhuma transação cadastrada ainda.</p>
      ) : (
        <ul className="list">
          {transactions.map((t) => (
            <li key={t.id} className="list-item">
              <span>
                <strong>{t.description}</strong> · {t.personName} ·{" "}
                <span className={t.type === "Receita" ? "positive" : "negative"}>
                  {t.type === "Receita" ? "+" : "-"} R$ {t.value.toFixed(2)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
