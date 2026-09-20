const axios = require('axios');

async function callOpenAIChat(systemPrompt, userPrompt, apiKey, model = 'gpt-3.5-turbo') {
  if (!apiKey) return null;
  try {
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 512,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return resp.data;
  } catch (err) {
    console.error('OpenAI call failed', err?.response?.data || err.message);
    return null;
  }
}

module.exports = {
  callOpenAIChat,
};
