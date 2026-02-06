import { processWebhookAndUpdateTimesheet } from "./src/services/timesheetService.js";

// Sample webhook data from WhatsApp
const sampleWebhook = {
    success: true,
    latestMessage: {
        timestamp: "2026-02-06T18:38:03.980Z",
        data: {
            object: "whatsapp_business_account",
            entry: [
                {
                    id: "874445508925764",
                    changes: [
                        {
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "15551760287",
                                    phone_number_id: "919127057960368",
                                },
                                contacts: [
                                    {
                                        profile: {
                                            name: "Manoj Rayi",
                                        },
                                        wa_id: "916304742913",
                                    },
                                ],
                                messages: [
                                    {
                                        context: {
                                            from: "15551760287",
                                            id: "wamid.HBgMOTE2MzA0NzQyOTEzFQIAERgSMzRDM0ZDOEI3RTJBQUZFNjBEAA==",
                                        },
                                        from: "916304742913",
                                        id: "wamid.HBgMOTE2MzA0NzQyOTEzFQIAEhggQUNCOTQ4REMxRUVGREQxNTUxNjQwMjVDMEM5NkFBQzkA",
                                        timestamp: "1770403081",
                                        type: "interactive",
                                        interactive: {
                                            type: "list_reply",
                                            list_reply: {
                                                id: "WFH",
                                                title: "Work from home",
                                                description: "Remote work",
                                            },
                                        },
                                    },
                                ],
                            },
                            field: "messages",
                        },
                    ],
                },
            ],
        },
    },
};

console.log("🧪 Testing webhook processing...\n");

// Test the webhook processing
const result = await processWebhookAndUpdateTimesheet(sampleWebhook.latestMessage);

console.log("\n📊 Result:");
console.log(JSON.stringify(result, null, 2));

if (result.success) {
    console.log("\n✅ Test passed! Timesheet updated successfully.");
} else {
    console.log("\n❌ Test failed:", result.message);
}
