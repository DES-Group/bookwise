/** This file contain the of propos using in components */

export type Book = {
    id: string,
    title: string,
    author: string,
    genre: string,
    rating: number,
    totalCopies: number,
    availableCopies: number,
    description: string,
    coverColor: string,
    coverUrl: string,
    videoUrl: string,
    summary: string,
    createdAt: Date | null,
}

export type AuthCredentials = {
    fullName: string;
    email: string;
    password: string; 
    universityId: number;
    universityCard: string;
}


export type BookParams = {
    title: string,
    description: string,
    author: string,
    genre: string,
    rating: number,
    totalCopies: number,
    coverUrl: string,
    coverColor: string,
    videoUrl: string,
    summary: string
}

export type BorrowBookParams = {
    bookId: string,
    userId: string,
}