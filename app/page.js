"use client";
import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Paper, CircularProgress, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const typing = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const moveParticles = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(-100%) translateY(-100%);
  }
`;

const inactivityAnimation = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #003366, #0066cc); 
  background-image: url('https://mir-s3-cdn-cf.behance.net/project_modules/disp/15549a14589707.5628669c64769.png');
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center center; 
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 2s ease-in-out;
`;


const BackgroundParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: ${moveParticles} 60s linear infinite;
  z-index: 0;
`;

const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.95); 
  backdrop-filter: blur(15px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 420px;
  width: 100%;
  color: #003366; 
  position: relative;
  z-index: 1;
  margin-left: 180px; 
`;

const RobotImage = styled.img`
  position: absolute;
  bottom: 20%;
  left: 10%;
  width: 300px;
  height: auto;
  z-index: 2;
  animation: ${bounce} 10s infinite;
`;

const ChatHeader = styled.div`
  font-weight: bold;
  font-size: 2.9rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #003366; 
  animation: ${fadeIn} 1s ease-in-out;
  width: 100%;
`;

const ChatWindow = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  width: 100%;
  height: 320px;
  background-color: rgba(255, 255, 255, 0.9); 
  backdrop-filter: blur(8px);
  overflow-y: auto; 
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: inset 0 6px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #003366 #f1f1f1;
  overflow-anchor: auto; /* Ensures that the scroll remains at the bottom */

  ::-webkit-scrollbar {
    width: 12px; 
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #003366;
    border-radius: 6px; 
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #002244;
  }
`;

const MessageBubble = styled.div`
  background: ${({ isUser }) => (isUser ? 'linear-gradient(135deg, #003366, #00509e)' : 'linear-gradient(135deg, #ffffff, #f9f9f9)')};
  color: ${({ isUser }) => (isUser ? 'white' : 'black')};
  padding: 0.75rem 1rem;
  border-radius: 16px;
  margin: 0.5rem 0;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-in-out;

  word-break: break-word; /* Ensure long words or URLs break correctly */
  overflow-wrap: break-word; /* Ensure proper wrapping of content */

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }
`;


  // const MessageBubble = styled.div`
  //   background: ${({ isUser }) => (isUser ? 'linear-gradient(135deg, #003366, #00509e)' : 'linear-gradient(135deg, #ffffff, #f9f9f9)')};
  //   color: ${({ isUser }) => (isUser ? 'white' : 'black')};
  //   padding: 0.75rem 1rem;
  //   border-radius: 16px;
  //   margin: 0.5rem 0;
  //   align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  //   max-width: 70%;
  //   font-size: 0.9rem;
  //   line-height: 1.5;
  //   position: relative;
  //   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  //   animation: ${fadeIn} 0.5s ease-in-out;

  //   &:hover {
  //     transform: scale(1.04);
  //     box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  //   }
  // `;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #003366; 
  font-size: 0.9rem;
  animation: ${typing} 1.5s infinite;
`;

const InactivityMessage = styled.div`
  font-size: 1.2rem;
  color: #003366;
  animation: ${inactivityAnimation} 3s infinite;
  margin-top: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const InputField = styled(TextField)`
  && {
    width: calc(100% - 48px);
    background: #f1f1f1;
    border-radius: 20px;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    margin-left: 8px;
    border-radius: 50%;
    min-width: 36px;
    height: 36px;
    background-color: #ffffff;
    color: #003366;
    transition: all 0.3s ease;
    &:hover {
      background-color: #e6e6e6;
      transform: scale(1.1);
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const Chatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([{ text: 'Hello! How can I help you today?', isUser: false }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typing, setTyping] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showInactivityMessage, setShowInactivityMessage] = useState(false);
  const chatWindowRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setMessages([...messages, { text: prompt, isUser: true }]);
    setPrompt('');
    setTyping(true);
    try {
      const res = await fetch('http://localhost:3000/api/professor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userMessage: prompt })
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setMessages(prevMessages => [...prevMessages, { text: data.choices[0].message.content || 'No response from API', isUser: false }]);
    } catch (error) {
      setError('Error fetching response');
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    setShowInactivityMessage(false);
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityMessage(true);
    }, 10000); 
  };

  useEffect(() => {
    resetInactivityTimer(); 
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    const scrollToBottom = () => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    };
  
    scrollToBottom();
  
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatWindow;
      setShowScrollIndicator(scrollTop < scrollHeight - clientHeight);
    };
  
    chatWindow.addEventListener('scroll', handleScroll);
  
    return () => chatWindow.removeEventListener('scroll', handleScroll);
  }, [messages]);
  

  return (
    <PageContainer>
      <BackgroundParticles />
      <RobotImage src="https://static.vecteezy.com/system/resources/previews/023/841/800/original/adorable-blue-bots-small-cute-robots-generated-by-ai-free-png.png" alt="Robot" />
      <ChatbotContainer>
        <ChatHeader>ProfRater </ChatHeader>
        <ChatWindow ref={chatWindowRef} onMouseMove={resetInactivityTimer} onKeyDown={resetInactivityTimer}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.isUser}>
            {/* <MessageBubble key={index} > */}
              {msg.text}
            </MessageBubble>
          ))}
          {typing && <TypingIndicator>Typing...</TypingIndicator>}
          {showInactivityMessage && <InactivityMessage>Let's Talk!</InactivityMessage>}
        </ChatWindow>
        <InputContainer>
          <InputField
            placeholder="Type a message..."
            variant="outlined"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              resetInactivityTimer();
            }}
            disabled={loading}
          />
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          </StyledButton>
        </InputContainer>
        {error && <Typography color="error" style={{ marginTop: '0.5rem' }}>{error}</Typography>}
        <ScrollIndicator
          show={showScrollIndicator}
          onClick={() => chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight}
        >
          &#x21e9;
        </ScrollIndicator>
      </ChatbotContainer>
    </PageContainer>
  );
};

export default Chatbot;