# Controle de Gastos Residenciais

Teste técnico: um sisteminha pra controlar gastos de casa, com cadastro de
pessoas, cadastro de transações (receita/despesa) e uma tela de totais.

Back-end em .NET 8 (C#) com EF Core + SQLite. Front-end em React + TypeScript
(Vite).

## Estrutura

```
backend/ControleGastos.Api/   -> API
frontend/controle-gastos-web/ -> front React
```

## Rodando o back

Precisa ter o .NET 8 SDK instalado.

```bash
cd backend/ControleGastos.Api
dotnet restore
dotnet run
```

Sobe em `http://localhost:5266`. Tem Swagger em `/swagger` pra testar os
endpoints direto, sem precisar do front.

O banco é SQLite (arquivo `controlegastos.db`), criado sozinho na primeira
vez que roda. Os dados ficam salvos ali mesmo, então continuam lá se fechar
e abrir de novo.

## Rodando o front

Precisa de Node 18+.

```bash
cd frontend/controle-gastos-web
npm install
npm run dev
```

Sobe em `http://localhost:5173`. Já aponta pra API em `localhost:5266` (dá
pra mudar em `src/api/client.ts` se precisar).

## O que foi implementado

**Pessoas**: criar, listar, editar e excluir. A exclusão é soft delete —
não apaga a linha do banco, só marca um campo `IsDeleted` e ela some das
listagens. Quando deleta uma pessoa, as transações dela também ficam
marcadas como deletadas.

**Transações**: criar e listar. Precisa de uma pessoa já cadastrada pra
vincular. Se a pessoa for menor de 18, só deixa cadastrar despesa (não
receita) — validado tanto na API quanto no front.

**Totais**: lista cada pessoa com total de receita, total de despesa e
saldo, e no final soma tudo.

## Obs

Não tive como compilar/rodar aqui pra testar 100%, então se der algum erro
de build é só avisar que eu ajusto.
