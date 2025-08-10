import { useEffect, useRef, useState } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { assets } from '../../assets/assets'
import ChatForm from './ChatForm'
import ChatMessage from './ChatMessage'
import { companyInfo } from './CompanyInfo'

function ChatBot() {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: 'model',
      text: companyInfo,
    },
  ])
  const [showChatBot, setShowChatBot] = useState(false)
  const chatBodyRef = useRef()

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [chatHistory])

  // Doctor recommendation logic
  const generateBotResponse = async history => {
    const userMessage = history[history.length - 1].text
    const doctorResponse = getDoctorRecommendation(userMessage)

    if (doctorResponse) {
      // Remove "thinking" message and add the local response
      setChatHistory(prev => prev.filter(msg => !msg.isThinking))
      setChatHistory(prev => [...prev, { role: 'model', text: doctorResponse }])
      return
    }

    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => prev.filter(msg => !msg.isThinking))
      setChatHistory(prev => [...prev, { role: 'model', text, isError }])
    }

    // Prepare API payload
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedHistory }),
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const responseText = await response.text()

      if (!responseText || responseText.trim() === '') {
        updateHistory(
          "I'm sorry, I didn't get a response from the server. Please try again later.",
          true
        )
        return
      }

      const data = JSON.parse(responseText)

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Something went wrong..')
      }

      const apiResponseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (!apiResponseText) {
        updateHistory(
          "Sorry, I couldn't find a proper answer to your question.",
          true
        )
        return
      }

      updateHistory(apiResponseText)
    } catch (error) {
      updateHistory(`Error: ${error.message}`, true)
    }
  }

  return (
    <div className={`container ${showChatBot ? 'show-chatbot' : ''}`}>
      <button
        onClick={() => setShowChatBot(prev => !prev)}
        id='chatbot-toggler'
      >
        <span>
          <img src={assets.ChatBotToggler} alt='' />
        </span>
        <span>
          <img src={assets.Close} alt='' />
        </span>
      </button>

      <div className='chatbot-popup'>
        <div className='chat-header'>
          <div className='header-info'>
            <img src={assets.ChatBotLogo} alt='ChatBot Logo' />
            <h2 className='logo-text'>ChatBot</h2>
          </div>
          <button
            className='close-btn'
            onClick={() => setShowChatBot(prev => !prev)}
          >
            <MdOutlineKeyboardArrowDown />
          </button>
        </div>

        <div ref={chatBodyRef} className='chat-body'>
          <div className='message bot-message'>
            <img src={assets.ChatBotLogo} alt='ChatBot' />
            <p className='message-text'>
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage chat={chat} key={index} />
          ))}
        </div>

        <div className='chat-footer'>
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBot
