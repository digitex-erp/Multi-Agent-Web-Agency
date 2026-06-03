/**
 * Proxy to Python LangGraph + ChatNVIDIA orchestrator (agents/server.py).
 * Set AGENTS_PYTHON_URL=http://localhost:8001 when running the Python service.
 */

export interface PythonReportPayload {
  systemPrompt: string;
  userPrompt: string;
  leads?: unknown[];
  metrics?: Record<string, unknown>;
}

export interface PythonReportResponse {
  success: boolean;
  report?: string;
  source?: string;
  model?: string;
  error?: string;
}

export function getPythonAgentsUrl(): string | null {
  const url = process.env.AGENTS_PYTHON_URL?.trim();
  if (!url || url.includes('MY_')) return null;
  return url.replace(/\/$/, '');
}

export async function generateReportViaPythonAgents(
  payload: PythonReportPayload
): Promise<PythonReportResponse | null> {
  const baseUrl = getPythonAgentsUrl();
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as PythonReportResponse;
    if (!response.ok) {
      return { success: false, error: data.error ?? `Python agents error ${response.status}` };
    }
    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Python agents unreachable';
    console.warn('Python LangGraph service unavailable:', message);
    return null;
  }
}
