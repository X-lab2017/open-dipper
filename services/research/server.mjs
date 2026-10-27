/** Loopback-only pilot. An authenticated reverse proxy supplies the gateway token. */
import http from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {validateResearch,runResearch} from './runner.mjs';
const required=['DSH_SDK_MODULE','DSH_HOME','DSH_RESEARCH_PATCH','DSH_PROVIDER','DSH_MODEL','RESEARCH_GATEWAY_TOKEN','RESEARCH_ALLOWED_ORIGIN'];
for(const name of required)if(!process.env[name])throw Error(`Missing ${name}; server not started`);
const {DeepSeekHarness}=await import(process.env.DSH_SDK_MODULE);
const config={home:process.env.DSH_HOME,patch:process.env.DSH_RESEARCH_PATCH,provider:process.env.DSH_PROVIDER,model:process.env.DSH_MODEL,runtimeEnv:Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.startsWith('RESEARCH_')))};
const token=Buffer.from('Bearer '+process.env.RESEARCH_GATEWAY_TOKEN);let active=false;
http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');
 const reply=(code,data)=>{if(!res.destroyed&&!res.writableEnded){res.writeHead(code);res.end(JSON.stringify(data));}};
 const supplied=Buffer.from(req.headers.authorization||'');if(supplied.length!==token.length||!timingSafeEqual(supplied,token))return reply(401,{error:'Authentication required'});
 if(req.headers.origin&&req.headers.origin!==process.env.RESEARCH_ALLOWED_ORIGIN)return reply(403,{error:'Origin rejected'});
 if(req.method!=='POST'||req.url!=='/research')return reply(404,{error:'Not found'});
 if(active)return reply(429,{error:'A research run is already active'});
 const controller=new AbortController();res.on('close',()=>{if(!res.writableEnded)controller.abort();});active=true;
 try{let data='',bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>250000){reply(413,{error:'Request too large'});return;}data+=chunk.toString('utf8');}let input;try{input=validateResearch(JSON.parse(data));}catch{return reply(400,{error:'Invalid research request'});}const result=await runResearch(input,{Harness:DeepSeekHarness,config,signal:controller.signal});reply(200,result);}catch{reply(502,{error:'Research failed or was cancelled; no report was substituted'});}finally{active=false;}
}).listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log('Research gateway listening on loopback'));
