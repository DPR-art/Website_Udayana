let messages = { history: [] };

function cleanOutput(text) {
  return text
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/```/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?(html|head|body|title)[^>]*>/gi, "");
}

async function sendMessage() {
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

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, history: messages.history }),
    });

    if (!response.ok || !response.body) throw new Error("Gagal menghubungi server");

    if (loader) loader.remove();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
      modelBubble.innerHTML = cleanOutput(fullText);
    }

    fullText = cleanOutput(fullText);
    modelBubble.innerHTML = fullText;

    messages.history.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    messages.history.push({
      role: "model",
      parts: [{ text: fullText }],
    });

  } catch (error) {
    console.error("Gagal kirim pesan:", error);
    const modelWrapper = document.querySelector(".chat-window .model");

    if (modelWrapper) modelWrapper.remove();

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
