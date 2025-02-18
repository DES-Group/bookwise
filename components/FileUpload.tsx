"use client";

import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
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
  type: 'image' | 'video',
  accept: string, 
  folder:string,
  placeholder: string,
  variant: 'dark' | 'light',
  value?: string,
  onFileChange : (filePath:string) => void
}

const FileUpload = ({ type, accept, placeholder, value, folder, variant, onFileChange }: Props) => {
  
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({ filePath: value ?? null});
  const [progress, setProgress] = useState(0);

  const styles = {
    button: variant === 'dark' ? 'bg-dark-300' : 'bg-light-600 border-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-500'
    
  }
  
  const onError = (error: any) => {
    console.log(error);


    toast({
      title: `${type} upload failed`,
      description: `Your ${type} couldn't be uploaded`,
      variant: "destructive"
    })
  }
  
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: `${type} upload succesfully`,
      description: `Your ${type}* ${res.filePath} is uploaded succesfully`,
    })
  }

  const onValidate = (file: File) => {
    if (type === 'image') {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: `File size too large`,
          description: `Please, upload a file that is less than 20MB`
        });

        return false;
      }
    } else if (type === 'video') {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: `File size too large`,
          description: `Please, upload a file that is less than 50MB`
        });

        return false;
      }
    }

    return true;
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
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100); 
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
    
      />

      <button className={`upload-btn ${styles}`} onClick={(e) => {
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

        <p className={`text-base ${styles.placeholder}`}>{ placeholder}</p>
        
        {file && <p className={`upload-filename ${styles.text}`}>{file.filePath}</p>}

        {/* {file && <p className={`upload-filename`}>{file.filePath}</p>} */}

      </button>

      {(progress > 0 && progress !== 100) && (
        <div className="progress" style={{ width: `${progress}%` }}>
          {progress}%
        </div>
      )}
      
      {file && ( 
        type === 'image' ? (
          <IKImage
            path={ file.filePath || ''}
            alt={file.filePath || ''}
            width={500}
            height={300}
          />
        ) : (type === 'video' && (
            <IKVideo
              path={file.filePath || ''}
              controls={true}
              className="h-96 w-full rounded-xl"
            />
          )
        )
      )}
    </ImageKitProvider>
  )
}

export default FileUpload