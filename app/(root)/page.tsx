import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

const Home = async () => {
  
  const result = await db.select().from(users);

  //console.log(JSON.stringify(result, null, 2));


  return (
  <>
    {/** This components show the informations about the first book */}
    <BookOverview {...sampleBooks[0]} />

    {/** This components show a list of books  */}
    <BookList
      title={"Latest Books"}
      books={sampleBooks}
      containerClassName={"mt-28"}
    />
  </>
)};


export default Home; 
