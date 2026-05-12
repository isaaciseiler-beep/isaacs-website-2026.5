import { getAssistantGuidance, retrieveKnowledge } from "./knowledge";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4.1-mini";

const json = (response: any, status = 200) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
};

const readBody = async (request: any) => {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const getResponseText = (payload: any) => {
  if (typeof payload.output_text === "string") return payload.output_text;

  const textParts = payload.output
    ?.flatMap((item: any) => item.content || [])
    ?.filter((part: any) => part.type === "output_text" || part.type === "text")
    ?.map((part: any) => part.text)
    ?.filter(Boolean);

  return textParts?.join("\n").trim() || "I could not generate a response.";
};

const buildInstructions = (context: string, guidance: string) => `You are Isaac Seiler's website assistant.
Answer in Isaac's first person only when it sounds natural, but do not invent private experiences or credentials.
Use the supplied knowledge as your source of truth for specific facts.
If the answer is not supported by the knowledge, say that you do not have enough information yet and invite the visitor to contact Isaac.
Keep answers concise, specific, and useful.
Your backend has already retrieved the most relevant knowledge chunks below. Treat them as the indexed-search results.

${guidance ? `Assistant guidance:\n${guidance}\n\n` : ""}Retrieved knowledge:
${context}`;

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    json(response, 405);
    response.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    json(response, 500);
    response.end(JSON.stringify({ error: "OPENAI_API_KEY is not configured." }));
    return;
  }

  try {
    const body = await readBody(request);
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
    const userMessages = messages.filter((message) => message.role === "user");
    const latestMessage = userMessages[userMessages.length - 1];

    if (!latestMessage?.content?.trim()) {
      json(response, 400);
      response.end(JSON.stringify({ error: "A user message is required." }));
      return;
    }

    const retrieved = retrieveKnowledge(latestMessage.content, 6);
    const context = retrieved.length
      ? retrieved.map((chunk, index) => `[${index + 1}] ${chunk.title} (${chunk.source})\n${chunk.content}`).join("\n\n")
      : "No matching knowledge chunks were retrieved.";

    const guidance = getAssistantGuidance();

    const openAiResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || DEFAULT_MODEL,
        instructions: buildInstructions(context, guidance),
        input: messages.slice(-8).map((message) => ({
          role: message.role,
          content: message.content,
        })),
        max_output_tokens: 500,
      }),
    });

    const payload = await openAiResponse.json();
    if (!openAiResponse.ok) {
      json(response, openAiResponse.status);
      response.end(JSON.stringify({ error: payload.error?.message || "OpenAI request failed." }));
      return;
    }

    json(response);
    response.end(
      JSON.stringify({
        message: getResponseText(payload),
        sources: retrieved.map(({ id, title, source, url }) => ({ id, title, source, url })),
      }),
    );
  } catch (error) {
    json(response, 500);
    response.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unexpected server error.",
      }),
    );
  }
}
