const express = require("express");

const app = express();
app.use(express.json());

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://ollama:11434";

app.post("/generate", async (req, res) => {
  const { prompt, model = "qwen2.5:1.5b" } = req.body;

  if (!prompt) {
    return res.status(422).json({ detail: "prompt is required" });
  }

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.json({ output: data.response });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`ollama-api listening on port ${PORT}`);
});
