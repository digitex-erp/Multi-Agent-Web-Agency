# LangGraph + ChatNVIDIA — Agent Orchestrator (Python)

This is the **heart** of the multi-agent web agency: **LangGraph** state machine + **`ChatNVIDIA`** from `langchain-nvidia-ai-endpoints`.

The Node/Express dashboard calls this service when `AGENTS_PYTHON_URL` is set.

## Architecture

```
React Dashboard (Node/Express :3000)
        │
        ├─► POST /api/generate-report
        │         │
        │         ├─1─► Python agents/server.py (LangGraph + ChatNVIDIA)  ← preferred
        │         ├─2─► src/agents/reportGraph.ts (LangGraph TS + LangChain)
        │         └─3─► Local fallback template
        │
        └─► POST /api/audit → Lighthouse CLI (Node)
```

## Setup

```bash
cd agents
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env        # add your NVIDIA_API_KEY
uvicorn server:app --port 8001
```

In project root `.env`:

```env
AGENTS_PYTHON_URL=http://localhost:8001
NVIDIA_API_KEY=nvapi-...      # also needed for TS LangGraph fallback
NVIDIA_MODEL=deepseek-ai/deepseek-v3.1
```

## ChatNVIDIA example (same as your snippet)

```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA

client = ChatNVIDIA(
    model=os.getenv("NVIDIA_MODEL", "deepseek-ai/deepseek-v3.1"),
    api_key=os.getenv("NVIDIA_API_KEY"),
    temperature=0.7,
    top_p=0.95,
    max_tokens=4096,
)

response = client.invoke([{"role": "user", "content": "Hello"}])
print(response.content)
```

## Vercel note

Python LangGraph service **does not run on Vercel Node** by default. Deploy `agents/` to:

- **Railway** / **Render** / **Fly.io** / **Modal**

Set `AGENTS_PYTHON_URL` on Vercel to that service URL.

Until then, the **TypeScript LangGraph** path (`src/agents/reportGraph.ts`) runs on Vercel with `NVIDIA_API_KEY`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Orchestrator status |
| POST | `/generate-report` | LangGraph Diagnoser → Auditor report |

## Future agents (LangGraph nodes)

- Scout — lead ingestion
- Builder — code generation
- Filmer — HeyGen (HITL gated)
- Pitcher — Meta/SMTP outreach
- Checker — Playwright + Vision-Feedback

See [PLAN.md](../PLAN.md) and [TODO.md](../TODO.md).
