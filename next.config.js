/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://16.176.176.86:8080/api/:path*', // Proxy to Backend
            },
            {
                source: '/test/:path*',
                destination: 'http://16.176.176.86:8080/test/:path*', // Proxy for latency test
            },
        ];
    },
};

export default nextConfig;
