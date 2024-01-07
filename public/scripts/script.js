document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Add initial welcome messages
  const initialMessages = [
    { text: "Welcome to KJ Somaiya College of Engineering", sender: "bot" },
    { text: "Send us a hi!!", sender: "bot" }
  ];

  initialMessages.forEach((message) => {
    displayMessage(message.text, message.sender);
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });


  function onSignIn(googleUser) {
    // Get user details and perform actions (e.g., send user info to server)
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    // You can send the user information to your server for further processing
    // Example: sendUserInfoToServer(profile);
  }


  function sendMessage() {
    const message = userInput.value.trim();
    if (message !== "") {
      displayMessage(message, "user");
      userInput.value = "";
      setTimeout(() => {
        const botResponse = "Thank you for your message!";
        displayMessage(botResponse, "bot");
      }, 1000);
    }
  }

  function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const textDiv = document.createElement("div");
    textDiv.textContent = message;

    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Calculate and set bubble width based on text content
    const bubbleWidth = textDiv.offsetWidth + 20; // Adjust as needed
    messageDiv.style.width = `${bubbleWidth}px`;
  }
});

