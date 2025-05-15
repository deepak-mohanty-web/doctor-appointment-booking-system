
import { assets } from "../../assets/assets";

function ChatMessage({ chat }) {
  return (
    !chat.hideInChat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
          chat.isError ? "error" : ""
        }`}
      >
        {chat.role === "model" && <img src={assets.ChatBotLogo} alt="" />}
        <p className="message-text">{chat.text}</p>
      </div>
    )
  );
}

export default ChatMessage;
