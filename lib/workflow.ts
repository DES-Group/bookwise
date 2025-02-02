//Client for workflow 
import {Client as WorkflowClient} from "@upstash/workflow"
import config from "./config";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl, 
    token: config.env.upstash.qstashToken
}); 


export const sendEmail =async ({email, subject, message }:{email:string, subject:string, message: string}) => {
    const { status, body } = await context.api.resend.call(
        "Call Resend",
        {
            token: config.env.resendToken,
            body: {
                from: "Bookwise <onboarding@resend.dev>",
                to: [email],
                subject: subject,
                html: message,
            },
            headers: {
                "content-type": "application/json",
            },
        }
    );
}

