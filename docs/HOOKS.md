# Documentação de Hooks Customizados

Este documento detalha os hooks de React criados para encapsular lógica de negócio e chamadas à API. Eles utilizam `@tanstack/react-query` para gerenciamento de estado assíncrono e cache.

---

## 🤖 `useAgents`

Gerencia o ciclo de vida dos Agentes de IA.

**Path:** `src/hooks/useAgents.ts`

### Uso Básico

```tsx
import { useAgents } from "@/hooks/useAgents";

function AgentList() {
  const { agents, isLoading, saveAgent, deleteAgent, toggleAgentStatus } =
    useAgents();

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {agents.map((agent) => (
        <li key={agent.id}>
          {agent.name}
          <button onClick={() => deleteAgent.mutate(agent.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
}
```

### Funcionalidades

- **Listagem**: Cache de 5 minutos (`staleTime`).
- **Create/Update**: `saveAgent` detecta automaticamente se é criação (sem ID) ou edição (com ID).
- **Toggle Status**: Ativa/Desativa o agente rapidamente.
- **Feedback**: Exibe Toasts de sucesso/erro automaticamente via `sonner`.

---

## 📅 `useAppointments`

Gerencia agendamentos com suporte a paginação e cancelamento.

**Path:** `src/hooks/useAppointments.ts`

### Uso Básico

```tsx
import { useAppointments } from "@/hooks/useAppointments";

function CalendarView() {
  const [page, setPage] = useState(1);
  const { appointments, meta, isLoading, cancelAppointment } = useAppointments({
    page,
    limit: 20,
  });

  return (
    <>
      {appointments.map((appt) => (
        <div key={appt.id}>{appt.title}</div>
      ))}

      <Pagination current={page} total={meta?.pages} onChange={setPage} />
    </>
  );
}
```

### API

| Propriedade         | Tipo             | Descrição                                                                       |
| ------------------- | ---------------- | ------------------------------------------------------------------------------- |
| `appointments`      | `Appointment[]`  | Lista de agendamentos da página atual.                                          |
| `meta`              | `PaginationMeta` | Metadados (total de itens, total de páginas, página atual).                     |
| `cancelAppointment` | `Mutation`       | Função para cancelar um agendamento (`DELETE`).                                 |
| `isPlaceholderData` | `boolean`        | `true` se estiver exibindo dados da página anterior enquanto carrega a próxima. |

---

## 📱 `useSessions` (WhatsApp)

Controla as sessões do WhatsApp (Multi-device via Baileys).

**Path:** `src/hooks/useSessions.ts`

### Features Especiais

- **Polling Dinâmico**: O hook ajusta a frequência de atualização (`refetchInterval`) automaticamente:
  - **1s (Rápido)**: Quando há alguma sessão com status `QRCODE` (o usuário precisa ver o QR rápido).
  - **10s (Lento)**: Quando tudo está estável, para economizar recursos.

### Actions

- `createSession(name)`: Cria nova sessão (Status inicial: `DISCONNECTED`).
- `startSession(id)`: Inicia o processo de conexão (Gera QR Code).
- `stopSession(id)`: Para o worker e limpa a conexão.
- `deleteSession(id)`: Remove a sessão do banco.

```tsx
const { sessions, startSession } = useSessions();

// Iniciar conexão
<Button onClick={() => startSession.mutate(session.id)}>
  Conectar WhatsApp
</Button>;
```
