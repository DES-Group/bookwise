"use client"

import config from '@/lib/config'
import { IKVideo, ImageKitProvider } from 'imagekitio-next'
import React from 'react'

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  
    return (
        <ImageKitProvider
            urlEndpoint={config.env.imagekit.urlEndpoint}
            publicKey={config.env.imagekit.publicKey}
        >
            <IKVideo path={videoUrl} controls={true} className="w-full rounded-xl" />
        </ImageKitProvider>
  )
}

export default BookVideo