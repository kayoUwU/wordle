/** @type {import('next').NextConfig} */
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const nextConfig = {};

const configFunc = (phase, _) => {
    console.log("phase", phase);
    if (phase !== PHASE_DEVELOPMENT_SERVER) {
        const config = {
            ...nextConfig,
        };
        console.log("process.env.USE_EXPORT",process.env.USE_EXPORT);
        if(process.env.USE_EXPORT==='true'){
            config.output = 'export';
            config.distDir = 'out';
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
