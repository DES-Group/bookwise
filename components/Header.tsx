'use client'
import React from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from 'next-auth';
import { getInitials } from '@/lib/utils';
import { signOut } from 'next-auth/react';


const Header = ({session}:{session: Session}) => {
    const pathname = usePathname();

    console.log(session); 

    return (
        <header className="my-10 flex justify-between gap-5">
            <Link href="/">
                <Image src="/icons/logo.svg" alt={"logo"} width={40} height={40} />
            </Link>

            <ul className="flex items-center gap-8">
                <li>
                    <Link href="/library" className={`text-base cursor-pointer capitalize 
                    ${pathname === '/library' ? `text-light-200`: `text-light-100` }`}>
                        Library
                    </Link>
                </li>

                <li>
                    <Link href="/my-profile">
                        <Avatar>
                            <AvatarFallback className='bg-amber-100'>
                                { session.user?.name && getInitials (session?.user?.name)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
{/* 
                    <form action={async () => {
                        'use server'

                        await signOut()
                    }}>
                        <Button>Logout</Button>
                    </form> */}
                </li>
            </ul>
        </header>
    );
};

export default Header;