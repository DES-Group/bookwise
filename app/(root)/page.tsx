import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { desc } from "drizzle-orm";
import { Book } from "@/types";
import { auth } from "@/auth";

const Home = async () => {

  const session = await auth();
 
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
  <>
    {/** This components show the informations about the first book */}
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string}  />

    {/** This components show a list of books  */}
    <BookList
      title={"Latest Books"}
      books={latestBooks.slice(1)}     
      containerClassName={"mt-28"}
    />
  </>
)};


export default Home; 
