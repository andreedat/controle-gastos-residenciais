import { useEffect, useState } from "react";
import type { Person } from "./types";
import { PeopleApi } from "./api/client";
import PeopleSection from "./components/PeopleSection";
import TransactionsSection from "./components/TransactionsSection";
import TotalsSection from "./components/TotalsSection";
import "./styles.css";

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  async function loadPeople() {
    try {
      const data = await PeopleApi.list();
      setPeople(data);
    } catch {
      // erros específicos já são tratados dentro de PeopleSection
    }
  }

  useEffect(() => {
    loadPeople();
  }, [refreshKey]);

  function bumpRefresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Controle de Gastos Residenciais</h1>
        <p>Cadastro de pessoas, transações e consulta de totais.</p>
      </header>

      <main className="app-content">
        <PeopleSection onChanged={bumpRefresh} />
        <TransactionsSection people={people} refreshKey={refreshKey} onChanged={bumpRefresh} />
        <TotalsSection refreshKey={refreshKey} />
      </main>
    </div>
  );
}
