import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

let cachedInstruction;

// Rate limit sederhana per IP. Catatan: penyimpanannya in-memory, jadi hitungan
// ini hanya berlaku per instance function dan akan direset saat cold start.
// Cukup untuk meredam penyalahgunaan biasa, bukan proteksi yang ketat.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const hits = new Map();

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();

  for (const [key, timestamps] of hits) {
    const kept = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (kept.length === 0) hits.delete(key);
    else hits.set(key, kept);
  }

  const recent = hits.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT_MAX) return true;

  recent.push(now);
  hits.set(ip, recent);
  return false;
}

async function getSystemInstruction() {
  if (!cachedInstruction) {
    cachedInstruction = await readFile(
      path.join(process.cwd(), "document", "Dokumentasi_Chatbot_Natura.txt"),
      "utf-8"
    );
  }
  return cachedInstruction;
}

// Hanya menerima bentuk history yang valid, supaya isi kiriman dari browser
// tidak bisa dipakai untuk hal lain selain melanjutkan percakapan.
function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && (item.role === "user" || item.role === "model"))
    .map((item) => ({
      role: item.role,
      parts: [{ text: String(item.parts?.[0]?.text ?? "").slice(0, 8000) }],
    }))
    .slice(-20);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isRateLimited(getClientIp(req))) {
    res.setHeader("Retry-After", String(RATE_LIMIT_WINDOW_MS / 1000));
    return res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." });
  }

  if (!genAI) {
    console.error("GEMINI_API_KEY belum diset di environment variable.");
    return res.status(500).json({ error: "Server belum dikonfigurasi" });
  }

  try {
    const { message, history } = req.body ?? {};
    const userMessage = typeof message === "string" ? message.trim() : "";

    if (!userMessage) return res.status(400).json({ error: "Pesan kosong" });
    if (userMessage.length > 8000) return res.status(400).json({ error: "Pesan terlalu panjang" });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: await getSystemInstruction(),
    });

    const chat = model.startChat({ history: sanitizeHistory(history) });
    const result = await chat.sendMessageStream(userMessage);

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    });

    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }
    res.end();
  } catch (error) {
    console.error("Gagal memproses permintaan:", error);
    if (res.headersSent) return res.end();
    res.status(500).json({ error: "Gagal memproses permintaan" });
  }
}
