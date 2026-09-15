import fs from "fs"
import path from "path"

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "/prompt/comments.prompt.md"),
  "utf-8"
)

export async function generateAdvice(entryText: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: entryText },
      ],
      temperature: 0.9,
      max_completion_tokens: 200,
    }),
  })

  if (!res.ok) return ""

  const data = await res.json()
  return data.choices[0].message.content.trim()
}
