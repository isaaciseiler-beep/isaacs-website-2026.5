import { retrieveKnowledge } from "./knowledge.js";

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

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    json(response, 405);
    response.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const body = await readBody(request);
    const query = String(body.query || "").trim();
    if (!query) {
      json(response, 400);
      response.end(JSON.stringify({ error: "A search query is required." }));
      return;
    }

    const results = retrieveKnowledge(query, 4);
    const message = results.length
      ? results.map((result) => `${result.title}: ${result.content}`).join("\n\n")
      : "No matching knowledge found yet.";

    json(response);
    response.end(
      JSON.stringify({
        message,
        results: results.map(({ id, title, source, url }) => ({ id, title, source, url })),
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
