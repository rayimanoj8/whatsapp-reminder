// In-memory storage for the latest WhatsApp message
let latestMessage = null;

/**
 * Store a new message (overwrites previous)
 * @param {Object} data - Message data
 */
export function storeMessage(data) {
    latestMessage = {
        timestamp: new Date().toISOString(),
        data: data,
    };
    return latestMessage;
}

/**
 * Get the latest stored message
 * @returns {Object|null} Latest message or null
 */
export function getLatestMessage() {
    return latestMessage;
}
