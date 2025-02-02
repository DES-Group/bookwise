"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { AuthCredentials } from "@/types";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";


export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
    const { email, password } = params; 

    //Get the client ip address
    const ip = (await headers()).get('x-forwaded-for') || "127.0.0.1";

    console.log("Mon adresse ip", ip);

    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect('/too-fast'); 
    
    try {
        const result = await signIn("credentials", {
            email, 
            password, 
            redirect: false
        }); 
        
        if (result?.error) {
            return { success: false, error: result.error };     
        }

        return { success: true }; 

    } catch (error) {
        console.log(error, "SignIn failed"); 
        return { success: false, error: error };
    }
}

export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, password, universityId, universityCard } = params; 
    

    //Check if the user already exist 
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

        .limit(1)
        .then((rows) => rows[0]);
    
    if (existingUser) {
        return {success: false, error: "User already exist"}
    }

    //If there, that meaning user exist not
    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            universityId,
            universityCard
        });

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
            body: {
                email, 
                fullName
            }
        })

        //Automatically signin the user 
        signInWithCredentials({ email, password });

        return { success: true }; 

    } catch (error) {
        console.log("Signup error", error);
        return { success: false, error: "Signup error"};
    }
}
