/** @type {import('next').NextConfig} */
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true, // Shows the exact URL being fetched
    },
    browserToTerminal: 'error' //forward browser console logs
  },
};

const configFunc = (phase, _) => {
  console.log("phase", phase);
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    const config = {
      ...nextConfig,
      compiler: {
        removeConsole: {
          exclude: ['error'],
        },
      },
    };
    console.log("process.env.NEXT_PUBLIC_USE_EXPORT", process.env.NEXT_PUBLIC_USE_EXPORT);
    if (process.env.NEXT_PUBLIC_USE_EXPORT === 'true') {
      config.output = 'export';
      config.distDir = 'out';
      config.exclude = ['api']; //static page, no server
      config.images = { unoptimized: true };
    }
    if (process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH.trim() !== '') {
      config.basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    }
    console.log("config", config);
    return config;
  }
  return nextConfig;
}

export default configFunc;
