import React, { useRef } from "react";
import { IoMdSend } from "react-icons/io";

function ChatForm({ setChatHistory, generateBotResponse, chatHistory }) {
  const inputRef = useRef();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    inputRef.current.value = "";
    if (!userMessage) return;

    // Update chat history with user's message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // Add thinking message
    setChatHistory((history) => [
      ...history,
      { role: "model", text: "Thinking..", isThinking: true },
    ]);

    // Wait for 1 second to show the thinking message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate response (this will replace the thinking message)
    generateBotResponse([
      ...chatHistory,
      {
        role: "user",
        text: `Using the details provided above, please address this query: ${userMessage}`,
      },
    ]);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleOnSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message...."
        className="message-input"
        required
      />
      <button>
        <IoMdSend className="m-auto" />
      </button>
    </form>
  );
}

export default ChatForm;
