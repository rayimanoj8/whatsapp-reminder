# Project Structure

```
whatsapp-TF/
├── index.js                          # Main entry point
├── package.json
├── README.md
├── .env.example
├── .gitignore
│
└── src/
    ├── config.js                     # Configuration & environment variables
    │
    ├── routes/
    │   └── index.js                  # All route definitions
    │
    ├── controllers/
    │   ├── webhookController.js      # Webhook verification logic
    │   ├── messageController.js      # Message receive & retrieve logic
    │   └── sendController.js         # Manual message sending logic
    │
    ├── services/
    │   └── whatsapp.js               # WhatsApp API integration
    │
    ├── cron/
    │   └── scheduler.js              # Cron job initialization
    │
    └── storage/
        └── messageStore.js           # In-memory message storage
```

## Module Responsibilities

### `index.js`
- Application entry point
- Express app initialization
- Middleware setup
- Route mounting
- Server startup

### `src/config.js`
- Centralized configuration
- Environment variable management
- Default values

### `src/routes/index.js`
- Route definitions
- Maps endpoints to controllers

### `src/controllers/`
- **webhookController.js**: WhatsApp webhook verification
- **messageController.js**: Receive and retrieve messages
- **sendController.js**: Manual message trigger

### `src/services/whatsapp.js`
- WhatsApp API communication
- Message formatting
- API error handling

### `src/cron/scheduler.js`
- Cron job initialization
- Scheduled task management

### `src/storage/messageStore.js`
- In-memory data storage
- Message state management

## Benefits of This Structure

✅ **Separation of Concerns** - Each file has a single responsibility  
✅ **Easy to Test** - Modular functions can be tested independently  
✅ **Maintainable** - Clear organization makes updates easier  
✅ **Scalable** - Easy to add new features or routes  
✅ **Readable** - Clean, focused files instead of one large file
