document.getElementById("sendButton").addEventListener("click", async () => {
    const userInput = document.getElementById("userInput").value;
    const videoFile = document.getElementById("videoInput").files[0];
    const chatDisplay = document.getElementById("chatDisplay");

    if (!videoFile) {
        alert("Please upload a video first.");
        return;
    }
    if (!userInput) {
        alert("Please enter a question.");
        return;
    }

    // Display the user's message
    const userMessage = document.createElement("div");
    userMessage.className = "text-right mb-2";
    userMessage.textContent = `You: ${userInput}`;
    chatDisplay.appendChild(userMessage);
    document.getElementById("userInput").value = ""; // Clear input

    // Create a FormData object to send video and question
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("question", userInput);

    try {
        const response = await fetch("YOUR_API_ENDPOINT", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        // Display the model's response
        const botMessage = document.createElement("div");
        botMessage.className = "text-left mb-2";
        botMessage.textContent = `Bot: ${data.answer || "Sorry, I couldn't find an answer."}`;
        chatDisplay.appendChild(botMessage);

        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Auto-scroll to the latest message
    } catch (error) {
        console.error("Error:", error);
    }
});
