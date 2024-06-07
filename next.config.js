const dotenv = require('dotenv')
dotenv.config()
/**
 * @type {import('next').NextConfig}
 **/
// next.config.js
const nextConfig = {
  images: {
    domains: ['i.ibb.co',
    'ibb.co',
    'imgbox.com',
    'icon-library.com',
    'ipfs',
    'nftstorage.link',
    'media.api-sports.io',
    'api-sports.io',
    'localhost:3000',
    'localhost',
    'fifarewardbackend.onrender.com',
    'onrender.com',
    'res.cloudinary.com',
    'ipfs.nftstorage.link'],
  },
  webpack: (config) => {
    // config.module.rules.push({
    //   test: /\.node/,
    //   use: "raw-loader",
    // });
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
return config;
  },
};
module.exports = nextConfig;