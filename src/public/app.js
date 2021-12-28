// Put all your frontend code here.
const messageList = document.querySelector("ul");

const socket = new WebSocket(`ws://${window.location.host}`);

const message = (type, payload) => JSON.stringify({ type, payload });

// 연결
socket.addEventListener("open", () => {
  console.log("Connected from Server");
});
// 종료
socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

// 채팅이 오면...
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

// 채팅 전송
const messageForm = document.querySelector("#message");
const messageInput = messageForm.querySelector("input");
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.send(message("new_message", messageInput.value));
  messageInput.value = "";
});

// 이름 바꾸기
const nickForm = document.querySelector("#nick");
const nickInput = nickForm.querySelector("input");
nickForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.send(message("nick", nickInput.value));
  nickInput.value = "";
});
console.log("test");
