const faq = require('../utils/faq.json');
const { callOpenAIChat } = require('../utils/ragClient');

// Simple keyword-based retrieval + optional LLM refinement
exports.ask = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const q = question.toLowerCase();

    // score each FAQ entry by keyword overlap
    const scored = faq.map((item) => {
      const text = (item.question + ' ' + item.answer).toLowerCase();
      let score = 0;
      const words = q.split(/[^a-z0-9]+/).filter(Boolean);
      for (const w of words) {
        if (text.includes(w)) score += 1;
      }
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.filter(s => s.score > 0).slice(0, 4).map(s => s.item);

    // Build context from top matches
    let context = '';
    if (top.length) {
      context = top.map((t, idx) => `Snippet ${idx + 1}: Q: ${t.question}\nA: ${t.answer}`).join('\n\n');
    }

    // Use provider if configured
    const provider = process.env.RAG_PROVIDER || 'openai';
    let finalAnswer = null;
    let providerResp = null;

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const systemPrompt = 'You are a helpful support assistant. Use the provided snippets as context to answer the user question. If the snippets fully answer the question, do not hallucinate extra facts. Cite which snippet(s) you used.';
      const userPrompt = `CONTEXT:\n${context}\n\nUSER QUESTION:\n${question}\n\nAnswer concisely and mention which snippet numbers you used.`;
      providerResp = await callOpenAIChat(systemPrompt, userPrompt, process.env.OPENAI_API_KEY, process.env.RAG_OPENAI_MODEL || 'gpt-3.5-turbo');
      if (providerResp && providerResp.choices && providerResp.choices[0]) {
        finalAnswer = providerResp.choices[0].message.content;
      }
    }

    // Fallback: if no provider or provider failed, produce a simple synthesized reply from matched snippets
    if (!finalAnswer) {
      if (top.length) {
        finalAnswer = top.map((t, i) => `${i + 1}. ${t.question} — ${t.answer}`).join('\n\n');
      } else {
        finalAnswer = "Sorry, I couldn't find a matching FAQ entry. Please contact support via the Contact Us page.";
      }
    }

    return res.status(200).json({ answer: finalAnswer, sources: top });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
