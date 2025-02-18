"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { borrowBook } from '@/lib/actions/book'

interface Props {
    bookId: string,
    userId: string, 
    borrowingEligibility: {
        isEligible: boolean, 
        message: string
    }
}

const BorrowBook = ({ bookId, userId, borrowingEligibility: {isEligible, message} }: Props) => {
    
    const router = useRouter(); 
    const [borrowing, setBorrowing] = useState(false);  

    const handleBorrowBook = async () => {
        if (!isEligible) {
            toast({
                title: "Error", 
                description: message, 
                variant: "destructive"
            })
        }

        setBorrowing(true); 

        try {
            const response = await borrowBook({ bookId, userId });

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Book borrowed succefully"
                });

                router.push("/my-profile");
            }
            else {
                toast({
                    title: "Error", 
                    description: response.message
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occured when borrowing the book",
            });
        }finally{
            setBorrowing(false);
        }
    }
  
    return (
        <Button className={"book-overview_btn"} onClick={handleBorrowBook} disabled={borrowing}>
            <Image src={"/icons/book.svg"} alt={"borrow"} width={20} height={20} />
            <p className={"font-bebas-neue text-xl text-dark-100"}>
                {borrowing ? "Borrowing..." : "Borrow Book"}
            </p>
        </Button>
    )
}

export default BorrowBook