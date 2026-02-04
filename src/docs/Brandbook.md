# Brandbook - Identidade Visual (Legacy)

Este guia documenta a identidade visual original do projeto CodeIA, baseada em uma estética limpa, moderna e focada em tons de Slate e acentos Cyan/Blue.

## 1. Cores

### Paleta Principal (Slate - Neutros)

A base da interface utiliza a escala de cinza `Slate` do Tailwind.

- **Background Light:** `#F8FAFC` (Slate-50)
- **Background Dark:** `#020617` (Slate-950)
- **Surface Dark:** `#0F172A` (Slate-900)
- **Text Primary:** `#0F172A` (Slate-900) / `#F8FAFC` (Slate-50)
- **Text Secondary:** `#64748B` (Slate-500)

### Cores de Destaque (Brand Gradient)

O gradiente principal da marca transita entre Cyan e Blue.

- **Cyan:** `#06B6D4` (Cyan-500)
- **Blue:** `#3B82F6` (Blue-500)
- **Gradiente:** `bg-gradient-to-r from-cyan-500 to-blue-500`

### Cores Semânticas

- **Sucesso:** Emerald (`text-emerald-600`)
- **Erro:** Red (`text-red-500`)
- **Aviso:** Amber (`text-amber-600`)
- **Info:** Blue (`text-blue-600`)

## 2. Tipografia

- **Família Principal:** `Inter` (Sans-serif)
- **Pesos:**
  - Regular (400)
  - Medium (500)
  - Semibold (600)
  - Bold (700)

## 3. Componentes

### Botões

- **Primário:** Gradiente Cyan->Blue, Texto Branco, Sombra Cyan.
  - `bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/20`
- **Secundário:** Slate Background (Light: 100 / Dark: 800), Texto Slate.
- **Outline:** Borda Slate-300/700.

### Sidebar e Cards

- **Estilo:** Visual limpo com leve transparência (Glassmorphism opcional).
- **Dark Mode:** Cards em `bg-slate-900` com bordas sutis `border-slate-800`.
- **Sombra:** Sombras suaves coloridas no Dark Mode (`shadow-cyan-900/5`).
- **Estados:** Hover com leve translação (`-translate-y-1`) e sombra aumentada.

## 4. UI Patterns

- **Inputs:** `rounded-xl`, borda cinza suave, anel de foco Cyan.
- **Scrollbar:** Customizada fina, track transparente, thumb arredondado em Slate-200/800.
- **Animações:** `fadeIn` suave e transições de cor (`duration-300`).
