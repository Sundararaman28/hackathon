declare global {
    interface Env {
        DB: any;
        TWILIO_ACCOUNT_SID: string;
        TWILIO_AUTH_TOKEN: string;
        TWILIO_WHATSAPP_NUMBER: string;
    }
}

export {};
