import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { getNimChatModel, getNimModel, isNimConfigured } from './nimChatModel.ts';

/** LangGraph state for Scout → Diagnoser → Auditor report pipeline (TS runtime) */
const ReportState = Annotation.Root({
  systemPrompt: Annotation<string>,
  userPrompt: Annotation<string>,
  diagnoserNotes: Annotation<string>,
  report: Annotation<string>,
});

async function diagnoserNode(state: typeof ReportState.State) {
  const model = getNimChatModel({ maxTokens: 1536, temperature: 0.4 });
  if (!model) {
    return { diagnoserNotes: 'Diagnoser skipped — NVIDIA_API_KEY not configured.' };
  }

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are the Diagnoser agent in a LangGraph multi-agent web agency.
Extract the top operational risks, budget leakages, and bottlenecks from the operator data.
Respond in concise bullet points only.`,
    ],
    ['human', '{input}'],
  ]);

  const result = await prompt.pipe(model).invoke({ input: state.userPrompt });
  const content = typeof result.content === 'string' ? result.content : String(result.content);
  return { diagnoserNotes: content };
}

async function auditorNode(state: typeof ReportState.State) {
  const model = getNimChatModel({ maxTokens: 4096, temperature: 0.7 });
  if (!model) {
    return { report: '' };
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', '{systemPrompt}'],
    [
      'human',
      `Diagnoser agent notes:
{diagnoserNotes}

Operator pipeline data:
{userPrompt}

Write the complete Strategic Optimization & Pipeline Report in Markdown.`,
    ],
  ]);

  const result = await prompt.pipe(model).invoke({
    systemPrompt: state.systemPrompt,
    diagnoserNotes: state.diagnoserNotes,
    userPrompt: state.userPrompt,
  });

  const content = typeof result.content === 'string' ? result.content : String(result.content);
  return { report: content };
}

const workflow = new StateGraph(ReportState)
  .addNode('diagnoser', diagnoserNode)
  .addNode('auditor', auditorNode)
  .addEdge(START, 'diagnoser')
  .addEdge('diagnoser', 'auditor')
  .addEdge('auditor', END);

export const strategicReportGraph = workflow.compile();

export async function runStrategicReportGraph(
  systemPrompt: string,
  userPrompt: string
): Promise<{ report: string | null; engine: 'langgraph_ts' | 'unconfigured' }> {
  if (!isNimConfigured()) {
    return { report: null, engine: 'unconfigured' };
  }

  console.log(`LangGraph TS report pipeline → Nvidia NIM (${getNimModel()})`);

  const result = await strategicReportGraph.invoke({
    systemPrompt,
    userPrompt,
    diagnoserNotes: '',
    report: '',
  });

  return {
    report: result.report?.trim() || null,
    engine: 'langgraph_ts',
  };
}
