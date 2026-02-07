interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { text } = (await context.request.json()) as { text: string };

  if (!text || typeof text !== "string") {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  const apiKey = context.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `あなたは優秀な文章リライターです。以下のテキストを、意味を変えずに、より読みやすく自然な文章に改善してください。改善後のテキストのみを返してください。\n\n${text}`,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json(
      { error: `Gemini API error: ${res.status}`, details: err },
      { status: 502 }
    );
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const rewritten =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return Response.json({ rewritten });
};
