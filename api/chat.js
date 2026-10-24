// Vercel serverless function: the only place the Groq key lives.
// Set GROQ_API_KEY in Vercel > Project > Settings > Environment Variables.
const MODEL = 'openai/gpt-oss-120b';
const MAX_BODY_CHARS = 60000;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST' });
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'AI is not configured yet: add GROQ_API_KEY in Vercel > Settings > Environment Variables, then redeploy' });

  const { messages, json } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'messages is required' });
  }
  const size = messages.reduce((n, m) => n + String(m.content || '').length, 0);
  if (size > MAX_BODY_CHARS) return res.status(413).json({ error: 'Request too large' });

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        messages: messages.map((m) => ({ role: m.role, content: String(m.content) })),
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || 'Groq request failed' });
    return res.status(200).json({ content: data.choices?.[0]?.message?.content || '' });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach Groq' });
  }
};
