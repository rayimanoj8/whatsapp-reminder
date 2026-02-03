// Configuration constants
export const config = {
    // Server
    PORT: process.env.PORT || 3000,

    // WhatsApp API
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v24.0/919127057960368/messages",
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || "EAAMe53a7MrEBQjIEBddIS3FNp8NUfXc61f2bDaLBuLFi1IAvMGALHqZCTYkUTYF5ZBWZCjB5i3okGKYnAAmdAzHtZBNnCbZCIhbPHEHefXhXRDPFeoJRtDxc2eJnnTx94iGbfF6KZAQZAlEIOWZBkGdqrRyl6QERCN2RQI6Y29d6godMkvSILqlJugdMipqvma3oNRpbfrtX4NlEzhkbYH9fuKZBsivlrTsHZBMa4CrQRXBqHN2B9d1cQKAigwqLSZA3b9f0rWENneZAkYPZCIxgqo5jJsmTA",
    RECIPIENT_PHONE: process.env.RECIPIENT_PHONE || "916304742913",

    // Webhook
    VERIFY_TOKEN: process.env.VERIFY_TOKEN || "iloveyoumanoj",

    // Cron
    CRON_SCHEDULE: process.env.CRON_SCHEDULE || "30 10 * * *",
    TIMEZONE: process.env.TIMEZONE || "Asia/Kolkata"
};
