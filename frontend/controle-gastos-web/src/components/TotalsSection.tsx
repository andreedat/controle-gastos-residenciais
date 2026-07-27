import { useEffect, useState } from "react";
import type { TotalsResponse } from "../types";
import { TotalsApi } from "../api/client";

interface Props {
  refreshKey: number;
}

export default function TotalsSection({ refreshKey }: Props) {
  const [totals, setTotals] = useState<TotalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await TotalsApi.get();
        setTotals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar totais.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  if (loading) return <section className="card"><h2>Totais</h2><p>Carregando...</p></section>;
  if (error) return <section className="card"><h2>Totais</h2><p className="error">{error}</p></section>;
  if (!totals) return null;

  return (
    <section className="card">
      <h2>Totais</h2>
      {totals.people.length === 0 ? (
        <p className="empty">Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <table className="totals-table">
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {totals.people.map((p) => (
              <tr key={p.personId}>
                <td>{p.personName}</td>
                <td className="positive">R$ {p.totalReceitas.toFixed(2)}</td>
                <td className="negative">R$ {p.totalDespesas.toFixed(2)}</td>
                <td className={p.saldo >= 0 ? "positive" : "negative"}>R$ {p.saldo.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total geral</strong></td>
              <td className="positive"><strong>R$ {totals.totalGeralReceitas.toFixed(2)}</strong></td>
              <td className="negative"><strong>R$ {totals.totalGeralDespesas.toFixed(2)}</strong></td>
              <td className={totals.saldoGeral >= 0 ? "positive" : "negative"}>
                <strong>R$ {totals.saldoGeral.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
}
