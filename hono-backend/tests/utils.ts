import { Context } from 'hono'

export const mockDB = {
    prepare: (query: string) => ({
        bind: (...params: any[]) => ({
            run: async () => {},
            all: async () => ({
                results: []
            })
        })
    })
};

export const mockEnv = {
    DB: mockDB,
    TWILIO_ACCOUNT_SID: "AC365dfcd9f4e3f09c75dd1fb21594c928",
    TWILIO_AUTH_TOKEN : "7d5c2a809bf3bbfd65f949c1cc32aa11",
    TWILIO_WHATSAPP_NUMBER : "+14155238886",
    SMTP_USERNAME : "sundarramann28@gmail.com",
    SMTP_PASSWORD : "skvxclrgykxgtnum",
    SMTP_HOST : "smtp.gmail.com",
    SMTP_PORT : "465"
};

export const createMockContext = (data?: any): Context => {
    return {
        env: mockEnv,
        req: {
            json: async () => data
        },
        json: (data: any, status = 200) => new Response(JSON.stringify(data), { status })
    } as unknown as Context;
};
