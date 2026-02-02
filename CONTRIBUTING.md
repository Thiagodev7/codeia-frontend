# Guia de Contribuição

Obrigado por considerar contribuir para o CodeIA Frontend! Siga estas diretrizes para garantir um processo suave.

## 🛠️ Desenvolvimento

1. **Clone o repositório** e crie uma branch para sua feature/fix:

   ```bash
   git checkout -b feature/minha-feature
   ```

2. **Siga o padrão de código**:
   - Use TypeScript estrito.
   - Evite `any` sempre que possível.
   - Componentes UI devem ficar em `src/components/ui`.
   - Lógica de negócio complexa deve ser extraída para Hooks em `src/hooks`.
   - Queries de API devem usar `React Query` e ficar em `src/hooks`.

3. **Testes**:
   - Se criar um componente UI reutilizável, adicione testes unitários.
   - Se criar um Hook complexo, adicione testes de integração.
   - Rode `npm test` antes de enviar.

4. **Commits**:
   - Siga a convenção [Conventional Commits](https://www.conventionalcommits.org/).
   - Ex: `feat: adicionar filtro na listagem`, `fix: corrigir erro de renderização`.

## 🐛 Reportando Bugs

Abra uma issue descrevendo:

- Passos para reproduzir
- Comportamento esperado
- Comportamento atual
- Screenshots (se aplicável)

## Pull Requests

1. Abra um PR para a branch `main`.
2. Descreva suas alterações detalhadamente.
3. Certifique-se de que o build passa (`npm run build`).
