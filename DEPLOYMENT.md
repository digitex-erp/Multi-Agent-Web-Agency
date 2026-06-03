# Deployment (Vercel)

## Architecture — LangChain is the heart

This project **does not skip LangChain**. Agent orchestration runs through **LangGraph**:

| Layer | Location | Stack |
|-------|----------|--------|
| **Primary** | `agents/server.py` | Python FastAPI + **LangGraph** + **`ChatNVIDIA`** (`langchain-nvidia-ai-endpoints`) |
| **Fallback** | `src/agents/reportGraph.ts` | TypeScript **LangGraph** + LangChain `ChatOpenAI` → Nvidia NIM |
| **Gateway** | `server.ts` | Express routes `/api/generate-report` to Python first, then TS, then local template |

Deploy the Python service separately (Railway, Render, Fly.io) and point Vercel at it with `AGENTS_PYTHON_URL`.

## Environment variables

### Vercel (Node dashboard + TS LangGraph fallback)

| Variable | Required | Value example |
|----------|----------|---------------|
| `NVIDIA_API_KEY` | **Yes** | Your full `nvapi-...` key from [build.nvidia.com](https://build.nvidia.com) |
| `NVIDIA_MODEL` | Optional | `meta/llama-3.1-8b-instruct` or `deepseek-ai/deepseek-v3.1` |
| `AGENTS_PYTHON_URL` | **Recommended** | `https://your-agents.railway.app` |
| `NODE_ENV` | Production | `production` |
| `APP_URL` | Recommended | `https://your-app.vercel.app` |

### Python agents service (`agents/`)

Same `NVIDIA_API_KEY` and `NVIDIA_MODEL` on the Python host. See [agents/.env.example](./agents/.env.example).

**Do not paste Python code into Vercel.** Only add **environment variable names and values** on each host.

**Not used:** ~~`GEMINI_API_KEY`~~ · ~~raw OpenAI SDK as primary orchestrator~~ (LangChain/LangGraph only)

## Lighthouse audits on Vercel

Lighthouse runs **headless Chrome** on your server. Requirements:

- Chrome/Chromium available in the runtime (works on local dev and most Node hosts)
- Vercel serverless has **limited** support for long-running Chrome — for heavy audit volume, prefer Railway, Render, or a VPS
- Optional: `CHROME_PATH` if Chrome is not on the default path (Linux)
- Optional: `LIGHTHOUSE_MAX_CONCURRENT=4` (default)

## Local `.env`

Copy `.env.example` to `.env` and set `NVIDIA_API_KEY`. Run Python agents locally:

```bash
cd agents && pip install -r requirements.txt && uvicorn server:app --port 8001
```

Set `AGENTS_PYTHON_URL=http://localhost:8001` in the root `.env`.

## Build & start

```bash
npm install
npm run build
NODE_ENV=production npm start
```

## Pull env from Vercel (optional)

```bash
npx vercel env pull .env.local
```

See [Vercel env vars docs](https://vercel.com/docs/projects/environment-variables).
