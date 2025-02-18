import React from 'react';
import {Book} from "@/types"
import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from './BorrowBook';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';

interface Props extends Book {
    userId: string
}


const BookOverview = async (
    {
        id,
        userId,
        title,
        author,
        genre,
        rating,
        totalCopies,
        availableCopies,
        description,
        coverColor,
        coverUrl,
        videoUrl,
        summary, 
    }: Props) => {
    
    //1- Extract user from database 
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) return null; 

    const borrowingEligibility = {
        isEligible: availableCopies > 0 && user.status === "APPROVED", 
        message: availableCopies <= 0 ? "Book is not available" : "You can now borrow this book",
    }


    return (
        <section className="book-overview">
            <div className="flex flex-col flex-1 gap-5">
                <h1 className="font-bebas-neue text-4xl text-light-100">{title}</h1>

                <div className={"book-info"}>
                    <p>
                        By <span className={"font-semibold text-light-200"}>{author}</span>
                    </p>

                    <p>
                        Category <span className={"font-semibold text-light-200"}>{genre}</span>
                    </p>

                    <div className={"flex flex-row gap-1"}>
                        <Image src={"/icons/star.svg"} alt={"Start"} width={22} height={22} />
                        <p>{rating}</p>
                    </div>
                </div>

                <div className={"book-copies"}>
                    <p>Total Books: <span className={"text-light-2000"}>{totalCopies}</span></p>
                    <p>Available Books: <span>{availableCopies}</span></p>
                </div>

                <p className={"book-description"}>{description}</p>
                <BorrowBook bookId={id} userId={userId}  borrowingEligibility={borrowingEligibility}/>
            </div>

            <div className={"relative flex flex-1 justify-center"}>
                <div className={"relative"}>
                    <BookCover
                        variant={"wide"}
                        className={"z-10"}
                        coverColor={coverColor}
                        coverImage={coverUrl}
                    />

                    <div className={"absolute left-16 top-10 rotate-12 opacity-40  max-sm:hidden"}>
                        <div className={"relative"}>
                            <BookCover
                                variant={"wide"}
                                coverColor={coverColor}
                                coverImage={coverUrl}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookOverview;