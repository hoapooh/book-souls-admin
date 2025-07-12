# Chat Feature Documentation

## Overview

The chat feature provides real-time messaging capabilities for staff members to communicate with customers using SignalR for real-time updates.

## Architecture

### Components

- **ChatInterface**: Main chat component containing the conversation list and message area
- **ConversationList**: Displays list of conversations in a sidebar
- **MessageList**: Shows messages in the selected conversation
- **MessageInput**: Text input for sending messages

### Hooks

- **useChat**: Manages SignalR connection, conversations, and messages state

### Services

- **chatService**: API calls for fetching conversations and messages

## SignalR Events

### Listening Events

- **ReceiveMessage**: Triggered when a new message is received
  - Parameters: `conversationId`, `senderId`, `receiverId`, `text`, `sentAt`
- **ReceiveException**: Triggered when an error occurs
  - Parameters: `error`

### Sending Events

- **SendMessage**: Send a message to a conversation
  - Parameters: `conversationId`, `senderId`, `receiverId`, `text`

## Environment Variables

```
NEXT_PUBLIC_CHAT_URL=http://localhost:5000/chathub
```

## Features

- Real-time messaging with SignalR
- Conversation list with last message preview
- Message timestamps
- Online/offline status indicator
- Auto-scroll to new messages
- Send messages with Enter key
- Responsive design similar to Messenger

## Usage

1. Navigate to `/staff/chat`
2. Select a conversation from the left sidebar
3. View messages in the main area
4. Type and send messages using the input field
5. Messages appear in real-time for both sender and receiver

## File Structure

```
src/modules/staff/
├── hooks/
│   └── useChat.ts
├── services/
│   └── chat.service.ts
├── ui/
│   ├── ChatInterface.tsx
│   ├── ConversationList.tsx
│   ├── MessageList.tsx
│   └── MessageInput.tsx
└── ...

src/app/staff/(authenticated)/
└── chat/
    └── page.tsx
```
