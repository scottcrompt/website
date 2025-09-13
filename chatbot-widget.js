(function () {
  // ✅ Default config (can be overridden from window.chatbotConfig)
  const config = window.chatbotConfig || {};
  const apiUrl = config.apiUrl || "https://makeitsimpl.app.n8n.cloud/webhook/chat";
  const websiteUrl = config.websiteUrl || "unknown-site";
  const headers = {
    "Content-Type": "application/json",
    ...(config.headers || {})
  };

  // ✅ Create floating chat button
  const button = document.createElement("div");
  button.innerText = "💬 Chat";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.background = "#4A90E2";
  button.style.color = "white";
  button.style.padding = "12px 16px";
  button.style.borderRadius = "24px";
  button.style.cursor = "pointer";
  button.style.fontFamily = "Arial, sans-serif";
  button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  document.body.appendChild(button);

  // ✅ Create chat window
  const chatWindow = document.createElement("div");
  chatWindow.style.position = "fixed";
  chatWindow.style.bottom = "70px";
  chatWindow.style.right = "20px";
  chatWindow.style.width = "300px";
  chatWindow.style.height = "400px";
  chatWindow.style.background = "white";
  chatWindow.style.border = "1px solid #ddd";
  chatWindow.style.borderRadius = "8px";
  chatWindow.style.display = "none";
  chatWindow.style.flexDirection = "column";
  chatWindow.style.overflow = "hidden";
  chatWindow.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(chatWindow);

  // ✅ Chat area
  const messagesDiv = document.createElement("div");
  messagesDiv.style.flex = "1";
  messagesDiv.style.padding = "10px";
  messagesDiv.style.overflowY = "auto";
  chatWindow.appendChild(messagesDiv);

  // ✅ Input area
  const inputDiv = document.createElement("div");
  inputDiv.style.display = "flex";
  inputDiv.style.borderTop = "1px solid #ddd";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask me anything...";
  input.style.flex = "1";
  input.style.padding = "10px";
  input.style.border = "none";
  inputDiv.appendChild(input);
  const sendBtn = document.createElement("button");
  sendBtn.innerText = "Send";
  sendBtn.style.border = "none";
  sendBtn.style.background = "#4A90E2";
  sendBtn.style.color = "white";
  sendBtn.style.padding = "10px 16px";
  sendBtn.style.cursor = "pointer";
  inputDiv.appendChild(sendBtn);
  chatWindow.appendChild(inputDiv);

  // ✅ Toggle chat window
  button.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
  };

  // ✅ Append message to chat
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.style.margin = "6px 0";
    msg.style.padding = "8px";
    msg.style.borderRadius = "6px";
    msg.style.maxWidth = "80%";
    msg.style.wordWrap = "break-word";
    msg.innerText = text;

    if (sender === "user") {
      msg.style.background = "#DCF8C6";
      msg.style.alignSelf = "flex-end";
    } else {
      msg.style.background = "#F1F0F0";
      msg.style.alignSelf = "flex-start";
    }

    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // ✅ Send query to webhook
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: text,
          websiteUrl
        })
      });

      const data = await response.json();
      addMessage("bot", data.answer || "No response");
    } catch (err) {
      addMessage("bot", "⚠️ Error: " + err.message);
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
})();
