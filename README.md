# 💰 Controle de Gastos Residenciais

Aplicação full-stack para controlar os gastos de uma casa: cadastro de pessoas, registro de transações (receitas e despesas) e uma tela de totais com o saldo de cada pessoa e o saldo geral.

<p>
  <img src="https://img.shields.io/badge/C%23-512BD4?style=flat-square&logo=csharp&logoColor=white" alt="C#" />
  <img src="https://img.shields.io/badge/.NET%208-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/EF%20Core-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt="EF Core" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
</p>

## ✨ Funcionalidades

**Pessoas**
- Criar, listar, editar e excluir.
- A exclusão é *soft delete*: a linha não é apagada do banco, apenas marcada com o campo `IsDeleted`, e a pessoa some das listagens.
- Ao excluir uma pessoa, as transações dela também são marcadas como excluídas.

**Transações**
- Criar e listar receitas e despesas, sempre vinculadas a uma pessoa já cadastrada.
- **Regra de negócio:** pessoas menores de 18 anos só podem ter despesas. A validação acontece na API e também no front-end.

**Totais**
- Lista cada pessoa com total de receitas, total de despesas e saldo.
- No final, mostra a soma geral de todas as pessoas.

## 🧱 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Back-end | C#, .NET 8, Entity Framework Core, SQLite, Swagger |
| Front-end | React, TypeScript, Vite |

## 📁 Estrutura do projeto

```
backend/ControleGastos.Api/      -> API em .NET 8
frontend/controle-gastos-web/    -> front-end em React + TypeScript
```

## 🚀 Como rodar

### Back-end

Pré-requisito: [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

```bash
cd backend/ControleGastos.Api
dotnet restore
dotnet run
```

- A API sobe em `http://localhost:5266`.
- O Swagger fica em `http://localhost:5266/swagger`, e dá para testar todos os endpoints direto por ele, sem precisar do front.
- O banco é um arquivo SQLite (`controlegastos.db`), criado automaticamente na primeira execução. Os dados continuam salvos ao fechar e abrir a aplicação de novo.

### Front-end

Pré-requisito: Node 18 ou superior.

```bash
cd frontend/controle-gastos-web
npm install
npm run dev
```

- O front sobe em `http://localhost:5173` e já aponta para a API em `localhost:5266`.
- Se precisar mudar o endereço da API, altere em `src/api/client.ts`.

## 📝 Sobre o projeto

Este projeto foi desenvolvido como um teste técnico, com foco em regras de negócio simples, validação nos dois lados (API e interface) e persistência de dados.

## 👤 Autor

**André Luiz**, estudante de Sistemas de Informação no IFBA, Campus Vitória da Conquista.

[![LinkedIn](https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&style=for-the-badge)](https://www.linkedin.com/in/andreeluiz-dat/)
