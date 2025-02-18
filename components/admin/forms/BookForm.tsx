"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm, UseFormReturn } from "react-hook-form"
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Book } from '@/types'
import { bookSchema } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import ColorPicker from '../ColorPicker'
import { Textarea } from "@/components/ui/textarea"
import { createBook } from '@/lib/admin/actions/book'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


interface Props extends Partial<Book> {
    type?: 'CREATE' | 'UPDATE'
}

const BookForm = <T extends FieldValues>({ type, ...book }: Props) => {

    const router = useRouter();


    // 1. Define the form.
    const form: UseFormReturn<z.infer<typeof bookSchema>> = useForm({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title:'',
            description:'',
            author:'',
            genre:'',
            rating:1,
            totalCopies:1,
            coverUrl:'',
            coverColor:'',
            videoUrl:'',
            summary:'',
        }
    });

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        const result = await createBook(values); 

        if (result.success) {
            toast({
                title: "Success", 
                description: "The book is added."
            });

            router.push(`/admin/books/${result.data.id}`);
            
        } else {
            toast({
                title: "Error", 
                description: "Book uploaded failed."
            })
        }


    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                <FormField
                    key={"title"}
                    control={form.control}
                    name={"title"}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-base font-normal text-dark-500'>
                            Book Title
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                required
                                placeholder='Book Title'
                                className="book-form_input"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    key={"author"}
                    control={form.control}
                    name={"author"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Author
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    required
                                    placeholder="Enter the author name"
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    key={"genre"}
                    control={form.control}
                    name={"genre"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Genre
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    required
                                    placeholder="Enter the genre of the book"
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    key={"rating"}
                    control={form.control}
                    name={"rating"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book rating
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    max={5}
                                    required
                                    placeholder='Rating'
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    key={"totalCopies"}
                    control={form.control}
                    name={"totalCopies"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Total number of books
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    required
                                    type='number'
                                    min={1}
                                    max={1000}
                                    placeholder="Enter the total number of books"
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    key={"coverUrl"}
                    control={form.control}
                    name={"coverUrl"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Image
                            </FormLabel>
                            <FormControl>
                                <FileUpload
                                    type='image'
                                    accept='image/*'
                                    placeholder='Upload an image'
                                    folder='books/covers'
                                    variant='light'
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    key={"coverColor"}
                    control={form.control}
                    name={"coverColor"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Primary Color
                            </FormLabel>
                            <FormControl>
                                <ColorPicker value={field.value} onPickerChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    key={"description"}
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea 
                                    rows={10}
                                    placeholder="Book description" 
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    key={"videoUrl"}
                    control={form.control}
                    name={"videoUrl"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Trailer
                            </FormLabel>
                            <FormControl>
                                <FileUpload
                                    type='video'
                                    accept='video/*'
                                    placeholder='Upload a   video'
                                    folder='books/videos'
                                    variant='light'
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    key={"summary"}
                    control={form.control}
                    name={"summary"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-normal text-dark-500'>
                                Book Summary                    
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={5}
                                    placeholder="Book summary"
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="book-form_btn text-white">
                    Add Book to library
                </Button>

                
            </form>
        </Form>
            
    )
}

export default BookForm