import type { Person, Transaction, TotalsResponse } from "../types";

const API_BASE_URL = "http://localhost:5266/api";

// wrapper básico do fetch pra não repetir tratamento de erro em toda chamada
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Erro na requisição (${response.status})`;
    try {
      const body = await response.json();
      if (body?.errors) {
        message = Object.values(body.errors).flat().join(" ");
      } else if (body?.message) {
        message = body.message;
      }
    } catch {
      // sem corpo json mesmo, mantém a mensagem padrão
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const PeopleApi = {
  list: () => request<Person[]>("/people"),

  create: (data: { name: string; age: number }) =>
    request<Person>("/people", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: { name: string; age: number }) =>
    request<Person>(`/people/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  remove: (id: string) => request<void>(`/people/${id}`, { method: "DELETE" }),
};

export const TransactionsApi = {
  list: (personId?: string) =>
    request<Transaction[]>(`/transactions${personId ? `?personId=${personId}` : ""}`),

  create: (data: { description: string; value: number; type: "Receita" | "Despesa"; personId: string }) =>
    request<Transaction>("/transactions", { method: "POST", body: JSON.stringify(data) }),
};

export const TotalsApi = {
  get: () => request<TotalsResponse>("/totals"),
};
