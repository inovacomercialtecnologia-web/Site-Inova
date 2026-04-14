# Inova Systems Solutions - Site Institucional

Site marketing B2B da Inova Systems Solutions (https://inovasystemssolutions.com).
React 19 SPA com foco em conversao, animacoes e identidade visual premium.

## Stack

- **Framework**: React 19 + TypeScript 5.8 + Vite 6
- **Estilo**: Tailwind CSS 4 (utility-first, `@theme` em `src/index.css`)
- **Animacoes**: Motion (Framer Motion) v12 + GSAP
- **Roteamento**: React Router v7 (BrowserRouter)
- **Icones**: Lucide React
- **Sanitizacao**: DOMPurify (XSS)
- **IA**: Google Gemini (`@google/genai`)
- **Hospedagem**: Hostinger (SSH deploy via GitHub Actions)

## Comandos

```bash
npm run dev       # Dev server na porta 3000
npm run build     # Build de producao (Vite)
npm run preview   # Preview do build
npm run lint      # Type-check (tsc --noEmit)
npm run clean     # Remove dist/
```

## Estrutura

```
src/
  main.tsx              # Entry point (React 19 root)
  App.tsx               # Router + layout (Navbar/Footer)
  index.css             # Tailwind @theme, fonts, variaveis globais
  components/           # ~42 componentes reutilizaveis
  pages/                # ~16 paginas (rotas)
  hooks/                # Custom hooks (useCountUp, useMagnetic, useTilt, useIsMobile, useWindowSize)
public/
  api/contact.php       # Endpoint de contato (CORS, HMAC-SHA256 anti-spam)
.github/workflows/
  deploy.yml            # CI/CD: build + deploy SSH para Hostinger
```

## Rotas Principais

| Rota | Pagina |
|------|--------|
| `/` | ImmersiveHome |
| `/quem-somos` | AboutUsPage |
| `/missao` | MissionPage |
| `/filosofia` | PhilosophyPage |
| `/portfolio` | PortfolioPage |
| `/solucoes/aplicacoes-web` | WebApplicationsPage |
| `/solucoes/aplicacoes-mobile` | MobileApplicationsPage |
| `/solucoes/automacoes` | AutomationsPage |
| `/solucoes/ia` | ArtificialIntelligencePage |
| `/contato-quiz` | ContactQuizPage |
| `/blog` | BlogPage |
| `/blog/:slug` | BlogPostPage |
| `/diagnostico/:slug` | DiagnosticDetail |

## Paleta de Cores

- **Gold (marca)**: `#C9A84C` / light: `#E5C05C` / hover: `#E8C97A`
- **Dark**: `#080808`, `#0A0A0A`
- **Light**: `#FFFFFF`, `#FAFAFA`, `#F5F2EC` (cream)
- **Texto**: `#0A0A0A` (primario), `#444444` (secundario)

## Fontes

- **Display**: Syne (titulos bold)
- **Body**: DM Sans / Inter (texto geral)
- **Serif**: Cormorant Garamond (destaques elegantes)
- **Mono**: JetBrains Mono (codigo/dados)

## Convencoes

- Componentes: PascalCase (`MainHeroSection.tsx`)
- Hooks: camelCase com prefixo `use` (`useCountUp.ts`)
- Idioma do conteudo: pt-BR
- Easing padrao: `[0.22, 1, 0.36, 1]`
- Animacoes respeitam `prefers-reduced-motion`
- Mobile-first: breakpoints `md:` e `lg:`
- Canvas/particulas: 30fps mobile, 60fps desktop

## Deploy

Push para `main` dispara GitHub Actions:
1. Build com Vite (Node 20)
2. Gera `config.local.php` com secrets
3. Remove source maps
4. Deploy SSH para Hostinger (147.93.37.106:65002)

**Secrets necessarios**: `HOSTINGER_SSH_KEY`, `CONTACT_TOKEN_SECRET`, `ERP_API_URL`, `ERP_API_KEY`

## Acessibilidade

- Skip link: "Ir para conteudo principal"
- ARIA labels em botoes e formularios
- `touch-action: manipulation` (sem tap delay)
- Contraste verificado (gold sobre fundos escuros/claros)

## Seguranca

- CSP headers no HTML e no PHP
- HMAC-SHA256 token anti-spam no formulario de contato
- DOMPurify para sanitizacao de inputs
- Source maps removidos em producao
- HTTPS forcado via .htaccess

## Notas

- Nao ha framework de testes configurado
- Path alias: `@/*` mapeia para raiz do projeto
- Componentes de demo (ERP/CRM/LMS) existem em `src/components/` para portfolio
