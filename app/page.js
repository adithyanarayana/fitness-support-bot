'use client'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";


import { useState } from "react";

export default function Home() {
 const [messages, setMessages]= useState([
  {
  role: 'assistant',
  content: `Hi I'm your fitness Support Agent, how can I assist you today?`,
  }
])
const [message, setMessage] = useState(''); 
const sendMessage = async () => {
if (!message.trim()) return;  // Don't send empty messages

setMessage('')
setMessages((messages) => [
  ...messages,
  { role: 'user', content: message },
  { role: 'assistant', content: '' },
])

try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([...messages, { role: 'user', content: message }]),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    setMessages((messages) => {
      let lastMessage = messages[messages.length - 1]
      let otherMessages = messages.slice(0, messages.length - 1)
      return [
        ...otherMessages,
        { ...lastMessage, content: lastMessage.content + text },
      ]
    })
  }
} catch (error) {
  console.error('Error:', error)
  setMessages((messages) => [
    ...messages,
    { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
  ])
}
}
  return(
    
    <Box
    width={'100vw'}
    height={'100vh'}
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    sx={{
      background: 'linear-gradient(to bottom, #e0f7fa, #80deea)',
      padding: 3,
      position: 'relative', 
    }}
  >
    {/* Background Image Box */}
    <Box
      sx={{
        position: 'absolute',
     left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundImage: 'url(/dumbbell.png)', 
    backgroundSize: 'contain', 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'left', 
    opacity: 0.3, 
    zIndex: 1,
      }}
    />

    {/* Chat Box */}
    <Stack
      direction={'column'}
      width={'600px'}
      height={'700px'}
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: 'white',
        zIndex: 2, 
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          padding: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="div">
          Your Personal AI Fitness Support Bot
        </Typography>
      </Box>
      <Stack
        direction={'column'}
        spacing={2}
        flexGrow={1}
        overflow={'auto'}
        maxHeight={'100%'}
        p={2}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display={'flex'}
            justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
          >
            <Box
              sx={{
                bgcolor: message.role === 'assistant' ? 'primary.light' : 'secondary.light',
                color: 'black',
                borderRadius: 3,
                boxShadow: 1,
                p: 2,
                maxWidth: '75%',
                wordWrap: 'break-word',
              }}
              whiteSpace="pre-line" // Enable handling of line breaks
            >
              {message.content}
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack direction={'row'} spacing={2} p={2} sx={{ borderTop: '1px solid #eee' }}>
        <TextField
          label="Enter a message"
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Stack>
  </Box>
)}