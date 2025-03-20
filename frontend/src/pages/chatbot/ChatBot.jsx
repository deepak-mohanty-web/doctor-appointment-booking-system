import { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "./CompanyInfo";
import { doctors } from "./Doctor";
import { symptomToSpecialty } from "./Doctor"; // Import the symptom mapping

function ChatBot() {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();

  const getDoctorRecommendation = (userMessage) => {
    // Check each symptom in our mapping
    for (let symptom in symptomToSpecialty) {
      if (userMessage.toLowerCase().includes(symptom.toLowerCase())) {
        const specialty = symptomToSpecialty[symptom];

        // Find all doctors with this specialty
        const availableDoctors = doctors.filter(
          (doctor) => doctor.speciality === specialty
        );

        if (availableDoctors.length > 0) {
          let response = `I'm sorry to hear you're experiencing ${symptom}. Based on your symptoms, I recommend seeing a ${specialty}. We have ${availableDoctors.length} specialists available:\n\n`;

          // List all available doctors with their fees
          availableDoctors.forEach((doctor) => {
            response += `* Dr. ${doctor.name} (£${doctor.fees} consultation fee)\n`;
          });

          response += `\nWould you like to book an appointment with one of them? You can view their availability and book directly through our system.`;

          // Add urgent advice for fever
          if (
            symptom === "fever" &&
            userMessage.toLowerCase().includes("high fever")
          ) {
            response += ` If your fever is very high (above 103°F/39.5°C) or accompanied by severe symptoms, please consider seeking immediate medical attention.`;
          }

          return response;
        }
      }
    }
    return null;
  };

  const generateBotResponse = async (history) => {
    const userMessage = history[history.length - 1].text;
    const doctorResponse = getDoctorRecommendation(userMessage);

    if (doctorResponse) {
      // Remove the thinking message first
      setChatHistory((prev) => prev.filter((msg) => !msg.isThinking));
      // Then add the doctor recommendation
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: doctorResponse },
      ]);
      return;
    }

    const updateHistory = (text, isError = false) => {
      // Remove the thinking message first
      setChatHistory((prev) => prev.filter((msg) => !msg.isThinking));
      // Then add the actual response
      setChatHistory((prev) => [...prev, { role: "model", text, isError }]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong..");
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatBot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span>
          <img src={assets.ChatBotToggler} alt="" />
        </span>
        <span>
          {" "}
          <img src={assets.Close} alt="" />
        </span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <img src={assets.ChatBotLogo} alt="ChatBot Logo" />
            <h2 className="logo-text">ChatBot</h2>
          </div>
          <button
            className="close-btn"
            onClick={() => setShowChatBot((prev) => !prev)}
          >
            <MdOutlineKeyboardArrowDown />
          </button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <img src={assets.ChatBotLogo} alt="ChatBot" />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage chat={chat} key={index} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
