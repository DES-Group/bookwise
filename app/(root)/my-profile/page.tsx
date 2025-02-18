import { auth, signOut } from '@/auth'
import BookList from '@/components/BookList'
import { Button } from '@/components/ui/button'
import { sampleBooks } from '@/constants'
import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { Book } from '@/types'
import { desc, eq } from 'drizzle-orm'
import React from 'react'

const page = async () => {

    const session = await auth();
     
      const latestBooks = (await db
        .select()
        .from(books)
        .limit(10)
        .orderBy(desc(books.createdAt))) as Book[];
    
    return (
        <>
            <form action={ async () => {
                'use server'
                 
                await signOut()
            }}>
                <Button>Logout</Button>
            </form>

            <BookList title="Borrowed Books" books={latestBooks} />
        </>
  )
}

export default page