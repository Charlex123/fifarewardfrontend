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
    'ipfs',
    'nftstorage.link',
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