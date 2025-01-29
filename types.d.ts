/** This file contain the of propos using in components */

export type Book = {
    id: number,
    title: string,
    author: string,
    genre: string,
    rating: number,
    total_copies: number,
    available_copies: number,
    description: string,
    color: string,
    cover: string,
    video: string,
    summary: string,
    isLoanedBook?: boolean
}

export type AuthCredentials = {
    fullName: string;
    email: string;
    password: string; 
    universityId: number;
    universityCard: string;
}
