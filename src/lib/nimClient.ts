/**
 * LangChain / LangGraph entrypoints for Nvidia NIM.
 * Prefer Python ChatNVIDIA orchestrator when AGENTS_PYTHON_URL is set.
 */
export { getNimModel, getNimChatModel, isNimConfigured } from '../agents/nimChatModel.ts';
export { runStrategicReportGraph, strategicReportGraph } from '../agents/reportGraph.ts';
