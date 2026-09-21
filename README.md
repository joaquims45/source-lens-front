# source-lens-web

React/TypeScript frontend for **SourceLens** — the developer-tool UI on top
of `source-lens-api`'s repository ingestion, hybrid search, grounded chat
agent and architecture graph. This README covers **Milestone 4 — SourceLens
Web** (onboarding, analysis progress, the workspace shell, chat, citations,
Monaco, the file explorer) and **Milestone 5 — Architecture Intelligence**
(the React Flow graph). Dependency/call tracing (Milestone 6) is still a
"not built yet" placeholder, since its backend doesn't exist yet.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Router,
Monaco Editor, React Flow, Lucide Icons.

## Project structure

```
src/
  AppRoutes.tsx        Root router. Lazy-loads each module behind Suspense.
  modules/<name>/       One per functional area; orchestrates that area's
                         nested <Routes> onto real views in pages/. Never a
                         view itself.
  pages/<Area>/<View>/  Concrete screens: index.tsx (+ components/ for a
                         view's own, non-shared pieces).
  components/<Name>/    UI reusable across pages/modules.
  hooks/api/            Centralized HTTP client + TanStack Query hooks
                         (auth headers, error shape, SSE streams).
  services/             API calls, decoupled from components.
  utils/                Pure helpers (formatting, class names, language maps).
  types/                Shared TypeScript types mirroring the backend schema.
```

Two modules today:

- **`modules/onboarding`** — `/` (landing: paste a GitHub URL) and
  `/progress/:analysisId` (live ingestion progress).
- **`modules/workspace`** — `/analyses/:analysisId/*`, a layout route
  (header + sidebar) wrapping `chat`, `files`, `architecture`,
  `dependencies`, `insights`.

Adding a feature follows the same convention as the rest of the codebase:
a new view under `pages/<Area>/<Name>/index.tsx`, registered in its
module's route table; shared UI goes in `components/`, shared logic in
`hooks/` or `services/` — never duplicated inside a page.

## Real progress, not simulated

The progress page and the workspace header render only what the backend's
job-stage/analysis state actually reports (`useAnalysisEvents`, an SSE
subscription to `GET /analyses/{id}/events`) — there is no client-side
progress bar timer standing in for real state.

## Chat and grounding

`useChatStream` drives `GET /analyses/{id}/chat/stream` (native
`EventSource`, since the endpoint is a plain GET). The stream carries
validated, structured blocks — `tool_call`, `evidence`, `answer`, `done` —
not raw token fragments, so the UI reacts to each block rather than
re-parsing accumulated text. **Citations shown in the UI are exactly the
`evidence` blocks the backend harvested from real tool calls** — the
frontend never invents or reformats a citation from the model's prose.
Clicking one navigates to the Files view at that exact path/line range and
highlights it in Monaco.

## Architecture graph

`Architecture` renders `GET /analyses/{id}/architecture` with React Flow: a
simple column-by-type layout (application → modules → controllers/services →
repositories → infrastructure — no layout library needed at this graph
size), nodes styled/iconed by type, a type filter toolbar, and a side panel
for a selected node showing its confidence, cited evidence (clickable
through to Files, exactly like a chat citation) and dependencies. A
repository with no detected signals shows an explicit empty state rather
than a blank canvas.

## Running locally

```bash
npm install
npm run dev            # http://localhost:5173, proxies /api to :8000
```

Requires `source-lens-api` running locally (`docker compose up -d` in that
repo) — see its README. Without `ANTHROPIC_API_KEY` set there, chat fails
with a clear inline error while everything else (ingestion, search, files,
insights) keeps working.

## Trade-off: Monaco loads from a CDN

`@monaco-editor/react` fetches the Monaco runtime from a CDN by default
rather than bundling it (~5MB of assets). That keeps the production bundle
small (≈380KB across all chunks) at the cost of requiring network access to
view code — a reasonable default for this project's scale; self-hosting via
Vite's Monaco plugin is a straightforward swap if that trade-off changes.

## Testing

```bash
npm run typecheck
npm run lint
npm run build           # production build; also type-checks
```

There is no component test suite yet — the app was verified with a
Playwright smoke run through the full flow (submit → live progress →
workspace → files/Monaco → insights → architecture graph) against the real
backend, which is how a real routing bug (sidebar links nesting under the
active tab instead of replacing it) and a fitView/toolbar overlap on the
architecture graph were caught and fixed. Component/integration tests are a
Milestone 7 hardening item.
