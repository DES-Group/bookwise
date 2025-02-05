import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendEmail, sendEmailWithEmailJS } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs"
import { eq } from "drizzle-orm";

type UserState = "non-active" | "active"

type InitialData = {
    email: string;
    fullName: string;
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 10000; 
const THREE_DAY_IN_MS = 3 * ONE_DAY_IN_MS; 
const THRITY_DAY_IN_MS = 30 * ONE_DAY_IN_MS; 


export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload

    //Send welcome mail to new user
    await context.run("new-signup", async () => {
        await sendEmailWithEmailJS({
            email, 
            subject: "Welcome to the plateform", 
            message: `Welcome ${fullName}`, 
        })
    })

    await context.sleep("wait-for-3-days", THREE_DAY_IN_MS);

    while (true) {
        const state = await context.run("check-user-state", async () => {
            return await getUserState(email)
        })

        if (state === "non-active") {
            await context.run("send-email-non-active", async () => {
                await sendEmailWithEmailJS({
                    email,
                    subject: "Are you still there ?",
                    message: "We are miss you"
                });
            })
        } else if (state === "active") {
            await context.run("send-email-active", async () => {
                await sendEmailWithEmailJS({
                    email,
                    subject: "Send newsletter to active users",
                    message: ""
                });
            });
        }

        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
    }
})


const getUserState = async (email:string): Promise<UserState> => {
    
    //Get the user from the database according to his email 
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1); 
    
    if (user.length === 0) return "non-active"
    
    const lastActivityDate = new Date(user[0].lastActivityDate); 
    const now = new Date(); 
    const timeDifference = now.getTime() - lastActivityDate.getTime(); 
    
    if (timeDifference > THREE_DAY_IN_MS && timeDifference <= THRITY_DAY_IN_MS) {
        return "non-active"; 
    }

    return "active"; 
}
