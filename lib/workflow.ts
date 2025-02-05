//Client for workflow 
import { Client as WorkflowClient } from "@upstash/workflow"
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "./config";
import emailjs from '@emailjs/browser';
import { toast } from "@/hooks/use-toast";


export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl, 
    token: config.env.upstash.qstashToken
}); 

export const qstashClient = new QStashClient({
    token: config.env.upstash.qstashToken
})


// This function use resend to send e-mails
export const sendEmail = async ({
    email,
    subject,
    message
}: {
        email: string,
        subject: string,
        message: string
}) => {
    
    await qstashClient.publishJSON({
        api: {
            name: "email", 
            provider: resend({token: config.env.resendToken})
        }, 
        body: {
            from: "donatienoussaodb@gmail.com", 
            to: [email], 
            subject, 
            html: message
        }
    });
}


export const sendEmailWithEmailJS = async ({email, subject, message}:{email:string, subject:string, message:string}) => {

    try {
        const serviceId = config.env.emailjs.serviceId;
        const templateId = config.env.emailjs.templateId;
        const publicKey = config.env.emailjs.publicKey;


        const formData = {
            to_name: email,
            from_name: 'Bookwise Team',
            message,
            reply_to: 'contact@bookwise.com'
        };

        const result = await emailjs.send(serviceId, templateId, formData, publicKey);

        if (result.status === 200) {
            return { success: true };
        }
        
    } catch (error) {
        console.log(error);                           
        return {success: false, error: error}
    }
}