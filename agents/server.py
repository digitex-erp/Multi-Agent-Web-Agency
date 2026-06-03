"""
LangGraph + ChatNVIDIA orchestrator — the agent heart of Multi-Agent Web Agency.

Run locally:
  cd agents
  pip install -r requirements.txt
  copy .env.example .env   # set NVIDIA_API_KEY + NVIDIA_MODEL
  uvicorn server:app --host 0.0.0.0 --port 8001

Then set in Node .env:
  AGENTS_PYTHON_URL=http://localhost:8001
"""

from __future__ import annotations

import os
from typing import Any, TypedDict

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="Agentic Web Agency — LangGraph Orchestrator")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_model_name() -> str:
    return os.getenv("NVIDIA_MODEL", "meta/llama-3.1-8b-instruct")


def get_chat_nvidia():
    from langchain_nvidia_ai_endpoints import ChatNVIDIA

    api_key = os.getenv("NVIDIA_API_KEY", "")
    if not api_key or "MY_NVIDIA" in api_key:
        raise RuntimeError("NVIDIA_API_KEY is not configured")

    return ChatNVIDIA(
        model=get_model_name(),
        api_key=api_key,
        temperature=float(os.getenv("NVIDIA_TEMPERATURE", "0.7")),
        top_p=float(os.getenv("NVIDIA_TOP_P", "0.95")),
        max_tokens=int(os.getenv("NVIDIA_MAX_TOKENS", "4096")),
    )


class ReportState(TypedDict):
    system_prompt: str
    user_prompt: str
    diagnoser_notes: str
    report: str


def diagnoser_node(state: ReportState) -> ReportState:
    llm = get_chat_nvidia()
    messages = [
        {
            "role": "system",
            "content": (
                "You are the Diagnoser agent in a LangGraph multi-agent web agency. "
                "Extract top operational risks and bottlenecks as bullet points."
            ),
        },
        {"role": "user", "content": state["user_prompt"]},
    ]
    result = llm.invoke(messages)
    return {**state, "diagnoser_notes": result.content}


def auditor_node(state: ReportState) -> ReportState:
    llm = get_chat_nvidia()
    messages = [
        {"role": "system", "content": state["system_prompt"]},
        {
            "role": "user",
            "content": (
                f"Diagnoser notes:\n{state['diagnoser_notes']}\n\n"
                f"Pipeline data:\n{state['user_prompt']}\n\n"
                "Write the full Strategic Optimization & Pipeline Report in Markdown."
            ),
        },
    ]
    result = llm.invoke(messages)
    return {**state, "report": result.content}


workflow = StateGraph(ReportState)
workflow.add_node("diagnoser", diagnoser_node)
workflow.add_node("auditor", auditor_node)
workflow.add_edge(START, "diagnoser")
workflow.add_edge("diagnoser", "auditor")
workflow.add_edge("auditor", END)
report_graph = workflow.compile()


class GenerateReportRequest(BaseModel):
    systemPrompt: str
    userPrompt: str
    leads: list[Any] = Field(default_factory=list)
    metrics: dict[str, Any] = Field(default_factory=dict)


@app.get("/health")
def health():
    configured = bool(os.getenv("NVIDIA_API_KEY")) and "MY_NVIDIA" not in os.getenv("NVIDIA_API_KEY", "")
    return {
        "status": "ok",
        "engine": "langgraph_python",
        "chat_nvidia": configured,
        "model": get_model_name(),
    }


@app.post("/generate-report")
def generate_report(body: GenerateReportRequest):
    try:
        result = report_graph.invoke(
            {
                "system_prompt": body.systemPrompt,
                "user_prompt": body.userPrompt,
                "diagnoser_notes": "",
                "report": "",
            }
        )
        return {
            "success": True,
            "report": result["report"],
            "source": "langgraph_python",
            "model": get_model_name(),
        }
    except Exception as exc:  # noqa: BLE001
        return {"success": False, "error": str(exc)}
