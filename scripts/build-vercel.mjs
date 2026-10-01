import {readFileSync,writeFileSync} from 'node:fs';
// Vercel supplies the stable production hostname during its build.
const hostname=process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.PUSOY_PUBLIC_HOST;
if(hostname){const origin='https://'+hostname.replace(/^https?:\/\//,'').replace(/\/$/,'');let html=readFileSync('public/index.html','utf8');html=html.replaceAll('https://sunday-pusoy-club.spastores70.chatgpt.site',origin);writeFileSync('public/index.html',html);}
console.log('Pusoy frontend and room API proxy are ready.');
