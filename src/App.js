import { useState } from "react";
import './App.css';
import axios from "axios";
import TypingAnimation from './components/TypingIndicator.js';
import systemMessage from "./components/prompt.js";

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: `Hi there! What would you like to learn about today?`,
      sender: "assistant",
    }
  ])

  const handleSend = async (event) => {
    event.preventDefault();

    if (inputValue !== '') {
      const newMessage = {
        message: inputValue,
        sender: "user",
        direction: "outgoing"
      }

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setIsTyping(true);
      await processMessageToAssistant(newMessages);
      setInputValue('');
    }
  }

  async function processMessageToAssistant(chatMessages) {
    const url = `http://localhost:4000`;
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "assistant") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      "model" : "gpt-3.5-turbo",
      "messages" : [
        systemMessage,
        ...apiMessages
      ]
    }

    setIsTyping(true);
    axios.post(url+'/api', apiRequestBody).then((response) => {
      console.log(response.data.choices[0].message.content)
      setMessages([...chatMessages, {
        message: response.data.choices[0].message.content,
        sender: "assistant"
      }]);
      setIsTyping(false);
    }).catch((error) => {
      setIsTyping(false);
      console.error("GPT-3 API Error: ", error.response ? error.response.data : error.message);
      console.log(error);
    })
  }

  return (
    <div className='container mx-auto max-w-full'>
      <div className='max-h-screen overflow-y-scroll flex flex-col h-screen bg-gray-100'>
        <div className='bg-blue-500'>
          <h1 className='text-white text-center py-3 font-bold text-4xl hover:text-blue-400 transition-colors duration-300 animate-rainbow'>RLearnChat</h1>
        </div>
        <>
          <div className='flex-grow p-6'>
            <div className='flex flex-col'>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`${
                      message.sender === 'user' ? 'bg-purple-200' : 'bg-green-300'
                    } rounded-lg p-3 my-5 max-w-md shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: message.message }}
                      className="font-semibold"
                    />
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className='flex justify-start'>
                  <div className='bg-gray-400 rounded-lg p-5 text-white max-w-md shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
                    <TypingAnimation />
                  </div>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSend}
            className='flex-none p-5 bottom-2'
          >
            <div className='flex rounded-lg border bg-gray-200'>
              <input
                type='text'
                className="flex-grow px-4 py-4 font-bold bg-transparent text-gray-800 focus:outline-none border-gray-400 transition-all duration-500 resize-none hover:shadow-md"
                placeholder='Type your message here'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type='submit'
                className='text-2xl bg-blue-500 rounded-sm px-7 py-3 hover:bg-blue-600 transition-colors duration-500 text-white hover:shadow-md cursor-pointer'
              >
                🠉
              </button>
            </div>
          </form>
        </>
      </div>
    </div>
  );
}