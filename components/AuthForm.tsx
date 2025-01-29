"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { ZodType } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription, 
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { FIELD_NAMES, FIELD_TYPES } from '@/constants'
import ImageUpload from './ImageUpload'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


interface Props<T extends FieldValues> {
    schema: ZodType<T>, 
    defaultValues: T, 
    onSubmit: (data: T) => Promise<{ success: boolean, error?: string }>, 
    type: 'SIGN-IN' | 'SIGN-UP'
}

const AuthForm =<T extends FieldValues> ({type, schema, defaultValues, onSubmit}:Props<T>) => {
  
    const isSignIn = type === "SIGN-IN"; 
    const router = useRouter();

    // 1. Define the form.
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>
    });

    // 2. Define a submit handler.
    const handleSubmit:SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data); 

        if (result.success) {
            toast({
                title: "Success",
                description: isSignIn
                    ? "You are succefully sign In"
                    : "You are succefully sign Up"
            });

            router.push('/');
        } else {
            toast({
                title: `Error ${isSignIn ? "Sign In": "Sign Up"}`,
                description: result?.error ?? "An error occured", 
                variant: "destructive"
            });
        }

    }

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-semibold text-white'>
                {isSignIn ? 'Welcome back' : 'Create your university library account'}
            </h1>
            <p className="text-light-100">
                {isSignIn ? "Access the vast collection of ressources,and stay updated": "Please, complete all the fields and upload a valide university ID to gain access to the library."}
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-8">
                    
                    {Object.keys(defaultValues).map((field, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={field as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='capitalize'>
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        {
                                            field.name === "universityCard" ?
                                                <ImageUpload onFileChange={field.onChange} /> :
                                                <Input
                                                    required
                                                    type={
                                                        FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                                                    }
                                                    {...field}
                                                    className="form-input"
                                                />
                                        } 
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>


                            )}
                        />
                    ))}
                    
                    
                    <Button className="form-btn" type="submit">{ isSignIn ? "Sign In": "Sign Up"}</Button>
                </form>
            </Form>
            <p>
                {isSignIn ? "New to BookWise ? " : "Already have an account ? "}
                
                <Link
                    href={isSignIn ? '/sign-up' : '/sign-in'}
                    className='font-bold text-primary'
                >
                    {isSignIn ? "Create an account" : "Sign-In"}
                </Link>
            </p>

            
        </div>
       
    )
}

export default AuthForm