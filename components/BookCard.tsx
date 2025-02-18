import React from 'react';
import {Book} from "@/types";
import Link from "next/link";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import {Button} from "@/components/ui/button";


const BookCard = ({
    id,
    title,
    coverColor,
    genre,
    coverUrl, 
    isLoanedBook = false,
}: Book) => {
    return (
        <li className={`${isLoanedBook && 'xs:w-52 w-full'}`}>
            <Link href={`/books/${id}`} className={`${isLoanedBook && 'w-full flex flex-col items-center'}`}>
                <BookCover coverColor={coverColor} coverImage={coverUrl} />

                <div className={`mt-4 ${!isLoanedBook && "xs:max-w-40 max-w-28"}`}>
                    <p className={"book-title"}>{title}</p>
                    <p className={"book-genre"}>{genre}</p>
                </div>
            </Link>

            {isLoanedBook && (
                <div className={"mt-3 w-full"}>
                    <div className={"book-loaned"}>
                        <Image
                            src={"/icons/calendar.svg"}
                            alt={"Calendar"}
                            width={"18"}
                            height={"18"}
                            className={"object-contain"}
                        />
                        <p className={"text-light-100"}>11 days left to return</p>
                    </div>
                    <Button className={"book-btn text-dark-500"}>Download Recipe</Button>
                </div>
            )}
        </li>
    );
};

export default BookCard;