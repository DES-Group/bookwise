"use client"

import BookCoverSvg from "@/components/BookCoverSvg"
import config from "@/lib/config";
import { IKImage } from "imagekitio-next";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide" ;

const variantStyle:Record<BookCoverVariant, string> = {
    extraSmall: "book-cover_extra_small",
    small: "book-cover_small",
    medium: "book-cover_medium",
    regular: "book-cover_regular",
    wide: "book-cover_wide"
};


interface BookCoverType {
    variant?: BookCoverVariant;
    className?: string;
    coverColor: string;
    coverImage: string;
}

const BookCover = (
    {
        variant = "regular",
        className ,
        coverColor = "#012848",
        coverImage = "https://placehold.co/400*600.png"
    }:BookCoverType) => {
    return (
        <div className={`relative transition-all duration-300 ${variantStyle[variant]} ${className}`}>
            <BookCoverSvg coverColor={coverColor} />

            <div
                className={"absolute z-10"}
                style={{left: "12%", width: "87.5%", height: "88%" }}
            >
                <IKImage
                    path={coverImage}
                    urlEndpoint={config.env.imagekit.urlEndpoint}
                    alt={"Book cover"}
                    fill
                    className={"rounded-sm object-fill"}
                    loading="lazy"
                    lqip={{active: true}}
                />
            </div>
        </div>
    );
};

export default BookCover;