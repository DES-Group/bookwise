"use client";

import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";


const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imageKit`);

    if (!response.ok) {
      const errorText = response.text(); 

      throw new Error(`Request failed this status code ${response.status}:${errorText}`);
    }

    const data = await response.json();
    const { token, signature, expire } = data; 
    
    return { token, signature, expire }; 

  } catch (error: any) {
    throw new Error(`Authentication request failed : ${error}` )
  }
}

const {
  env: {
    imagekit: { publicKey, urlEndpoint }
  }
} = config;


type Props = {
  onFileChange : (filePath:string) => void
}

const ImageUpload = ({onFileChange}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{filePath:string} | null>(null);
  
  const onError = (error: any) => {
    console.log(error);


    toast({
      title: "Image upload failed",
      description: `Your image couldn't be uploaded`,
      variant: "destructive"
    })
  }
  
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: "Image upload succesfully",
      description: `Your image ${res.filePath} is uploaded succesfully`,
    })
  }


  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />

      <button className="upload-btn" onClick={(e) => {
        e.preventDefault();

        if (ikUploadRef.current) {
          // @ts-ignore 
          ikUploadRef.current?.click();
        }
      }}>
        <Image
          src="/icons/upload.svg"
          alt="upload a file"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className="text-base text-light-100">Upload a file</p>
        {file && <p className="upload-filename">{ file.filePath}</p>}
      </button>
      
      {file && (
        <IKImage
          path={file.filePath}
          alt={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  )
}

export default ImageUpload