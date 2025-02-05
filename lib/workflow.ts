//Client for workflow 
import {Client as WorkflowClient} from "@upstash/workflow"
import config from "./config";
import emailjs from '@emailjs/browser';
import { toast } from "@/hooks/use-toast";


export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl, 
    token: config.env.upstash.qstashToken
}); 


// This function use resend to send e-mails
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


export const sendEmailWithEmailJS = async ({email, subject, message}:{email:string, subject:string, message:string}) => {

    try {
        const serviceId = config.env.emailjs.serviceId;
        const templateId = config.env.emailjs.templateId;
        const publicKey = config.env.emailjs.publicKey;


        const emailParams = {
            subject, 
            email, 
            message
        }

        const result = await emailjs.send(serviceId, templateId, emailParams, publicKey);

        if (result.status === 200) {
            return toast({
                title: "Success",
                description: "Email sent"
            })
        }
        
    } catch (error) {
        
    }
}