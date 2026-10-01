const BACKEND='https://sunday-pusoy-club.spastores70.chatgpt.site';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(!['GET','POST'].includes(req.method)){res.status(405).json({error:'Method not allowed.'});return;}
 const url=new URL(req.url,'https://'+(req.headers.host||'localhost'));
 if(!/^\/api\/rooms(?:\/[A-Z2-9]{8}(?:\/(join|start|next|submit|leave|reset|kick|chat))?)?$/.test(url.pathname)){res.status(404).json({error:'Room route not found.'});return;}
 const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host){res.status(403).json({error:'Cross-site requests are not allowed.'});return;}
 const body=req.method==='POST'?(typeof req.body==='string'?req.body:JSON.stringify(req.body||{})):undefined;
 if(body&&Buffer.byteLength(body)>16384){res.status(413).json({error:'Request is too large.'});return;}
 try{const upstream=await fetch(BACKEND+url.pathname,{method:req.method,headers:{'Content-Type':'application/json',Origin:BACKEND,...req.headers.authorization?{Authorization:req.headers.authorization}:{}},body,signal:AbortSignal.timeout(12000),redirect:'error'});res.status(upstream.status).setHeader('Content-Type','application/json');res.send(await upstream.text());}
 catch{res.status(503).json({error:'The table service is temporarily unavailable. Please try again.'});}
}
