(function () {
  // Create floating button
  const button = document.createElement("div");
  button.innerHTML = "💬";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.width = "50px";
  button.style.height = "50px";
  button.style.background = "#333";
  button.style.color = "#fff";
  button.style.borderRadius = "50%";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";
  document.body.appendChild(button);

  // Create chat window
  const chatWindow = document.createElement("div");
  chatWindow.style.position = "fixed";
  chatWindow.style.bottom = "80px";
  chatWindow.style.right = "20px";
  chatWindow.style.width = "300px";
  chatWindow.style.height = "400px";
  chatWindow.style.background = "#fff";
  chatWindow.style.border = "1px solid #ccc";
  chatWindow.style.borderRadius = "10px";
  chatWindow.style.display = "none";
  chatWindow.style.flexDirection = "column";
  chatWindow.style.overflow = "hidden";
  chatWindow.style.zIndex = "9999";
  document.body.appendChild(chatWindow);

  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  chatWindow.appendChild(messages);

  const inputWrapper = document.createElement("div");
  inputWrapper.style.display = "flex";
  inputWrapper.style.borderTop = "1px solid #ccc";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask me anything...";
  input.style.flex = "1";
  input.style.border = "none";
  input.style.padding = "10px";
  inputWrapper.appendChild(input);
  const send = document.createElement("button");
  send.innerText = "Send";
  inputWrapper.appendChild(send);
  chatWindow.appendChild(inputWrapper);

  function addMessage(text, from) {
    const msg = document.createElement("div");
    msg.innerText = text;
    msg.style.margin = "5px 0";
    msg.style.textAlign = from === "user" ? "right" : "left";
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;
    addMessage(userText, "user");
    input.value = "";

    const res = await fetch(window.chatbotConfig.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        website_url: window.chatbotConfig.websiteUrl,
        query: userText,
      }),
    });
    const data = await res.json();
    addMessage(data.answer, "bot");
  }

  send.onclick = sendMessage;
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  button.onclick = () => {
    chatWindow.style.display =
      chatWindow.style.display === "none" ? "flex" : "none";
  };
})();
