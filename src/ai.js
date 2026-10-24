// Talks to our own /api/chat function, which holds the Groq key on the server.
export async function chat(messages, { json = false } = {}) {
  const r = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, json }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `AI request failed (${r.status})`);
  if (!json) return data.content;
  try {
    return JSON.parse(data.content);
  } catch {
    const match = data.content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned invalid JSON');
  }
}

// The slice of a document's text we send as context.
export const excerpt = (text, max = 14000) =>
  !text ? '' : text.length > max ? `${text.slice(0, max)}\n...[truncated]` : text;
