import { sendRequest, RequestBody } from "./client.js";

const buttons = document.querySelectorAll(".send-button");
const inputs = document.querySelectorAll(".request-input");
const waitingContainers = document.querySelectorAll(".waiting");
const responseContainers = document.querySelectorAll(".response");
const errorContainers = document.querySelectorAll(".error");

buttons.forEach((button, index) => {
  button.addEventListener("click", async () => {
    responseContainers[index].textContent = "";
    errorContainers[index].textContent = "";
    const body = new RequestBody(inputs[index].value);
    try {
      waitingContainers[index].textContent = "Waiting for response...";
      button.disabled = true;
      const response = await sendRequest(body);
      responseContainers[index].textContent = `Response: ${response.message}`;
    } catch (error) {
      errorContainers[index].textContent = `Error: ${error.message}`;
    } finally {
      waitingContainers[index].textContent = "";
      button.disabled = false;
    }
  });
});
