// Configuration constants
export const config = {
    // Server
    PORT: process.env.PORT || 3000,

    // WhatsApp API
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v24.0/919127057960368/messages",
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || "EAAMe53a7MrEBQok6WKjLybv5UNxLIq5hHs2bm53PDy2W0FgET08zWus44q9cxNoYG8hRfi8XnZAat6WjLbAFSxwsrPSO7XYrui7CZBxd43XUA6FMPt0vnZBwE3uckDsQEGCS7qhJF0oaUDLI8d2w1Pn22DtoZCy6X6n1lTlZCZAmh41DyVGfV5YVXnNtsFfP7C5Vd1nBlmbZBJpJQBeDhjcgTGJhXMrdAxmQLZCEOCfXYYbZCe1zZAdNVUgCoWr9WRfMtXSOPN3RpGMZBN3xdlTQPZAghPZCY",
    RECIPIENT_PHONE: process.env.RECIPIENT_PHONE || "916304742913",

    // Webhook
    VERIFY_TOKEN: process.env.VERIFY_TOKEN || "iloveyoumanoj",

    // Cron
    CRON_SCHEDULE: process.env.CRON_SCHEDULE || "30 10 * * *",
    TIMEZONE: process.env.TIMEZONE || "Asia/Kolkata"
};
