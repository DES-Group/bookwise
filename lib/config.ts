/** The ! tells typescript that those variables environments are strings */

const config = {
    env: {
        imagekit: {
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!, 
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!, 
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!
        }, 
        apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!, 
        prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
        databaseUrl: process.env.DATABASE_URL!,
        upstash: {
            redisUrl: process.env.UPSTASH_REDIS_REST_URL, 
            redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!, 
            qstashUrl: process.env.QSTASH_URL!, 
            qstashToken: process.env.QSTASH_TOKEN!, 
            qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!, 
            qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!
        }, 
        resendToken: process.env.RESEND_TOKEN!, 
        emailjs: {
            serviceId: process.env.EMAILJS_SERVICE_ID!, 
            templateId: process.env.EMAILJS_TEMPLATE_ID!,  
            publicKey: process.env.EMAILJS_USER_PUBLIC_KEY!
        }
    }
}

export default config;