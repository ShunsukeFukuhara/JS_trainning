"use strict";

const button = document.querySelector("#send-button");
const messageContainer = document.getElementById("message-container");
button.addEventListener("click", (e) => {
  e.preventDefault();
  getMessageFromServer();
});
async function getMessageFromServer() {
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.textContent = "";
  messageContainer.appendChild(messageElement);

  // TODO: ここにサーバーとのやり取り等を実装しなさい
  button.disabled = true;

  const eventSource = new EventSource("http://localhost:3000/message");

  eventSource.onmessage = (event) => {
    const { value, done } = JSON.parse(event.data);
    if (done) {
      eventSource.close();
      button.disabled = false;
    }
    messageElement.textContent += `${value}\n`;
  };

  eventSource.onerror = (error) => {
    console.error("EventSource failed:", error);
    eventSource.close();
    button.disabled = false;
  };
}
