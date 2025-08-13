export const groqResponse = async function (
  groqApiKey,
  max_completion_tokens,
  promptType,
  selectedCode
) {
  if (!groqApiKey) {
    throw new Error("Groq API key is required");
  }
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0,
        max_completion_tokens: max_completion_tokens || 128,
        messages: [
          { role: "system", content: promptType.trim() },
          { role: "user", content: selectedCode },
        ],
      }),
    }
  );

  if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim() || '';
  console.log(" >> worked fine <<")
  return content;
};
