/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, 
    experimental: {
        serverActions: true,
      },
    env: {

    },
    images: {
    domains: ['notifydocuments.s3.us-east-1.amazonaws.com'],
},
}

module.exports = nextConfig
