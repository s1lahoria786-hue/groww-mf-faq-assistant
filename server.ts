import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { SCHEMES, GENERAL_KNOWLEDGE_SUMMARY } from "./src/data/knowledgeBase.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client securely on the server
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Compile comprehensive knowledge context for system prompt
const knowledgeContext = `
${GENERAL_KNOWLEDGE_SUMMARY}

VERIFIED SCHEME DETAILS:
${SCHEMES.map(
  (s) => `
SCHEME: ${s.name} (${s.shortName})
- Category: ${s.category}
- AMC: ${s.amc}
- Fund Manager: ${s.fundManager}
- Inception Date: ${s.inceptionDate}
- Benchmark: ${s.benchmark}
- Riskometer: ${s.riskometer}
- Investment Objective: ${s.investmentObjective}
- Lock-in Period: ${s.lockInPeriod}
- Exit Load: ${s.exitLoad}
- Minimum Lumpsum: ${s.minLumpsum}
- Minimum Additional: ${s.minAdditional}
- Minimum SIP: ${s.minSip}
- Expense Ratio: Direct Plan ~${s.expenseRatioDirect}, Regular Plan ~${s.expenseRatioRegular}
- AUM: ${s.aum}
- Asset Allocation: Equity: ${s.assetAllocation.equity}; Debt: ${s.assetAllocation.debt}
- Market Cap Breakdown: Large Cap ${s.marketCapBreakup.largeCap}%, Mid Cap ${s.marketCapBreakup.midCap}%, Small Cap ${s.marketCapBreakup.smallCap}%
- Top Holdings: ${s.topHoldings.map((h) => `${h.name} (${h.percentage}%, ${h.sector})`).join(", ")}
- Top Sectors: ${s.topSectors.map((sec) => `${sec.name} (${sec.percentage}%)`).join(", ")}
- Historical CAGR Benchmark: 1Y ${s.cagrBenchmark.oneYear}, 3Y ${s.cagrBenchmark.threeYear}, 5Y ${s.cagrBenchmark.fiveYear}
- Taxation: ${s.taxation}
- Special Features: ${s.specialFeatures.join("; ")}
- Official Source Link: ${s.officialSourceUrl}
- Groww Scheme Link: ${s.growwSourceUrl}
- Verified FAQs:
${s.faqs.map((f) => `  * Q: ${f.question}\n    A: ${f.answer}\n    Source: ${f.sourceUrl}`).join("\n")}
`
).join("\n---\n")}
`;

const SYSTEM_INSTRUCTION = `
You are the "Groww Mutual Fund Facts Assistant", a premier AI-powered factual assistant dedicated exclusively to providing verified facts for SBI Mutual Fund schemes hosted on Groww.

The 4 supported schemes are:
1. SBI Bluechip Fund (Large Cap)
2. SBI Flexicap Fund (Flexi Cap)
3. SBI Long Term Equity Fund (ELSS)
4. SBI Magnum Midcap Fund (Mid Cap)

CRITICAL COMPLIANCE AND OPERATING RULES:
1. VERIFIED FACTS ONLY: Answer using verified factual information from the provided knowledge base. State facts clearly, crisply, and accurately.
2. NO ADVICE OR RECOMMENDATIONS: Strictly NO investment advice, buy/sell recommendations, portfolio suitability judgments, or return predictions. If asked "Which fund should I buy?", "Is SBI Bluechip better?", or "What returns will I get in 5 years?", firmly state that you provide verified factual information only and do not provide investment advice or return projections.
3. EXACTLY ONE RELEVANT SOURCE LINK: Every single answer MUST end with exactly one verified relevant source link on its own line:
"Source: <valid_link>"
Use one of the official SBI Mutual Fund or Groww URLs from the scheme details (e.g. https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund or https://groww.in/mutual-funds/sbi-blue-chip-fund-direct-growth).
4. UNAVAILABLE INFORMATION GUARDRAIL: If the user asks a question about unverified topics, funds outside these 4 SBI schemes, speculative forecasts, or details not present in the verified records, you MUST respond:
"I couldn't find verified information for this question."
Followed by:
"Source: https://www.sbimf.com"
5. FORMATTING: Use clean markdown with clear bullet points, concise phrasing, and tables if comparing schemes.

KNOWLEDGE BASE:
${knowledgeContext}
`;

// Helper to construct multi-turn contents
function buildContents(message: string, history?: Array<{ role: string; content?: string; text?: string }>) {
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(history)) {
    // Add up to last 8 history messages to preserve conversation context
    const recentHistory = history.slice(-8);
    for (const item of recentHistory) {
      if (item.role === "user" || item.role === "model") {
        contents.push({
          role: item.role,
          parts: [{ text: item.content || item.text || "" }],
        });
      }
    }
  }

  // Append current user message
  contents.push({
    role: "user",
    parts: [{ text: message.trim() }],
  });

  return contents;
}

// API endpoint to get schemes info
app.get("/api/schemes", (_req: Request, res: Response) => {
  res.json({ schemes: SCHEMES });
});

// Helper for retry logic on transient errors (e.g. 503, 429)
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 600): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

// Real-time Server-Sent Events (SSE) Streaming Chat API
app.post("/api/chat/stream", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error:
          "Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in Settings > Secrets.",
      });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const contents = buildContents(message, history);

    const streamResponse = await withRetry(() =>
      ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      })
    );

    let fullText = "";

    for await (const chunk of streamResponse) {
      const text = chunk.text || "";
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Extract source URL from final accumulated text
    const sourceMatch = fullText.match(/Source:\s*(https?:\/\/[^\s\)\>]+)/i);
    const sourceUrl = sourceMatch ? sourceMatch[1] : "https://www.sbimf.com";

    res.write(`data: ${JSON.stringify({ done: true, sourceUrl })}\n\n`);
    res.end();
  } catch (err: unknown) {
    console.error("Stream error:", err);
    const errMsg = err instanceof Error ? err.message : "Error streaming response";
    if (!res.headersSent) {
      res.status(500).json({ error: errMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      res.end();
    }
  }
});

// Standard Chat API endpoint (fallback & instant response)
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error:
          "Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in Settings > Secrets.",
      });
      return;
    }

    const contents = buildContents(message, history);

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      })
    );

    const replyText =
      response.text ||
      "I couldn't find verified information for this question.\nSource: https://www.sbimf.com";

    const sourceMatch = replyText.match(/Source:\s*(https?:\/\/[^\s\)\>]+)/i);
    const sourceUrl = sourceMatch ? sourceMatch[1] : "https://www.sbimf.com";

    res.json({
      reply: replyText,
      sourceUrl: sourceUrl,
    });
  } catch (err: unknown) {
    console.error("Error handling chat request:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while communicating with Gemini API.";
    res.status(500).json({ error: errorMessage });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
