"use server"

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { BorrowBookParams } from "@/types"
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
    const { bookId, userId } = params;

    try {
        // 1- Get the available copies of the book 
        const book = await db
            .select({availableCopies: books.availableCopies})
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);
        
        //2- Check if the book is available 
        if ( !book.length || book[0].availableCopies <= 0) {
            return {
                success: false, 
                message: "This book is not available"
            }
        }

        const dueDate = dayjs().add(7, "days").toDate().toDateString();

        //3- Add the borrow record 
        const record = await db.insert(borrowRecords).values({
            userId,
            bookId,
            dueDate, 
            status: "BORROWED"
        });

        //4- Borrow the book 
        await db
            .update(books)
            .set({ availableCopies: book[0].availableCopies - 1 })
            .where(eq(books.id, bookId))
            .returning();

        return {
            success: true, 
            data: JSON.parse(JSON.stringify(record))
        }

    }catch(error){
        console.log(error);

        return {
            success: false, 
            message: "An error occured when borrowed the book"
        }
    }
}