declare global {
    interface Env {
        DB: any;
        TWILIO_ACCOUNT_SID: string;
        TWILIO_AUTH_TOKEN: string;
        TWILIO_WHATSAPP_NUMBER: string;
        SMTP_USERNAME: string;
        SMTP_PASSWORD: string;
        SMTP_HOST: string;
        SMTP_PORT: string;
    }
}

export {};
