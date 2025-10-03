import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDgW53fX5rKJf9BLqexBujGIABlW9cBShg";
const genAI = new GoogleGenerativeAI(API_KEY);

let model;
let messages = { history: [] };

fetch("./../../document/Dokumentasi_Chatbot_Natura.txt")
  .then(async (response) => {
    if (!response.ok) throw new Error("Gagal memuat file");
    const text = await response.text();

    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: text,
    });

    console.log("✅ systemInstruction berhasil dimuat dari file.");
  })
  .catch((error) => {
    console.error("❌ Gagal membaca file:", error);
  });

async function sendMessage() {
  console.log(messages);
  const input = document.querySelector(".chat-window input");
  const chatContainer = document.querySelector(".chat-window .chat");
  const title = document.querySelector(".chat-window .title");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  if (title) {
    title.classList.add("hide");
    setTimeout(() => title.remove(), 300);
  }

  try {
    input.value = "";

    chatContainer.insertAdjacentHTML("afterbegin", `
      <div class="user">
        <h1>Anda</h1>
        <p>${userMessage}</p>
      </div>
    `);

    chatContainer.insertAdjacentHTML("afterbegin", `
      <div class="model">
        <h1>Natura</h1>
        <p><span class="loader"></span></p>
      </div>
    `);

    const modelBubble = chatContainer.querySelector(".chat-window .model p");
    const loader = modelBubble.querySelector(".loader");

    const chat = model.startChat(messages);
    const result = await chat.sendMessageStream(userMessage);

    if (loader) loader.remove();
    let fullText = "";

    for await (const chunk of result.stream) {
      fullText += chunk.text();
    }
    fullText = fullText
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/```/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?(html|head|body|title)[^>]*>/gi, "");

    modelBubble.insertAdjacentHTML("beforeend", fullText);

    messages.history.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    messages.history.push({
      role: "model",
      parts: [{ text: modelBubble.innerHTML }],
    });

  } catch (error) {
    console.error("Gagal kirim pesan:", error);
    const loader = document.querySelector(".chat-window .model");
    
    if (typeof loader !== "undefined" && loader) loader.remove();

    chatContainer.insertAdjacentHTML("afterbegin", `
      <div class="error">
        <p>The message could not be sent. Please try again.</p>
      </div>
    `);
  }
}



document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-window .input-area input")
.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
