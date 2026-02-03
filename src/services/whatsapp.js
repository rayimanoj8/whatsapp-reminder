import axios from "axios";
import { config } from "../config.js";

/**
 * Send WhatsApp work status message
 * @returns {Promise<Object>} WhatsApp API response
 */
export async function sendWorkStatusMessage() {
    try {
        const response = await axios.post(
            config.WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to: config.RECIPIENT_PHONE,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: {
                        text: "Good morning 👋\nPlease select your work status for today"
                    },
                    action: {
                        button: "Choose option",
                        sections: [
                            {
                                title: "Work status",
                                rows: [
                                    {
                                        id: "WFH",
                                        title: "Work from home",
                                        description: "Remote work"
                                    },
                                    {
                                        id: "WFO",
                                        title: "Work from office",
                                        description: "Office attendance"
                                    },
                                    {
                                        id: "HALF_DAY",
                                        title: "Half day leave",
                                        description: "Working half day"
                                    },
                                    {
                                        id: "LEAVE",
                                        title: "Leave today",
                                        description: "On leave"
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Work status message sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error sending WhatsApp message:", error.response?.data || error.message);
        throw error;
    }
}
