import React from 'react';
import {Book} from '@/types'
import BookCard from "@/components/BookCard"


interface  BookListType {
    title: string,
    books: Book[],
    containerClassName?: string
}

const BookList = ({title, books, containerClassName}:BookListType) => {
    return (
        <section className={containerClassName}>
            <h1 className="font-bebas-neue text-4xl text-light-100">{title}</h1>

            <ul className={"book-list"}>
                {books.map((book) => <BookCard key={book.title} {...book} />)}
            </ul>
        </section>
    );
};

export default BookList;