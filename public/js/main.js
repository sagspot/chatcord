const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  // console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg;

  //   Emit message to server
  socket.emit("chatMessage", msg.value);

  // Clear input
  msg.value = "";
  msg.focus();
});

// Output mesage to DOM
function outputMessage(message) {
  const isCurrentUser = username === message.username;
  const isBot = message.username === "Bot";

  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(isCurrentUser ? "float-right" : "float-left");
  isBot ? (div.className = "bot") : "";

  div.innerHTML = `<p class="meta"><span>${message.username}</span> <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  chatMessages.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
