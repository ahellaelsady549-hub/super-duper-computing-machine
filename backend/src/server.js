import 'dotenv/config'; import app from './app.js'; import {connectDB} from './config/db.js';
const port=process.env.PORT||5000;
if(process.env.NODE_ENV==='production'&&!process.env.JWT_SECRET){console.error('JWT_SECRET is required in production');process.exit(1)} connectDB().then(()=>app.listen(port,()=>console.log(`REFLECT API http://localhost:${port}`))).catch(e=>{console.error(e.message);process.exit(1)});
