
(function () {
  // ======= Config =======
  const config = window.chatbotConfig || {};
  const apiUrl = config.apiUrl || "https://makeitsimpl.app.n8n.cloud/webhook/chat";
  const websiteUrl = config.websiteUrl || "unknown-site";
  const headers = {
    "Content-Type": "application/json",
    ...(config.headers || {}),
  };

  // ======= Styles =======
  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --cb-black: #111;
      --cb-white: #fff;
      --cb-gray-1: #f5f5f5;
      --cb-gray-2: #e5e5e5;
      --cb-gray-3: #bdbdbd;
      --cb-shadow: 0 10px 30px rgba(0,0,0,0.15);
      --cb-radius: 16px;
      --cb-font: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      --cb-z: 2147483000;
    }

    .cb-button {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: var(--cb-z);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: var(--cb-black);
      color: var(--cb-white);
      border-radius: 50%;
      cursor: pointer;
      user-select: none;
      box-shadow: var(--cb-shadow);
      transition: transform .15s ease, opacity .2s ease;
    }
    .cb-button:hover { transform: translateY(-1px); }
    .cb-button:active { transform: translateY(0); }
    .cb-button svg {
      width: 26px;
      height: 26px;
      fill: var(--cb-white);
    }

    .cb-window {
      position: fixed;
      right: 20px;
      bottom: 90px;
      width: 360px;
      max-width: calc(100vw - 40px);
      height: 520px;
      background: var(--cb-white);
      border: 1px solid var(--cb-gray-2);
      border-radius: 20px;
      box-shadow: var(--cb-shadow);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: var(--cb-font);
      z-index: var(--cb-z);
      opacity: 0;
      transform: translateY(6px);
      transition: opacity .2s ease, transform .2s ease;
    }
    .cb-window.cb-open {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    .cb-header {
      height: 56px;
      background: var(--cb-black);
      color: var(--cb-white);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px 0 16px;
    }
    .cb-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: .3px;
    }
    .cb-close {
      all: unset;
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      cursor: pointer;
    }
    .cb-close:hover { background: rgba(255,255,255,0.08); }

    .cb-messages {
      flex: 1;
      padding: 14px;
      overflow-y: auto;
      background: var(--cb-gray-1);
    }
    .cb-messages::-webkit-scrollbar { width: 10px; }
    .cb-messages::-webkit-scrollbar-thumb {
      background: var(--cb-gray-2);
      border-radius: 999px;
      border: 2px solid var(--cb-gray-1);
    }

    .cb-row { display: flex; margin: 8px 0; }
    .cb-row.cb-user { justify-content: flex-end; }
    .cb-bubble {
      max-width: 82%;
      padding: 10px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      border: 1px solid transparent;
    }
    .cb-user .cb-bubble {
      background: var(--cb-black);
      color: var(--cb-white);
      border-color: var(--cb-black);
      border-bottom-right-radius: 4px;
    }
    .cb-bot .cb-bubble {
      background: var(--cb-white);
      color: var(--cb-black);
      border-color: var(--cb-gray-2);
      border-bottom-left-radius: 4px;
    }

    .cb-typing {
      padding: 8px 12px;
      background: var(--cb-white);
      border: 1px solid var(--cb-gray-2);
      border-radius: 12px;
      width: 54px;
      display: inline-flex;
      gap: 6px;
    }
    .cb-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--cb-black);
      opacity: .3;
      animation: cbBlink 1.2s infinite;
    }
    .cb-dot:nth-child(2) { animation-delay: .15s; }
    .cb-dot:nth-child(3) { animation-delay: .3s; }
    @keyframes cbBlink {
      0%, 100% { opacity: .2; transform: translateY(0); }
      50% { opacity: 1; transform: translateY(-2px); }
    }

    .cb-input {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      border-top: 1px solid var(--cb-gray-2);
      background: var(--cb-white);
    }
    .cb-text {
      flex: 1;
      height: 40px;
      padding: 0 12px;
      border: 1px solid var(--cb-gray-2);
      border-radius: 12px;
      background: var(--cb-white);
      color: var(--cb-black);
      font-size: 14px;
      outline: none;
    }
    .cb-text::placeholder { color: #777; }
    .cb-send {
      height: 40px;
      padding: 0 14px;
      border-radius: 12px;
      border: 1px solid var(--cb-black);
      background: var(--cb-black);
      color: var(--cb-white);
      font-weight: 600;
      cursor: pointer;
      transition: transform .15s ease, opacity .2s ease;
    }
    .cb-send:hover { transform: translateY(-1px); }
    .cb-send:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .cb-error {
      color: var(--cb-black);
      background: var(--cb-white);
      border: 1px dashed var(--cb-black);
    }

    @media (max-width: 480px) {
      .cb-window { right: 10px; left: 10px; width: auto; height: 70vh; }
      .cb-button { right: 12px; bottom: 12px; }
    }
  `;
  document.head.appendChild(style);

  // ======= Button with Robot SVG =======
  const button = document.createElement("button");
  button.className = "cb-button";
  button.setAttribute("aria-label", "Open chat");
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2a1 1 0 0 0-1 1v1.07A8.002 8.002 0 0 0 4 12v6a2 2 0 0 0 2 2h1v2h2v-2h6v2h2v-2h1a2 2 0 0 0 2-2v-6a8.002 8.002 0 0 0-7-7.93V3a1 1 0 0 0-1-1zm0 4a6 6 0 0 1 6 6v6H6v-6a6 6 0 0 1 6-6zm-2 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
    </svg>
  `;
  document.body.appendChild(button);

  // ======= Window =======
  const chatWindow = document.createElement("section");
  chatWindow.className = "cb-window";
  chatWindow.setAttribute("role", "dialog");
  chatWindow.setAttribute("aria-label", "Chat widget");

  const header = document.createElement("header");
  header.className = "cb-header";
  const title = document.createElement("div");
  title.className = "cb-title";
  title.textContent = (config.title || "Chat with us").toUpperCase();
  const closeBtn = document.createElement("button");
  closeBtn.className = "cb-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = "✕";
  header.appendChild(title);
  header.appendChild(closeBtn);

  const messages = document.createElement("div");
  messages.className = "cb-messages";

  const inputWrap = document.createElement("div");
  inputWrap.className = "cb-input";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "cb-text";
  input.placeholder = "Ask me anything…";
  const sendBtn = document.createElement("button");
  sendBtn.className = "cb-send";
  sendBtn.textContent = "Send";
  inputWrap.appendChild(input);
  inputWrap.appendChild(sendBtn);

  chatWindow.appendChild(header);
  chatWindow.appendChild(messages);
  chatWindow.appendChild(inputWrap);
  document.body.appendChild(chatWindow);

  // ======= Open / Close =======
  const toggle = (forceOpen) => {
    const willOpen = forceOpen ?? !chatWindow.classList.contains("cb-open");
    if (willOpen) chatWindow.classList.add("cb-open");
    else chatWindow.classList.remove("cb-open");
  };
  button.onclick = () => toggle(true);
  closeBtn.onclick = () => toggle(false);

  // ======= Message helpers =======
  function addBubble(sender, text, extraClass = "") {
    const row = document.createElement("div");
    row.className = `cb-row cb-${sender}`;
    const bubble = document.createElement("div");
    bubble.className = `cb-bubble ${extraClass}`.trim();
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  function addTyping() {
    const row = document.createElement("div");
    row.className = "cb-row cb-bot";
    const wrap = document.createElement("div");
    wrap.className = "cb-typing";
    wrap.innerHTML = `<span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span>`;
    row.appendChild(wrap);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  // ======= Send logic =======
  let sending = false;

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || sending) return;

    sending = true;
    sendBtn.disabled = true;

    addBubble("user", text);
    input.value = "";

    const typingRow = addTyping();

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: text, websiteUrl }),
      });

      if (!response.ok) throw new Error(`Server responded ${response.status}`);

      const data = await response.json();
      const answer = data.answer || "No response.";
      messages.removeChild(typingRow);
      addBubble("bot", answer);
    } catch (err) {
      messages.removeChild(typingRow);
      addBubble(
        "bot",
        "Sorry, I couldn't reach the server. Please try again in a moment.",
        "cb-error"
      );
      console.warn("[ChatWidget] fetch error:", err);
    } finally {
      sending = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();

