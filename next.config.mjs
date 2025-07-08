import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', 
    rewrites: () => [
        {
          source: '/uploads/:path*',
          destination: '/api/uploads/:path*', // dùng để lấy file

        }
      ],
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack', options: { icon: true } }]
        });
        return config;
    }
    
};

export default withNextIntl(nextConfig);