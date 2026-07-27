import { useEffect, useState } from "react";
import type { Person } from "../types";
import { PeopleApi } from "../api/client";

interface Props {
  onChanged: () => void; // notifica o App para recarregar transações/totais quando pessoas mudam
}

export default function PeopleSection({ onChanged }: Props) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");

  async function loadPeople() {
    setLoading(true);
    setError(null);
    try {
      const data = await PeopleApi.list();
      setPeople(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pessoas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPeople();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await PeopleApi.create({ name, age: Number(age) });
      setName("");
      setAge("");
      await loadPeople();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pessoa.");
    }
  }

  function startEdit(person: Person) {
    setEditingId(person.id);
    setEditName(person.name);
    setEditAge(String(person.age));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditAge("");
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setError(null);
    try {
      await PeopleApi.update(id, { name: editName, age: Number(editAge) });
      cancelEdit();
      await loadPeople();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar pessoa.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta pessoa? Todas as transações dela também serão removidas.")) {
      return;
    }
    setError(null);
    try {
      await PeopleApi.remove(id);
      await loadPeople();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir pessoa.");
    }
  }

  return (
    <section className="card">
      <h2>Pessoas</h2>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Idade"
          min={0}
          max={150}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : people.length === 0 ? (
        <p className="empty">Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <ul className="list">
          {people.map((person) => (
            <li key={person.id} className="list-item">
              {editingId === person.id ? (
                <form className="inline-form" onSubmit={(e) => handleUpdate(e, person.id)}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    min={0}
                    max={150}
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    required
                  />
                  <button type="submit">Salvar</button>
                  <button type="button" className="secondary" onClick={cancelEdit}>
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <span>
                    <strong>{person.name}</strong> · {person.age} anos
                    {person.isMinor && <em className="badge">menor de idade</em>}
                  </span>
                  <span className="actions">
                    <button className="secondary" onClick={() => startEdit(person)}>
                      Editar
                    </button>
                    <button className="danger" onClick={() => handleDelete(person.id)}>
                      Excluir
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
