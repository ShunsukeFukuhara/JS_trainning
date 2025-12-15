// 事前にmarkedライブラリを読み込んでおく際、セキュリティのためにヘッダーIDやマングリングを無効化しておく
// eslint-disable-next-line no-undef
marked.setOptions({
  mangle: false,
  headerIds: false,
});

const form = document.querySelector("form");
const input = document.getElementById("userInput");
const chatWIndow = document.getElementById("chatWindow");

const messages = [];

const safeToParseMarkdown = (text) =>
  !text.endsWith("`") && !text.endsWith("\n-") && !text.endsWith("|");

const addMessage = (className, text = "") => {
  const box = document.createElement("div");
  box.className = className;
  box.textContent = text;

  chatWIndow.appendChild(box);
  chatWIndow.scrollTop = chatWIndow.scrollHeight;

  return box; // streaming 用
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userInput = input.value.trim();
  if (!userInput) return;

  input.value = "";

  // 自分のメッセージ
  addMessage("myMessage", userInput);
  messages.push({ role: "user", content: userInput });

  // Bot のメッセージ箱（空）
  const botBox = addMessage("botMessage", "…");

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma:2b",
      messages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    botBox.textContent = "エラーが発生しました";
    return;
  }

  // boxの中身を一旦クリア
  botBox.textContent = "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  // 受け取ったレスポンスが途中で切れないようにバッファを使って処理する
  let buffer = "";
  // 最終的なテキストを格納して、安全な時はMarkdownに変換する
  let fullText = "";
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line) continue;

      let json;
      try {
        json = JSON.parse(line);
      } catch {
        continue;
      }

      if (json.message?.content) {
        fullText += json.message.content;

        if (safeToParseMarkdown(fullText)) {
          // eslint-disable-next-line no-undef
          botBox.innerHTML = marked.parse(fullText);
        } else {
          botBox.textContent = fullText;
        }
      }

      if (json.done) {
        // eslint-disable-next-line no-undef
        botBox.innerHTML = marked.parse(fullText);
        messages.push({ role: "assistant", content: fullText });
        return;
      }
    }
  }
});

// Enter で送信、Shift+Enterで改行
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});
