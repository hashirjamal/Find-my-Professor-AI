'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TextField, IconButton, Paper, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const PageContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background: linear-gradient(135deg, #003366, #0066cc);
	padding: 20px;
	box-sizing: border-box;
`;

const ContentWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	max-width: 1200px;
`;

const RobotContainer = styled.div`
	flex: 0 0 auto;
	margin-right: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const RobotImage = styled.img`
	width: 200px;
	height: auto;
	animation: ${float} 3s ease-in-out infinite;

	@media (max-width: 768px) {
		width: 100px;
	}
`;

const ChatbotContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	padding: 2rem;
	border-radius: 20px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	width: 100%;
	max-width: 500px;
	height: 80vh;
	max-height: 700px;
	position: relative;
	animation: ${fadeIn} 0.5s ease-out;
`;

const ChatHeader = styled.h1`
	font-size: 2rem;
	color: #003366;
	margin-bottom: 1rem;
	text-align: center;
`;

const ChatWindow = styled(Paper)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	padding: 1rem;
	overflow-y: auto;
	background-color: #f8f9fa;
	margin-bottom: 1rem;
	border-radius: 12px;
`;

const MessageBubble = styled.div`
	background: ${({ isUser }) => (isUser ? '#003366' : '#ffffff')};
	color: ${({ isUser }) => (isUser ? '#ffffff' : '#000000')};
	padding: 0.75rem 1rem;
	border-radius: 18px;
	margin: 0.5rem 0;
	align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
	max-width: 80%;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	word-break: break-word;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 25px;
	padding: 0.5rem;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InputField = styled(TextField)`
	flex-grow: 1;
	margin-right: 0.5rem;

	& .MuiOutlinedInput-root {
		border-radius: 20px;
	}

	& .MuiOutlinedInput-notchedOutline {
		border: none;
	}
`;

const Chatbot = () => {
	const [prompt, setPrompt] = useState('');
	const [messages, setMessages] = useState([
		{
			text: 'Hello! How can I help you rate a professor today?',
			isUser: false,
		},
	]);
	const [loading, setLoading] = useState(false);
	const chatWindowRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setLoading(true);
		setMessages((prev) => [...prev, { text: prompt, isUser: true }]);
		setPrompt('');

		try {
			const res = await fetch('http://localhost:3000/api/professor', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userMessage: prompt }),
			});

			if (!res.ok) throw new Error('Network response was not ok');

			const data = await res.json();
			setMessages((prev) => [
				...prev,
				{
					text:
						data.choices[0].message.content ||
						'No response from API',
					isUser: false,
				},
			]);
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{ text: 'Error fetching response', isUser: false },
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (chatWindowRef.current) {
			chatWindowRef.current.scrollTop =
				chatWindowRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<PageContainer>
			<ContentWrapper>
				<RobotContainer>
					<RobotImage
						src="https://static.vecteezy.com/system/resources/previews/023/841/800/original/adorable-blue-bots-small-cute-robots-generated-by-ai-free-png.png"
						alt="ProfRaters Bot"
					/>
				</RobotContainer>
				<ChatbotContainer>
					<ChatHeader>ProfRater</ChatHeader>
					<ChatWindow ref={chatWindowRef}>
						{messages.map((msg, index) => (
							<MessageBubble key={index} isUser={msg.isUser}>
								{msg.text}
							</MessageBubble>
						))}
					</ChatWindow>
					<InputContainer onSubmit={handleSubmit}>
						<InputField
							placeholder="Type your message..."
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							disabled={loading}
							fullWidth
						/>
						<IconButton type="submit" disabled={loading}>
							{loading ? (
								<CircularProgress size={24} />
							) : (
								<SendIcon />
							)}
						</IconButton>
					</InputContainer>
				</ChatbotContainer>
			</ContentWrapper>
		</PageContainer>
	);
};

export default Chatbot;
