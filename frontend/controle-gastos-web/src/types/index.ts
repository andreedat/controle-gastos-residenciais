// Tipos que espelham os DTOs expostos pela API .NET.

export type TransactionType = "Receita" | "Despesa";

export interface Person {
  id: string;
  name: string;
  age: number;
  isMinor: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  type: TransactionType;
  personId: string;
  personName?: string;
  createdAt: string;
}

export interface PersonTotal {
  personId: string;
  personName: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalsResponse {
  people: PersonTotal[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoGeral: number;
}
