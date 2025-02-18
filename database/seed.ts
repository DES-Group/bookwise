import config from "@/lib/config";
import dummyBooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { books } from "./schema";
import { configDotenv } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";


// This file is a standalone file, so we have to make connexion to the database
configDotenv({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });


//Create ImageKit instance that will be used to upload the books cover 
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,             
});


const uploadToImageKit = async (url: string,title:string, folder:string) => {

    try {
        const response = await imagekit.upload({
            file: url,
            fileName: title,
            folder
        });

        return response.filePath; 

    } catch (error) {
        console.error("Error while loading image on ImageKit", error);
    }
}


const seed = async () => {
    console.log("Seed Data ...");

    try {
        for (const book of dummyBooks) {
            
            // 1- Upload the cover Image to imagekit 
            const coverUrl = await uploadToImageKit(
                book.coverUrl, 
                `${book.title}.jpg`, 
                "/books/covers"
            ) as string; 
            
            // 2- Upload the video to imagekit
            const videoUrl = await uploadToImageKit(
                book.videoUrl,
                `${book.title}.jpg`,
                "/books/videos"
            ) as string;

            //3- Upload the book to database 
            await db.insert(books).values({
                ...book,
                coverUrl,
                videoUrl
            });

        }
    } catch (error) {
        console.log(error); 
    }

    console.log("Data seed successfully");
}

seed();